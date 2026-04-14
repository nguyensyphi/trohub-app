const router = require("express").Router()
const ctrls = require("../controllers/new.controller")
const { validateDto } = require("../middlewares/validate-dto.midd")
const joi = require("joi")
const { verifyToken, isAdmin } = require("../middlewares/verify-token.midd")
const { stringReq } = require("../utils/joi-schema")

router.post(
  "/new",
  verifyToken,
  isAdmin,
  validateDto(
    joi.object({
      title: stringReq,
      content: stringReq,
      avatar: stringReq,
    })
  ),
  ctrls.createNews
)
router.put(
  "/update/:id",
  verifyToken,
  isAdmin,
  validateDto(
    joi.object({
      title: stringReq,
      content: stringReq,
      avatar: stringReq,
    })
  ),
  ctrls.updateNewsByAdmin
)
router.get("/admin", verifyToken, isAdmin, ctrls.getNewsAdmin)
router.get("/public", ctrls.getNewsPublic)
router.get("/one/:id", ctrls.getNewsById)
router.delete("/delete", verifyToken, isAdmin, ctrls.deleteNewsByAdmin)
module.exports = router
