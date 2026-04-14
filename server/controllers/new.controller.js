const db = require("../models")
const asyncHandler = require("express-async-handler")
const { Op } = require("sequelize")

module.exports = {
  createNews: asyncHandler(async (req, res) => {
    const { uid } = req.user
    const payload = req.body
    payload.idUser = uid

    const response = await db.New.create(payload)

    const isSuccess = !!response
    return res.json({
      success: isSuccess,
      msg: isSuccess ? "Tạo tin thành công." : "Tạo tin không thành công.",
    })
  }),
  getNewsAdmin: asyncHandler(async (req, res) => {
    const { uid } = req.user
    const { limit = 5, sort = "createdAt", order = "DESC", page = 1, title, ...rest } = req.query
    const whereClause = rest
    whereClause.idUser = uid

    const sortBy = [[sort, order.toUpperCase()]]
    if (title) {
      whereClause.title = { [Op.iLike]: `%${title}%` }
    }

    const offset = (parseInt(page) - 1) * parseInt(limit)
    const response = await db.New.findAll({
      where: whereClause,
      include: [{ model: db.User, as: "postedBy", attributes: ["id", "fullname", "avatar"] }],
      limit,
      offset,
      order: sortBy,
    })
    const count = await db.New.count({ where: whereClause })

    return res.json({
      success: true,
      news: response,
      pagination: {
        limit,
        page,
        count,
        totalPages: Math.ceil(count / limit),
      },
    })
  }),
  getNewsPublic: asyncHandler(async (req, res) => {
    const { limit = 5, sort = "createdAt", order = "DESC", page = 1, title, ...rest } = req.query
    const whereClause = rest
    if (title) {
      whereClause.title = { [Op.iLike]: `%${title}%` }
    }

    const sortBy = [[sort, order.toUpperCase()]]

    const offset = (parseInt(page) - 1) * parseInt(limit)
    const response = await db.New.findAll({
      where: whereClause,
      include: [{ model: db.User, as: "postedBy", attributes: ["id", "fullname", "avatar"] }],
      limit,
      offset,
      order: sortBy,
    })
    const count = await db.New.count({ where: whereClause })

    return res.json({
      success: true,
      news: response,
      pagination: {
        limit,
        page,
        count,
        totalPages: Math.ceil(count / limit),
      },
    })
  }),
  updateNewsByAdmin: asyncHandler(async (req, res) => {
    const { uid } = req.user
    const payload = req.body
    const { id } = req.params

    const response = await db.New.update(payload, { where: { idUser: uid, id } })

    const isSuccess = response[0] > 0
    return res.json({
      success: isSuccess,
      msg: isSuccess ? "Cập nhật tin tức thành công." : "Cập nhật tin tức không thành công.",
    })
  }),

  deleteNewsByAdmin: asyncHandler(async (req, res) => {
    const { uid } = req.user
    const { idNews } = req.query

    const response = await db.New.destroy({ where: { id: idNews, idUser: uid } })

    const isSuccess = response > 0
    return res.json({
      success: isSuccess,
      msg: isSuccess ? "Xóa tin tức thành công." : "Xóa tin tức không thành công.",
    })
  }),
  getNewsById: asyncHandler(async (req, res) => {
    const { id } = req.params
    const response = await db.New.findByPk(id, {
      include: [{ model: db.User, as: "postedBy", attributes: ["id", "avatar", "fullname"] }],
    })

    return res.json({
      success: !!response,
      news: response,
    })
  }),
}
