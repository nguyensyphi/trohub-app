const db = require("../models")
const asyncHandler = require("express-async-handler")
const { Op, Sequelize } = require("sequelize")
const randomstring = require("randomstring")
const { sendMail } = require("../utils/helpers")

module.exports = {
  createNewPost: asyncHandler(async (req, res) => {
    const { uid } = req.user
    const { orderedDays = 3, total, ...payload } = req.body
    payload.idUser = uid

    const response = await db.Post.create(payload)

    const isSuccess = !!response

    // Thêm order khi tạo tin đăng (trạng thái "Đang chờ duyệt")
    if (isSuccess) {
      const orderData = {
        idPost: response.id,
        idUser: uid,
        total,
        orderedDays,
        idInvoice: randomstring.generate(8).toUpperCase(),
        status: "Đang chờ",
      }

      await db.Order.create(orderData)
    }
    return res.json({
      success: isSuccess,
      msg: isSuccess ? "Tạo tin đăng thành công." : "Tạo tin đăng không thành công.",
    })
  }),

  getUserPosts: asyncHandler(async (req, res) => {
    const { uid } = req.user
    const { limit = 5, sort = "createdAt", order = "DESC", page = 1, title, ...rest } = req.query

    const whereClause = rest
    whereClause.idUser = uid

    const sortBy = [[sort, order.toUpperCase()]]

    const offset = (parseInt(page) - 1) * parseInt(limit)

    if (title) whereClause.title = { [Op.iLike]: `%${title}%` }

    const posts = await db.Post.findAll({ where: whereClause, limit, offset, order: sortBy })
    const count = await db.Post.count({ where: whereClause })

    return res.json({
      success: true,
      posts,
      pagination: {
        limit,
        page,
        count,
        totalPages: Math.ceil(count / limit),
      },
    })
  }),

  getPostPublics: asyncHandler(async (req, res) => {
    const {
      limit = 5,
      page = 1,
      title,
      address,
      province,
      district,
      ward,
      addressBonus,
      price,
      size,
      provinceId,
      districtId,
      wardId,
      convenient,
      status,
      ...rest
    } = req.query

    const whereClause = rest
    whereClause.expiredDate = { [Op.gte]: Date.now() }

    if (status) whereClause.status = status
    else whereClause.status = ["Đã duyệt"]

    const sortBy = [["priority", "DESC"]]

    const offset = (parseInt(page) - 1) * parseInt(limit)
    if (convenient && typeof convenient === "object") {
      whereClause.convenient = {
        [Op.or]: convenient.map((el) => ({ [Op.iLike]: `%${el}%` })),
      }
    }
    if (convenient && typeof convenient === "string") {
      whereClause.convenient = {
        [Op.iLike]: `%${convenient}%`,
      }
    }

    if (price && price !== "ALL") {
      const priceArray = JSON.parse(price)
      if (typeof priceArray[0] === "string") {
        whereClause.price = { [Op[priceArray[0]]]: priceArray[1] }
      } else whereClause.price = { [Op.between]: priceArray }
    }

    if (size) {
      const sizeArray = JSON.parse(size)
      if (typeof sizeArray[0] === "string") {
        whereClause.size = { [Op[sizeArray[0]]]: sizeArray[1] }
      } else whereClause.size = { [Op.between]: sizeArray }
    }

    if (title) whereClause.title = { [Op.iLike]: `%${title}%` }
    if (address) whereClause.address = { [Op.iLike]: `%${address}%` }
    if (province) whereClause.province = { [Op.iLike]: `%${province}%` }
    if (district) whereClause.district = { [Op.iLike]: `%${district}%` }
    if (ward) whereClause.ward = { [Op.iLike]: `%${ward}%` }

    const posts = await db.Post.findAll({ where: whereClause, limit, offset, order: sortBy })
    const count = await db.Post.count({ where: whereClause })

    return res.json({
      success: true,
      posts,
      pagination: {
        limit,
        page,
        count,
        totalPages: Math.ceil(count / limit),
      },
    })
  }),

  updatePostByUser: asyncHandler(async (req, res) => {
    const { uid } = req.user
    const payload = req.body
    const { id } = req.params

    const response = await db.Post.update(payload, { where: { idUser: uid, id } })

    const isSuccess = response[0] > 0
    return res.json({
      success: isSuccess,
      msg: isSuccess ? "Cập nhật tin đăng thành công." : "Cập nhật tin đăng không thành công.",
    })
  }),

  deletePostByUser: asyncHandler(async (req, res) => {
    const { uid } = req.user
    const { postIds } = req.query

    const response = await db.Post.destroy({ where: { id: postIds, idUser: uid } })

    const isSuccess = response > 0
    return res.json({
      success: isSuccess,
      msg: isSuccess ? "Xóa tin đăng thành công." : "Xóa tin đăng không thành công.",
    })
  }),
  getPostById: asyncHandler(async (req, res) => {
    const { id } = req.params
    const user = req.user

    // Lưu tin đăng đã xem
    if (user) {
      await db.SeenPost.findOrCreate({
        where: { idPost: id, idUser: user.uid },
        defaults: { idPost: id, idUser: user.uid },
      })
    }

    const response = await db.Post.findByPk(id, {
      include: [
        { model: db.User, attributes: ["id", "fullname", "email", "phone", "avatar"], as: "postedBy" },
      ],
    })
    const [voters, comments] = await Promise.all([
      db.Rating.findAll({
        where: { idPost: id },
        include: [{ model: db.User, attributes: ["id", "fullname", "avatar"], as: "rUser" }],
      }),
      db.Comment.findAll({
        where: { idPost: id },
        order: [["createdAt", "DESC"]],
        include: [{ model: db.User, attributes: ["fullname", "avatar"], as: "commentator" }],
      }),
      db.Post.increment({ views: 1 }, { where: { id } }),
    ])
    return res.json({
      success: !!response,
      postData: response,
      voters,
      comments,
    })
  }),
  ratingPost: asyncHandler(async (req, res) => {
    const { star, idPost } = req.body
    const { uid } = req.user
    const alreadyRating = await db.Rating.findOne({ where: { idUser: uid, idPost } })

    if (alreadyRating) {
      await db.Rating.update({ star }, { where: { id: alreadyRating.id } })
    } else {
      await db.Rating.create({ idUser: uid, idPost, star })
    }
    const response = await db.Rating.findOne({
      where: { idPost },
      attributes: [[Sequelize.fn("avg", Sequelize.col("star")), "averageStar"]],
      raw: true,
    })

    const averageStar = Math.round(response.averageStar * 10) / 10

    console.log({ averageStar, idPost })

    const updatePost = await db.Post.update({ averageStar }, { where: { id: idPost } })

    console.log(updatePost)
    const isSuccess = updatePost[0] > 0

    return res.json({
      success: isSuccess,
      msg: isSuccess
        ? "Đánh giá tin đăng thành công, Cảm ơn bạn đã đánh giá tin đăng này!"
        : "Có lỗi, hãy thử đánh gia lại sau.",
    })
  }),
  createNewComment: asyncHandler(async (req, res) => {
    const { uid } = req.user
    const response = await db.Comment.create({ ...req.body, idUser: uid })
    return res.json({
      success: !!response,
      msg: !!response ? "Comment thành công." : "Có lỗi hãy thử comment lại.",
    })
  }),
  getCommentByPostId: asyncHandler(async (req, res) => {
    const { id } = req.params
    const response = await db.Comment.findAll({ where: { idPost: id }, order: [["createdAt", "DESC"]] })
    return res.json({
      success: !!response || response.length > 0,
      comments: response,
    })
  }),

  updateStatusPostByAdmin: asyncHandler(async (req, res) => {
    const { id } = req.params
    const { status, idOrder } = req.body

    const [response, post] = await Promise.all([
      db.Post.update({ status }, { where: { id } }),
      db.Post.findOne({
        where: { id },
        include: [{ model: db.User, as: "postedBy", attributes: ["email"] }],
      }),
    ])

    if (status === "Đã duyệt") {
      await db.Order.update({ confirmedDate: Date.now() }, { where: { id: idOrder } })
    }

    if (post && post.postedBy && post.postedBy.email) {
      const html =
        status === "Đã duyệt"
          ? `Chúc mừng bạn! <br /> Tin đăng <b>${post.title}</b> của bạn đã được duyệt, hãy <a href="http://localhost:5173/chu-tro/quan-ly-hoa-don?limit=6&page=1&sort=updatedAt&order=desc" target="_blank">kiểm tra</a> ngay nào!`
          : status === "Từ chối"
          ? `Chúng tôi xin thông báo rằng tin đăng <b>${post.title}</b> của bạn đã bị tự chối, hãy <a href="http://localhost:5173/chu-tro/quan-ly-hoa-don?limit=6&page=1&sort=updatedAt&order=desc" target="_blank">kiểm tra</a> lại nhé!`
          : null

      const mailOptions = {
        from: `"Trohub" <${process.env.SMTP_USER}>`,
        to: post.postedBy.email,
        subject: "Thông báo trạng thái tin đăng",
        html,
      }
      await sendMail(mailOptions)
    }

    const isSuccess = response[0] > 0
    return res.json({
      success: isSuccess,
      msg: isSuccess ? "Cập nhật trạng thái tin đăng thành công" : "Có lỗi hãy thử lại sau.",
    })
  }),

  // Get Post Admin
  getAdminPosts: asyncHandler(async (req, res) => {
    const { limit = 7, sort = "updatedAt", order = "DESC", page = 1, title, status, ...rest } = req.query

    const whereClause = rest
    if (status) whereClause.status = status

    const sortBy = [[sort, order.toUpperCase()]]

    const offset = (parseInt(page) - 1) * parseInt(limit)

    if (title) whereClause.title = { [Op.iLike]: `%${title}%` }

    const posts = await db.Post.findAll({
      where: whereClause,
      limit,
      offset,
      order: sortBy,
      attributes: ["id", "title", "expiredDate", "status", "views", "createdAt"],
      include: [
        { model: db.User, attributes: ["id", "fullname"], as: "postedBy" },
        {
          model: db.Order,
          as: "rOrder",
          attributes: ["id"],
          // required: false,
          // where: {
          //   idUser: {
          //     [Op.eq]: Sequelize.col("Post.idUser"),
          //   },
          // },
        },
      ],
    })
    const count = await db.Post.count({
      where: whereClause,
    })

    return res.json({
      success: true,
      posts,
      pagination: {
        limit,
        page,
        count,
        totalPages: Math.ceil(count / limit),
      },
    })
  }),

  // Get Hóa đơn mua tin đăng Admin
  getAdminOrders: asyncHandler(async (req, res) => {
    const { limit = 5, sort = "createdAt", order = "DESC", page = 1, ...rest } = req.query

    const whereClause = rest

    const sortBy = [[sort, order.toUpperCase()]]

    const offset = (parseInt(page) - 1) * parseInt(limit)

    // if (title) whereClause.title = { [Op.iLike]: `%${title}%` }

    const orders = await db.Order.findAll({
      where: whereClause,
      limit,
      offset,
      order: sortBy,
      include: [
        { model: db.Post, attributes: ["id", "title"], as: "rPost" },
        { model: db.User, attributes: ["id", "fullname"], as: "rUser" },
      ],
    })
    const count = await db.Order.count({ where: whereClause })

    return res.json({
      success: true,
      orders,
      pagination: {
        limit,
        page,
        count,
        totalPages: Math.ceil(count / limit),
      },
    })
  }),

  deletePostByAdmin: asyncHandler(async (req, res) => {
    const { id } = req.params

    const response = await db.Post.destroy({ where: { id } })

    const isSuccess = response > 0
    return res.json({
      success: isSuccess,
      msg: isSuccess ? "Xóa tin đăng thành công." : "Xóa tin đăng không thành công.",
    })
  }),
}
