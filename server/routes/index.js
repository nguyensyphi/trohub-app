const { badRequestException, errHandler } = require("../middlewares/error-handler.midd")
const auth = require("./auth.route")
const user = require("./user.route")
const payment = require("./payment.route")
const post = require("./post.route")
const news = require("./news.route")
const order = require("./order.route")

const initRoutes = (app) => {
  app.use("/api/v1/user", user)
  app.use("/api/v1/auth", auth)
  app.use("/api/v1/order", order)
  app.use("/api/v1/news", news)
  app.use("/api/v1/post", post)
  app.use("/api/v1/payment", payment)

  app.use(badRequestException)
  app.use(errHandler)
}

module.exports = initRoutes
