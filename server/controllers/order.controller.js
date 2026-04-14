const db = require("../models")
const asyncHandler = require("express-async-handler")
const { Op } = require("sequelize")

module.exports = {
  getOrdersByOwner: asyncHandler(async (req, res) => {
    const { uid } = req.user
    const { limit = 5, sort = "createdAt", order = "DESC", page = 1, title, ...rest } = req.query
    const whereClause = rest
    whereClause.idUser = uid

    const sortBy = [[sort, order.toUpperCase()]]

    const offset = (parseInt(page) - 1) * parseInt(limit)
    const response = await db.Order.findAll({
      where: whereClause,
      include: [
        { model: db.User, as: "rUser", attributes: ["id", "fullname", "avatar"] },
        { model: db.Post, as: "rPost", attributes: ["id", "title", "status"] },
      ],
      limit,
      offset,
      order: sortBy,
    })
    const count = await db.Order.count({ where: whereClause })

    return res.json({
      success: true,
      orders: response,
      pagination: {
        limit,
        page,
        count,
        totalPages: Math.ceil(count / limit),
      },
    })
  }),
  publicPost: asyncHandler(async (req, res) => {
    const { id } = req.params
    const { uid } = req.user
    const { orderedDays, idPost, total } = req.body
    const payload = { status: "Thành công" }
    const expiredDate = Date.now() + orderedDays * 24 * 3600 * 1000

    payload.expiredDate = expiredDate

    // NOTE: Ngày bắt đầu = ngày hết hạn - số ngày đặt

    const [response, response1] = await Promise.all([
      db.Order.update(payload, { where: { id } }),
      db.Post.update({ expiredDate }, { where: { id: idPost } }),
      db.User.decrement({ balance: total }, { where: { id: uid } }),
    ])

    const isSuccess = response[0] > 0 && response1[0] > 0
    return res.json({
      success: isSuccess,
      msg: isSuccess ? "Tin đăng đã được công khai." : "Có lỗi hãy thử lại sau.",
    })
  }),
  removeOrder: asyncHandler(async (req, res) => {
    const { uid } = req.user
    const { id } = req.params

    const response = await db.Order.destroy({ where: { id, idUser: uid } })

    const isSuccess = response > 0
    return res.json({
      success: isSuccess,
      msg: isSuccess ? "Xóa hóa đơn thành công." : "Xóa hóa đơn không thành công.",
    })
  }),
}
