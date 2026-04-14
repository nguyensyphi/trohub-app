const asyncHandler = require("express-async-handler")
const db = require("../models")
const querystring = require("qs")
const moment = require("moment")
const crypto = require("crypto")
const http = require("http")
const https = require("https")
const { sortObject } = require("../utils/helpers")
const randomstring = require("randomstring")

const vnp_TmnCode = process.env.VNP_TMNCODE
const vnp_ReturnUrl = process.env.VNP_RETURN_URL
const vnp_Url = process.env.VNP_URL
const vnp_hashSecret = process.env.VNP_HASHSECRET
const bankCode = process.env.VNP_BANKCODE
const clientPaymentReturnUrl = process.env.CLIENT_PAYMENT_RETURN_URL
const momoPartnerCode = process.env.MOMO_PARTNER_CODE
const momoAccessKey = process.env.MOMO_ACCESS_KEY
const momoSecretKey = process.env.MOMO_SECRET_KEY
const momoPartnerName = process.env.MOMO_PARTNER_NAME || "TroHub"
const momoStoreId = process.env.MOMO_STORE_ID || "TroHubStore"
const momoEndpoint = process.env.MOMO_ENDPOINT
const momoRedirectUrl = process.env.MOMO_REDIRECT_URL
const momoIpnUrl = process.env.MOMO_IPN_URL
const momoRequestType = process.env.MOMO_REQUEST_TYPE || "captureWallet"
const momoLang = process.env.MOMO_LANG || "vi"

const createPaymentUrl = ({ amount, ipAddr, orderInfo }) => {
  process.env.TZ = "Asia/Ho_Chi_Minh"

  const date = new Date()
  const createDate = moment(date).format("YYYYMMDDHHmmss")
  const orderId = moment(date).format("DDHHmmss")

  let vnp_Params = {}
  vnp_Params["vnp_Version"] = "2.1.0"
  vnp_Params["vnp_Command"] = "pay"
  vnp_Params["vnp_TmnCode"] = vnp_TmnCode
  vnp_Params["vnp_Locale"] = "vn"
  vnp_Params["vnp_Amount"] = amount * 100 // Số tiền VNPay tính bằng VND
  vnp_Params["vnp_CurrCode"] = "VND"
  vnp_Params["vnp_TxnRef"] = orderId // Mã giao dịch
  vnp_Params["vnp_OrderInfo"] = orderInfo
  vnp_Params["vnp_OrderType"] = "other"
  vnp_Params["vnp_ReturnUrl"] = vnp_ReturnUrl
  vnp_Params["vnp_IpAddr"] = ipAddr
  vnp_Params["vnp_CreateDate"] = createDate
  vnp_Params["vnp_BankCode"] = bankCode

  vnp_Params = sortObject(vnp_Params)

  const signData = querystring.stringify(vnp_Params, { encode: false })
  const hmac = crypto.createHmac("sha512", vnp_hashSecret)
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex")

  vnp_Params["vnp_SecureHash"] = signed

  return `${vnp_Url}?${querystring.stringify(vnp_Params, { encode: false })}`
}

const isMomoConfigured = () =>
  !!(
    momoPartnerCode &&
    momoAccessKey &&
    momoSecretKey &&
    momoEndpoint &&
    momoRedirectUrl &&
    momoIpnUrl
  )

const signMomo = (rawSignature) => {
  return crypto.createHmac("sha256", momoSecretKey).update(rawSignature).digest("hex")
}

const buildMomoCreateRawSignature = ({
  amount,
  extraData,
  orderId,
  orderInfo,
  redirectUrl,
  ipnUrl,
  requestId,
  requestType,
}) => {
  return `accessKey=${momoAccessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${momoPartnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`
}

const buildMomoResponseRawSignature = (params) => {
  const safeGet = (key) => params?.[key] ?? ""
  return `accessKey=${momoAccessKey}&amount=${safeGet("amount")}&extraData=${safeGet(
    "extraData"
  )}&message=${safeGet("message")}&orderId=${safeGet("orderId")}&orderInfo=${safeGet(
    "orderInfo"
  )}&orderType=${safeGet("orderType")}&partnerCode=${safeGet("partnerCode")}&payType=${safeGet(
    "payType"
  )}&requestId=${safeGet("requestId")}&responseTime=${safeGet("responseTime")}&resultCode=${safeGet(
    "resultCode"
  )}&transId=${safeGet("transId")}`
}

const verifyMomoSignature = (params) => {
  if (!params?.signature) return false
  const rawSignature = buildMomoResponseRawSignature(params)
  const signed = signMomo(rawSignature)
  return signed === params.signature
}

const requestMomo = (payload) =>
  new Promise((resolve, reject) => {
    const parsedUrl = new URL(momoEndpoint)
    const requestData = JSON.stringify(payload)
    const transport = parsedUrl.protocol === "http:" ? http : https
    const req = transport.request(
      {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (parsedUrl.protocol === "http:" ? 80 : 443),
        path: `${parsedUrl.pathname}${parsedUrl.search || ""}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(requestData),
        },
      },
      (response) => {
        let body = ""
        response.on("data", (chunk) => {
          body += chunk
        })
        response.on("end", () => {
          try {
            const parsed = JSON.parse(body || "{}")
            resolve(parsed)
          } catch (error) {
            reject(error)
          }
        })
      }
    )

    req.on("error", reject)
    req.write(requestData)
    req.end()
  })

const extractUidFromMomoPayload = ({ orderInfo = "", extraData = "" }) => {
  const orderInfoMatch = `${orderInfo}`.match(/TOPUP_UID_(\d+)/)
  if (orderInfoMatch?.[1]) return Number(orderInfoMatch[1])

  if (!extraData) return null
  try {
    const decoded = Buffer.from(extraData, "base64").toString("utf8")
    const parsed = JSON.parse(decoded)
    if (parsed?.uid) return Number(parsed.uid)
  } catch (error) {
    console.log(error)
  }
  return null
}

const processMomoTopup = async ({ amount, orderId, orderInfo, extraData }) => {
  const normalizedAmount = Number(amount)
  const idUser = extractUidFromMomoPayload({ orderInfo, extraData })

  if (!idUser || !orderId || !Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
    return false
  }

  const user = await db.User.findByPk(idUser, { attributes: ["id"], raw: true })
  if (!user) return false

  try {
    await db.sequelize.transaction(async (transaction) => {
      const existedPayment = await db.Payment.findOne({
        where: { idInvoice: orderId, method: "MoMo" },
        transaction,
        lock: transaction.LOCK.UPDATE,
      })

      // IPN và redirect có thể cùng gọi, chỉ xử lý cộng tiền đúng 1 lần.
      if (existedPayment) return

      await db.User.increment("balance", { by: normalizedAmount, where: { id: idUser }, transaction })
      await db.Payment.create(
        {
          amount: normalizedAmount,
          idUser,
          status: "Thành công",
          method: "MoMo",
          idInvoice: orderId,
        },
        { transaction }
      )
    })
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

module.exports = {
  depositMoney: asyncHandler(async (req, res) => {
    const { amount } = req.body
    const { uid } = req.user

    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress

    const paymentUrl = createPaymentUrl({ amount, orderInfo: `Nap tien vao tai khoan -${uid}`, ipAddr })

    return res.json({
      success: true,
      paymentUrl,
    })
  }),

  handleVnpReturn: asyncHandler(async (req, res) => {
    let vnp_Params = req.query
    const secureHash = vnp_Params["vnp_SecureHash"]

    delete vnp_Params["vnp_SecureHash"]
    delete vnp_Params["vnp_SecureHashType"]

    vnp_Params = sortObject(vnp_Params)

    const signData = querystring.stringify(vnp_Params, { encode: false })
    const hmac = crypto.createHmac("sha512", vnp_hashSecret)
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex")

    if (secureHash !== signed) {
      return res.redirect(clientPaymentReturnUrl + "97")
    }
    const isSuccess = +vnp_Params.vnp_TransactionStatus === 0
    if (!isSuccess) return res.redirect(clientPaymentReturnUrl + "02")
    // TODO
    try {
      const orderInfo = vnp_Params.vnp_OrderInfo

      const amount = +vnp_Params.vnp_Amount / 100 || 0
      const idUser = orderInfo.split("-")[orderInfo.split("-").length - 1]

      const payload = {
        amount,
        idUser,
        status: "Thành công",
        method: "VNPay",
        idInvoice: randomstring.generate(8).toUpperCase(),
      }

      const [updateUser, payment] = await Promise.all([
        db.User.increment("balance", { by: amount, where: { id: idUser } }),
        db.Payment.create(payload),
      ])

      const isSuccess = !!payment
      if (!isSuccess)
        await Promise.all([
          db.User.decrement("balance", { by: amount, where: { id: idUser } }),
          db.Payment.destroy({ where: { id: payment.id } }),
        ])

      return res.redirect(clientPaymentReturnUrl + "00")
    } catch (error) {
      console.log(error)
      return res.redirect(clientPaymentReturnUrl + "02")
    }
  }),
  createMomoPayment: asyncHandler(async (req, res) => {
    const { amount } = req.body
    const { uid } = req.user

    if (!isMomoConfigured()) {
      return res.json({
        success: false,
        msg: "Cấu hình MoMo chưa đầy đủ.",
      })
    }

    const normalizedAmount = Number(amount)
    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0 || !Number.isInteger(normalizedAmount)) {
      return res.json({
        success: false,
        msg: "Số tiền không hợp lệ. MoMo chỉ hỗ trợ đơn vị VND nguyên.",
      })
    }

    const orderId = `MOMO${Date.now()}${randomstring.generate({ length: 4, charset: "numeric" })}`
    const requestId = `${orderId}_${uid}`
    const orderInfo = `TOPUP_UID_${uid}`
    const extraData = Buffer.from(JSON.stringify({ uid })).toString("base64")

    const rawSignature = buildMomoCreateRawSignature({
      amount: normalizedAmount,
      extraData,
      orderId,
      orderInfo,
      ipnUrl: momoIpnUrl,
      redirectUrl: momoRedirectUrl,
      requestId,
      requestType: momoRequestType,
    })

    const signature = signMomo(rawSignature)

    const payload = {
      partnerCode: momoPartnerCode,
      partnerName: momoPartnerName,
      storeId: momoStoreId,
      requestId,
      amount: `${normalizedAmount}`,
      orderId,
      orderInfo,
      redirectUrl: momoRedirectUrl,
      ipnUrl: momoIpnUrl,
      lang: momoLang,
      requestType: momoRequestType,
      autoCapture: true,
      extraData,
      orderGroupId: "",
      signature,
    }

    try {
      const response = await requestMomo(payload)
      if (+response?.resultCode !== 0 || !response?.payUrl) {
        return res.json({
          success: false,
          msg: response?.message || "Không thể tạo giao dịch MoMo.",
        })
      }
      return res.json({
        success: true,
        paymentUrl: response.payUrl,
      })
    } catch (error) {
      console.log(error)
      return res.json({
        success: false,
        msg: "Không thể kết nối cổng MoMo.",
      })
    }
  }),
  handleMomoReturn: asyncHandler(async (req, res) => {
    const payload = req.query

    if (!verifyMomoSignature(payload)) {
      return res.redirect(clientPaymentReturnUrl + "97")
    }

    if (+payload?.resultCode !== 0) {
      return res.redirect(clientPaymentReturnUrl + "02")
    }

    const isSuccess = await processMomoTopup({
      amount: payload.amount,
      orderId: payload.orderId,
      orderInfo: payload.orderInfo,
      extraData: payload.extraData,
    })

    if (!isSuccess) return res.redirect(clientPaymentReturnUrl + "02")
    return res.redirect(clientPaymentReturnUrl + "00")
  }),
  handleMomoIpn: asyncHandler(async (req, res) => {
    const payload = req.body

    if (!verifyMomoSignature(payload)) {
      return res.status(200).json({
        partnerCode: momoPartnerCode,
        requestId: payload?.requestId,
        orderId: payload?.orderId,
        resultCode: 97,
        message: "Invalid signature",
      })
    }

    if (+payload?.resultCode !== 0) {
      return res.status(200).json({
        partnerCode: momoPartnerCode,
        requestId: payload?.requestId,
        orderId: payload?.orderId,
        resultCode: 0,
        message: "Received",
      })
    }

    const isSuccess = await processMomoTopup({
      amount: payload.amount,
      orderId: payload.orderId,
      orderInfo: payload.orderInfo,
      extraData: payload.extraData,
    })

    if (!isSuccess) {
      return res.status(200).json({
        partnerCode: momoPartnerCode,
        requestId: payload?.requestId,
        orderId: payload?.orderId,
        resultCode: 99,
        message: "Process failed",
      })
    }

    return res.status(200).json({
      partnerCode: momoPartnerCode,
      requestId: payload?.requestId,
      orderId: payload?.orderId,
      resultCode: 0,
      message: "Success",
    })
  }),
}
