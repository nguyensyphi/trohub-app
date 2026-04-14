const ctrls = require("../controllers/auth.controller")
const { validateDto } = require("../middlewares/validate-dto.midd")
const joi = require("joi")
const { stringReq, emailReq, string } = require("../utils/joi-schema")
const router = require("express").Router()

router.post(
  "/login-email",
  validateDto(
    joi.object({
      email: emailReq,
      password: stringReq,
    })
  ),
  ctrls.loginWithEmail
)

router.post(
  "/register-email",
  validateDto(
    joi.object({
      email: emailReq,
      password: stringReq,
      fullname: stringReq,
    })
  ),
  ctrls.registerWithEmail
)

router.post(
  "/register-phone",
  validateDto(
    joi.object({
      phone: stringReq,
      password: stringReq,
      fullname: stringReq,
    })
  ),
  ctrls.registerWithPhone
)

router.post(
  "/login-phone",
  validateDto(
    joi.object({
      phone: stringReq,
      password: string,
    })
  ),
  ctrls.loginWithPhone
)

router.post(
  "/google",
  validateDto(
    joi.object({
      fullname: stringReq,
      avatar: stringReq,
      email: emailReq,
      password: string,
    })
  ),
  ctrls.loginWithGoogle
)

module.exports = router
