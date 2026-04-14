require("dotenv").config()
const express = require("express")
const cors = require("cors")
const dbconn = require("./configs/dbconn")
const initRoutes = require("./routes")
const db = require("./models")
const cron = require("node-cron")
const { readHtmlTemplateExpired, sendMail } = require("./utils/helpers")
const { Op } = require("sequelize")
const moment = require("moment")

const app = express()
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["POST", "GET", "PATCH", "DELETE", "PUT"],
  })
)
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

initRoutes(app)
dbconn()

cron.schedule("16 20 * * *", async () => {
  console.log("Kiểm tra các tin đăng hết hạn...")

  try {
    const expiredPosts = await db.Post.findAll({
      where: { expiredDate: { [Op.lt]: Date.now() } },
      include: [{ model: db.User, as: "postedBy", attributes: ["fullname", "email"] }],
    })

    if (expiredPosts && expiredPosts.length > 0) {
      for (let i = 0; i < expiredPosts.length; i++) {
        if (expiredPosts[i].postedBy?.email) {
          const emailContent = readHtmlTemplateExpired({
            expiredDate: moment(expiredPosts[i].expiredDate).format("DD/MM/YYYY"),
            title: expiredPosts[i].title,
            fullname: expiredPosts[i].postedBy?.fullname,
          })
          const mailOptions = {
            from: `"Trohub" <${process.env.SMTP_USER}>`,
            to: expiredPosts[i].postedBy?.email,
            subject: "Thông báo",
            html: emailContent,
          }

          await sendMail(mailOptions)
        }
      }
    }
  } catch (error) {
    console.log(error)
  }

  console.log("Đã quét xong")
})

const port = process.env.PORT || 8888
const listener = app.listen(port, () => {
  console.log(`Server is running on the port ${listener.address().port}`)
})
