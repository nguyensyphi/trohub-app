const router = require("express").Router()
const ctrls = require("../controllers/user.controller")
const { verifyToken, isAdmin, verifyTokenNotRequire } = require("../middlewares/verify-token.midd")
const { validateDto } = require("../middlewares/validate-dto.midd")
const joi = require("joi")
const { stringReq, emailReq, numberReq } = require("../utils/joi-schema")

router.get("/me", verifyToken, ctrls.getMe)
router.post(
  "/send-otp",
  verifyToken,
  validateDto(
    joi.object({
      phone: stringReq,
    })
  ),
  ctrls.sendOTP
)
router.post(
  "/deposit",
  verifyToken,
  validateDto(
    joi.object({
      amount: numberReq,
    })
  ),
  ctrls.deposit
)
router.post(
  "/verify-otp",
  verifyToken,
  validateDto(
    joi.object({
      phone: stringReq,
      code: stringReq,
    })
  ),
  ctrls.verifyOTP
)

router.put("/me", verifyToken, ctrls.updateProfile)
router.get("/admin", verifyToken, isAdmin, ctrls.getUserAdmin)
router.get("/wls", verifyToken, ctrls.getWishlist)
router.get("/payment-history", verifyToken, ctrls.getPaymentHistory)
router.get("/expired-history", verifyToken, ctrls.getExpiredHistory)
router.get("/seen-posts", verifyToken, ctrls.getSeenPost)
router.post(
  "/send-mail",
  verifyToken,
  validateDto(
    joi.object({
      email: emailReq,
    })
  ),
  ctrls.sendOtpEmail
)
router.post(
  "/expire-post",
  verifyToken,
  validateDto(
    joi.object({
      total: numberReq,
      days: numberReq,
      idPost: numberReq,
    })
  ),
  ctrls.expirePost
)
router.post(
  "/verify-mail",
  verifyToken,
  validateDto(
    joi.object({
      email: emailReq,
      otp: stringReq,
    })
  ),
  ctrls.verifyEmail
)
router.post(
  "/reset-password-verify",
  validateDto(
    joi.object({
      email: emailReq,
      otp: stringReq,
      password: stringReq,
    })
  ),
  ctrls.resetPasswordVerify
)
router.post(
  "/reset-password-required",
  validateDto(
    joi.object({
      email: emailReq,
    })
  ),
  ctrls.resetPasswordRequired
)
router.put("/views", verifyTokenNotRequire, ctrls.updateViews)
router.put(
  "/wishlist",
  verifyToken,
  validateDto(
    joi.object({
      idPost: numberReq,
    })
  ),
  ctrls.addWishlist
)

router.put(
  "/admin/:id",
  verifyToken,
  isAdmin,
  validateDto(
    joi.object({
      role: stringReq,
    })
  ),
  ctrls.updateUserByAdmin
)

router.delete("/admin", verifyToken, isAdmin, ctrls.deleteUserByAdmin)
router.put("/upgrade-owner", verifyToken, ctrls.updateRoleOwner)

router.get("/dashboard", verifyToken, isAdmin, ctrls.getDashboard)

module.exports = router
