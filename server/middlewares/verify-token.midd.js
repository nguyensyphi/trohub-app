const jsonwebtoken = require("jsonwebtoken")
const db = require("../models")
const verifyToken = async (req, res, next) => {
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization?.split(" ")[1]
    jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).json({
          success: false,
          msg: "Hết phiên, yêu cầu đăng nhập.",
        })
      }
      req.user = decode
      next()
    })
  } else {
    return res.status(401).json({
      success: false,
      msg: "Hết phiên, yêu cầu đăng nhập.",
    })
  }
}

const verifyTokenNotRequire = async (req, res, next) => {
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization?.split(" ")[1]
    jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        next()
      }
      req.user = decode
      next()
    })
  } else {
    next()
  }
}

const isAdmin = async (req, res, next) => {
  const { uid } = req.user
  const user = await db.User.findByPk(uid)
  if (!user || user.role !== "Quản trị viên")
    return res.json({
      success: false,
      msg: "Không có quyền truy cập",
    })
  next()
}

const isOwner = async (req, res, next) => {
  const { uid } = req.user
  const user = await db.User.findByPk(uid)
  if (!user || user.role !== "Chủ trọ")
    return res.json({
      success: false,
      msg: "Không có quyền truy cập",
    })
  next()
}

module.exports = {
  verifyToken,
  isAdmin,
  verifyTokenNotRequire,
  isOwner,
}
