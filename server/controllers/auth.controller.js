const asyncHandler = require("express-async-handler")
const db = require("../models")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

module.exports = {
  registerWithPhone: asyncHandler(async (req, res) => {
    const { fullname, password, phone } = req.body

    const alreadyUser = await db.User.findOne({ where: { phone }, raw: true })
    if (alreadyUser)
      return res.json({
        success: false,
        msg: "Số điện thoại đã được đăng ký.",
      })

    const hashedPassword = await bcrypt.hash(password, 10)
    const response = await db.User.create({ fullname, phone, password: hashedPassword })

    return res.json({
      success: !!response,
      msg: response ? "Đăng ký thành công." : "Đăng ký tài khoản thất bại!",
    })
  }),

  registerWithEmail: asyncHandler(async (req, res) => {
    const { fullname, password, email } = req.body

    const alreadyUser = await db.User.findOne({ where: { email }, raw: true })
    if (alreadyUser)
      return res.json({
        success: false,
        msg: "Email đã được đăng ký.",
      })

    const hashedPassword = await bcrypt.hash(password, 10)
    const response = await db.User.create({ fullname, email, password: hashedPassword })

    return res.json({
      success: !!response,
      msg: response ? "Đăng ký thành công." : "Đăng ký tài khoản thất bại!",
    })
  }),

  loginWithPhone: asyncHandler(async (req, res) => {
    const { password, phone } = req.body

    const alreadyUser = await db.User.findOne({ where: { phone }, raw: true })
    if (!alreadyUser)
      return res.json({
        success: false,
        msg: "Số điện thoại chưa được đăng ký!",
      })
    const isCorrentPassword = bcrypt.compareSync(password, alreadyUser.password)
    if (!isCorrentPassword)
      return res.json({
        success: false,
        msg: "Mật khẩu không chính xác!",
      })

    const token = jwt.sign({ uid: alreadyUser.id }, process.env.JWT_SECRET, { expiresIn: "7d" })
    return res.json({
      success: true,
      accessToken: token,
      msg: !!token ? "Đăng nhập thành công" : "Invalid Credentials.",
    })
  }),

  loginWithEmail: asyncHandler(async (req, res) => {
    const { password, email } = req.body

    const alreadyUser = await db.User.findOne({ where: { email }, raw: true })

    if (!alreadyUser)
      return res.json({
        success: false,
        msg: "Email chưa được đăng ký!",
      })
    const isCorrentPassword = bcrypt.compareSync(password, alreadyUser.password)
    if (!isCorrentPassword)
      return res.json({
        success: false,
        msg: "Mật khẩu không chính xác!",
      })

    const token = jwt.sign({ uid: alreadyUser.id }, process.env.JWT_SECRET, { expiresIn: "7d" })
    return res.json({
      success: true,
      accessToken: token,
      msg: !!token ? "Đăng nhập thành công" : "Invalid Credentials.",
    })
  }),

  loginWithGoogle: asyncHandler(async (req, res) => {
    const { fullname, avatar, email, password } = req.body

    const alreadyUser = await db.User.findOne({ where: { email } })

    if (!alreadyUser && !password)
      return res.json({
        success: false,
        msg: "Invalid credentials.",
      })

    const payload = { fullname, avatar, email, emailVerified: true }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      payload.password = hashedPassword
    }

    const response = await db.User.findOrCreate({ where: { email }, defaults: payload })

    const token = jwt.sign({ uid: response[0].id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    return res.json({
      success: !!token,
      accessToken: token,
      msg: !!token ? "Đăng nhập thành công" : "Invalid Credentials.",
    })
  }),
}
