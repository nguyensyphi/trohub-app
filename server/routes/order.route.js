const router = require("express").Router()
const ctrls = require("../controllers/order.controller")
const { validateDto } = require("../middlewares/validate-dto.midd")
const joi = require("joi")
const { verifyToken, isAdmin, isOwner } = require("../middlewares/verify-token.midd")
const { numberReq } = require("../utils/joi-schema")

router.get("/all", verifyToken, isOwner, ctrls.getOrdersByOwner)
router.delete("/one/:id", verifyToken, isOwner, ctrls.removeOrder)
router.put(
  "/public-post/:id",
  verifyToken,
  isOwner,
  validateDto(
    joi.object({
      orderedDays: numberReq,
      idPost: numberReq,
      total: numberReq,
    })
  ),
  ctrls.publicPost
)

module.exports = router
