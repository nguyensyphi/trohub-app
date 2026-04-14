const asyncHandler = require("express-async-handler")
const db = require("../models")
const randomstring = require("randomstring")
const { sendMail, readHtmlTemplate } = require("../utils/helpers")
const { Sequelize, Op } = require("sequelize")
const bcrypt = require("bcryptjs")
const { errorMonitor } = require("nodemailer/lib/mailer")

const accountSid = process.env.TWILLO_ACCOUNT_SSD
const authToken = process.env.TWILLO_AUTH_TOKEN
const serviceSid = process.env.TWILLO_SERVICE_SID

let client = null
if (accountSid && authToken && accountSid.startsWith("AC")) {
  client = require("twilio")(accountSid, authToken)
} else {
  console.warn("Twilio is not configured correctly. OTP SMS features are disabled.")
}

module.exports = {
  getMe: asyncHandler(async (req, res) => {
    const { uid } = req.user

    const user = await db.User.findByPk(uid, {
      attributes: {
        exclude: ["password", "resetPwdExpiry", "resetPwdToken"],
      },
      include: [{ model: db.Wishlist, as: "rWishlist" }],
    })
    return res.json({
      success: !!user,
      user,
      msg: !!user ? "OK" : "Không tìm thấy user.",
    })
  }),
  sendOTP: asyncHandler(async (req, res) => {
    const { phone } = req.body
    const { uid } = req.user

    if (!client || !serviceSid) {
      return res.json({
        success: false,
        msg: "Dịch vụ OTP tạm thời không khả dụng.",
      })
    }

    // KT SĐT đã sử dụng
    const user = await db.User.findOne({ where: { phone } })
    if (user && +user.id !== +uid)
      return res.json({
        success: false,
        msg: "Số điện thoại đã được đăng ký.",
      })
    await client.verify.v2
      .services(serviceSid)
      .verifications.create({ to: phone, channel: "sms" })
      .then(() => {
        return res.json({
          success: true,
          msg: "Mã OTP đã gửi thành công.",
        })
      })
      .catch((err) => {
        console.log(err)
        return res.json({
          success: false,
          msg: "Mã OTP đã gửi không thành công.",
        })
      })
  }),
  verifyOTP: asyncHandler(async (req, res) => {
    const { uid } = req.user
    const { phone, code } = req.body

    if (!client || !serviceSid) {
      return res.json({
        success: false,
        msg: "Dịch vụ OTP tạm thời không khả dụng.",
      })
    }

    const formattedPhone = phone.replace("+84", "0")

    await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: phone, code })
      .then(async () => {
        const updatedUser = await db.User.update(
          { phone: formattedPhone, phoneVerified: true },
          { where: { id: uid } }
        )
        return res.json({
          success: updatedUser[0] > 0,
          msg:
            updatedUser[0] > 0 ? "Xác minh điện thoại thành công." : "Xác minh điện thoại không thành công.",
        })
      })
      .catch(() => {
        return res.json({
          success: false,
          msg: "Xác minh điện thoại không thành công.",
        })
      })
  }),
  updateProfile: asyncHandler(async (req, res) => {
    const { uid } = req.user
    const { avatar, fullname } = req.body

    const response = await db.User.update({ fullname, avatar: avatar[0] }, { where: { id: uid } })
    const isSuccess = response[0] > 0
    if (!isSuccess)
      return res.json({
        success: !isSuccess,
        msg: "Cập nhật thông tin không thành công.",
      })
    const user = await db.User.findByPk(uid, {
      attributes: [
        "email",
        "id",
        "fullname",
        "phone",
        "createdAt",
        "balance",
        "role",
        "avatar",
        "phoneVerified",
        "emailVerified",
      ],
    })
    return res.json({
      success: isSuccess,
      msg: "Cập nhật thông tin thành công.",
      user,
    })
  }),
  resetPasswordRequired: asyncHandler(async (req, res) => {
    const { email } = req.body

    const user = await db.User.findOne({ where: { email } })

    if (!user)
      return res.json({
        success: false,
        msg: "Không tìm thấy email.",
      })

    const resetPwdToken = randomstring.generate({
      length: 6,
      charset: "numeric",
    })

    const resetPwdExpiry = Date.now() + 5 * 60 * 1000

    const response = await db.User.update({ resetPwdExpiry, resetPwdToken }, { where: { id: user.id } })

    if (response[0] === 0)
      return res.json({
        success: false,
        msg: "Không tìm thấy user.",
      })

    const emailContent = readHtmlTemplate(resetPwdToken)

    const mailOptions = {
      from: `"Trohub" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Reset mật khẩu",
      html: emailContent,
    }
    const status = await sendMail(mailOptions)
    return res.json({
      success: status,
      msg: status ? "Gửi mail thành công." : "Gửi mail không thành công.",
    })
  }),

  resetPasswordVerify: asyncHandler(async (req, res) => {
    const { otp, email, password } = req.body
    const user = await db.User.findOne({
      where: { email },
      attributes: ["resetPwdToken", "resetPwdExpiry", "id"],
    })

    if (!user)
      return res.json({
        success: false,
        msg: "Không tìm thấy user.",
      })

    const isValidOtp =
      user.resetPwdToken === otp && new Date(user.resetPwdExpiry).getTime() > new Date().getTime()
    if (!isValidOtp)
      return res.json({
        success: false,
        msg: "Otp không hợp lệ hoặc đã hết hạn.",
      })
    const hashedPassword = await bcrypt.hash(password, 10)
    const response = await db.User.update(
      { resetPwdExpiry: null, resetPwdToken: null, password: hashedPassword },
      { where: { id: user.id } }
    )

    const isSuccess = response[0] > 0
    return res.json({
      success: isSuccess,
      msg: isSuccess ? "Cập nhật mật khẩu thành công." : "Cập nhật mật khẩu không thành công.",
    })
  }),
  sendOtpEmail: asyncHandler(async (req, res) => {
    const { email } = req.body
    const { uid } = req.user

    const user = await db.User.findOne({ where: { email } })
    if (user && +user.id !== +uid)
      return res.json({
        success: false,
        msg: "Email đã được đăng ký.",
      })

    const resetPwdToken = randomstring.generate({
      length: 6,
      charset: "numeric",
    })

    const resetPwdExpiry = Date.now() + 5 * 60 * 1000

    const response = await db.User.update({ resetPwdExpiry, resetPwdToken }, { where: { id: uid } })

    if (response[0] === 0)
      return res.json({
        success: false,
        msg: "Không tìm thấy user.",
      })

    const emailContent = readHtmlTemplate(resetPwdToken)

    const mailOptions = {
      from: `"Trohub" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: emailContent,
    }
    const status = await sendMail(mailOptions)
    return res.json({
      success: status,
      msg: status ? "Gửi mail thành công." : "Gửi mail không thành công.",
    })
  }),

  verifyEmail: asyncHandler(async (req, res) => {
    const { email, otp } = req.body
    const { uid } = req.user

    const user = await db.User.findByPk(uid, { attributes: ["resetPwdToken", "resetPwdExpiry"] })
    if (!user)
      return res.json({
        success: false,
        msg: "Không tìm thấy user.",
      })
    const isValidOtp =
      user.resetPwdToken === otp && new Date(user.resetPwdExpiry).getTime() > new Date().getTime()
    if (!isValidOtp)
      return res.json({
        success: false,
        msg: "Otp không hợp lệ hoặc đã hết hạn.",
      })

    const response = await db.User.update(
      { email, emailVerified: true, resetPwdExpiry: null, resetPwdToken: null },
      { where: { id: uid } }
    )

    const isSuccess = response[0] > 0
    return res.json({
      success: isSuccess,
      msg: isSuccess ? "Xác minh email thành công." : "Xác minh email không thành công.",
    })
  }),
  deposit: asyncHandler(async (req, res) => {
    const { uid } = req.user
    const { amount } = req.body
    const payload = {
      amount,
      idUser: uid,
      status: "Thành công",
      method: "VNPay/Paypal",
      idInvoice: randomstring.generate(8).toUpperCase(),
    }
    const [updateUser, payment] = await Promise.all([
      db.User.increment("balance", { by: amount, where: { id: uid } }),
      db.Payment.create(payload),
    ])

    const isSuccess = !!payment
    if (!isSuccess)
      await Promise.all([
        db.User.decrement("balance", { by: amount, where: { id: uid } }),
        db.Payment.destroy({ where: { id: payment.id } }),
      ])

    return res.json({
      success: isSuccess,
      msg: isSuccess ? "Nạp tiền thành công." : "Có lỗi, hãy thữ lại",
    })
  }),
  addWishlist: asyncHandler(async (req, res) => {
    const { uid } = req.user
    const payload = {
      idPost: req.body.idPost,
      idUser: uid,
    }
    const response = await db.Wishlist.findOrCreate({
      where: payload,
      defaults: payload,
    })

    if (!response[1]) {
      await db.Wishlist.destroy({
        where: payload,
      })
    }
    return res.json({
      success: true,
      msg: "Đã cập nhật tin đăng yêu thích.",
    })
  }),
  getWishlist: asyncHandler(async (req, res) => {
    const { uid } = req.user
    const response = await db.Wishlist.findAll({
      where: { idUser: uid },
      include: [{ model: db.Post, as: "rPost" }],
    })

    return res.json({
      success: true,
      wls: response,
    })
  }),
  getSeenPost: asyncHandler(async (req, res) => {
    const { uid } = req.user
    const response = await db.SeenPost.findAll({
      where: { idUser: uid },
      include: [{ model: db.Post, as: "rPost" }],
    })

    return res.json({
      success: true,
      seenPosts: response,
    })
  }),
  expirePost: asyncHandler(async (req, res) => {
    const { uid } = req.user
    const { total, idPost, days } = req.body

    const [response] = await Promise.all([
      db.Expired.create({
        idPost,
        idUser: uid,
        days,
        total,
        status: "Thành công",
        idInvoice: randomstring.generate(8).toUpperCase(),
      }),
      db.User.decrement({ balance: total }, { where: { id: uid } }),
      db.Post.update({ expiredDate: Date.now() + days * 24 * 3600 * 1000 }, { where: { id: idPost } }),
    ])

    if (response)
      return res.json({
        success: !!response,
        msg: response ? "Gia hạn thành công." : "Gia hạn thất bại.",
      })
  }),
  getUserAdmin: asyncHandler(async (req, res) => {
    const { limit = 5, sort = "createdAt", order = "DESC", page = 1, fullname, ...rest } = req.query

    const whereClause = rest

    const sortBy = [[sort, order.toUpperCase()]]

    const offset = (parseInt(page) - 1) * parseInt(limit)

    if (fullname) whereClause.fullname = { [Op.iLike]: `%${fullname}%` }

    const users = await db.User.findAll({
      where: whereClause,
      limit,
      offset,
      order: sortBy,
      attributes: {
        exclude: ["password", "resetPwdToken", "resetPwdExpiry"],
      },
    })
    const count = await db.User.count({ where: whereClause })

    return res.json({
      success: true,
      users,
      pagination: {
        limit,
        page,
        count,
        totalPages: Math.ceil(count / limit),
      },
    })
  }),

  deleteUserByAdmin: asyncHandler(async (req, res) => {
    const { idUsers } = req.query

    const response = await db.User.destroy({ where: { id: idUsers } })

    const isSuccess = response > 0
    return res.json({
      success: isSuccess,
      msg: isSuccess ? "Xóa thành viên thành công." : "Xóa thành viên không thành công.",
    })
  }),

  updateUserByAdmin: asyncHandler(async (req, res) => {
    const { role } = req.body
    const { id } = req.params

    const response = await db.User.update({ role }, { where: { id } })

    const isSuccess = response[0] > 0
    return res.json({
      success: isSuccess,
      msg: isSuccess
        ? "Cập nhật vai trò thành viên thành công."
        : "Cập nhật vai trò thành viên không thành công.",
    })
  }),
  getDashboard: asyncHandler(async (req, res) => {
    const { days, type, from, to } = req.query
    const daysQuery = days || 220
    const typeDate = type === "month" ? "mm-yy" : "dd-mm-yy"
    const start = from || Date.now() - daysQuery * 24 * 60 * 60 * 1000
    const end = to || Date.now()
    const q = {}
    if (from && to) {
      if (from === to)
        q.createdAt = { [Op.and]: [{ [Op.gte]: `${from} 00:00:00` }, { [Op.lte]: `${from} 23:59:59` }] }
      else q.createdAt = { [Op.and]: [{ [Op.lte]: `${end} 23:59:59` }, { [Op.gte]: `${start} 00:00:00` }] }
    }
    const [views, posts, users, incomes] = await Promise.all([
      db.View.findByPk(1, { attributes: ["anonymous", "registed"], raw: true }),
      db.Post.findAll({
        where: q,
        attributes: [
          [Sequelize.fn("to_char", Sequelize.col("createdAt"), typeDate), "date"],
          [Sequelize.fn("COUNT", Sequelize.col("id")), "createdPost"],
        ],
        group: "Post.createdAt",
        order: [["createdAt", "ASC"]],
      }),
      db.User.findAll({
        where: q,
        raw: true,
        attributes: [
          // [Sequelize.fn("date_format", Sequelize.col("createdAt"), typeDate), "date"],
          [Sequelize.fn("COUNT", Sequelize.col("id")), "createdUser"],
        ],
        // group: "date",
        // order: [["createdAt", "ASC"]],
      }),
      db.Payment.findAll({
        where: q,
        raw: true,
        attributes: [[Sequelize.fn("SUM", Sequelize.col("amount")), "totalIncomes"]],
      }),
    ])
    return res.json({
      success: true,
      data: { ...views, posts, ...users[0], ...incomes[0] },
    })
  }),
  updateViews: asyncHandler(async (req, res) => {
    const user = req.user
    const response = await db.View.findAll()

    if (response.length === 0) {
      await db.View.create({})
    }

    if (user?.uid) await db.View.increment({ registed: 1 }, { where: { id: 1 } })
    else {
      await db.View.increment({ anonymous: 1 }, { where: { id: 1 } })
    }

    return res.status(204).end()
  }),
  updateRoleOwner: asyncHandler(async (req, res) => {
    const { uid } = req.user
    const user = await db.User.findByPk(uid)
    if (!user || !user.phoneVerified || !user.emailVerified || user.balance === 0) {
      return res.json({
        success: false,
        msg: "Bạn chưa đủ điều kiện nâng cấp thành chủ trọ.",
      })
    }
    const response = await db.User.update({ role: "Chủ trọ" }, { where: { id: uid } })
    const isSuccess = response[0] > 0
    return res.json({
      success: isSuccess,
      msg: isSuccess
        ? "Nâng cấp thành công, bạn hãy đăng nhập lại để cập nhật nhé."
        : "Nâng cấp thất bại, hãy thử lại sau.",
    })
  }),
  getPaymentHistory: asyncHandler(async (req, res) => {
    const { uid } = req.user
    const { limit = 5, sort = "createdAt", order = "DESC", page = 1, title, ...rest } = req.query

    const whereClause = rest
    whereClause.idUser = uid

    const sortBy = [[sort, order.toUpperCase()]]

    const offset = (parseInt(page) - 1) * parseInt(limit)

    if (title) whereClause.title = { [Op.iLike]: `%${title}%` }

    const payments = await db.Payment.findAll({ where: whereClause, limit, offset, order: sortBy })
    const count = await db.Payment.count({ where: whereClause })

    return res.json({
      success: true,
      payments,
      pagination: {
        limit,
        page,
        count,
        totalPages: Math.ceil(count / limit),
      },
    })
  }),
  getExpiredHistory: asyncHandler(async (req, res) => {
    const { uid } = req.user
    const { limit = 5, sort = "createdAt", order = "DESC", page = 1, title, ...rest } = req.query

    const whereClause = rest
    whereClause.idUser = uid

    const sortBy = [[sort, order.toUpperCase()]]

    const offset = (parseInt(page) - 1) * parseInt(limit)

    if (title) whereClause.title = { [Op.iLike]: `%${title}%` }

    const payments = await db.Expired.findAll({
      where: whereClause,
      limit,
      offset,
      order: sortBy,
      include: [
        { model: db.Post, as: "rPost", attributes: ["id", "title", "expiredDate"] },
        { model: db.User, as: "rUser", attributes: ["id", "fullname"] },
      ],
    })
    const count = await db.Expired.count({ where: whereClause })

    return res.json({
      success: true,
      payments,
      pagination: {
        limit,
        page,
        count,
        totalPages: Math.ceil(count / limit),
      },
    })
  }),
}
