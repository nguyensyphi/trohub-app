const router = require("express").Router()
const ctrls = require("../controllers/post.controller")
const { verifyToken, verifyTokenNotRequire, isOwner, isAdmin } = require("../middlewares/verify-token.midd")
const { validateDto } = require("../middlewares/validate-dto.midd")
const joi = require("joi")
const { stringReq, string, numberReq, number, arrayReq, array, date } = require("../utils/joi-schema")

router.post(
  "/new",
  verifyToken,
  isOwner,
  validateDto(
    joi.object({
      title: stringReq,
      description: stringReq,
      address: stringReq,
      province: stringReq,
      district: string,
      ward: string,
      addressBonus: string,
      price: numberReq,
      size: numberReq,
      priority: numberReq,
      bedroom: number,
      bathroom: number,
      postType: stringReq,
      gender: stringReq,
      expiredDate: date,
      media: arrayReq,
      convenient: array,
      orderedDays: numberReq,
      total: numberReq,
    })
  ),
  ctrls.createNewPost
)
router.post(
  "/rating",
  verifyToken,
  validateDto(
    joi.object({
      star: numberReq,
      idPost: numberReq,
    })
  ),
  ctrls.ratingPost
)
router.post(
  "/comment-new",
  verifyToken,
  validateDto(
    joi.object({
      content: stringReq,
      idPost: numberReq,
      idParent: number,
    })
  ),
  ctrls.createNewComment
)
router.get("/user", verifyToken, ctrls.getUserPosts)
// router.get("/comments/:id", ctrls.getCommentByPostId)
router.get("/public", ctrls.getPostPublics)
router.put(
  "/update-status/:id",
  verifyToken,
  isAdmin,
  validateDto(
    joi.object({
      status: stringReq,
      idOrder: numberReq,
    })
  ),
  ctrls.updateStatusPostByAdmin
)
router.put(
  "/update/:id",
  verifyToken,
  isOwner,
  validateDto(
    joi.object({
      title: stringReq,
      description: stringReq,
      address: stringReq,
      province: stringReq,
      district: string,
      ward: string,
      addressBonus: string,
      price: numberReq,
      size: numberReq,
      bedroom: number,
      bathroom: number,
      postType: stringReq,
      gender: stringReq,
      media: arrayReq,
      convenient: array,
      roomStatus: string,
    })
  ),
  ctrls.updatePostByUser
)
router.delete("/remove", verifyToken, isOwner, ctrls.deletePostByUser)
router.delete("/remove-by-admin/:id", verifyToken, isAdmin, ctrls.deletePostByAdmin)
router.get("/one/:id", verifyTokenNotRequire, ctrls.getPostById)
router.get("/admin/posts", verifyToken, isAdmin, ctrls.getAdminPosts)
router.get("/admin/orders", verifyToken, isAdmin, ctrls.getAdminOrders)
module.exports = router
