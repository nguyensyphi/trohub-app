const { Sequelize } = require("sequelize")
const env = process.env.NODE_ENV || "development"

const options = {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  logging: false,
  timezone: "+07:00",
  port: Number(process.env.DB_PORT),
}
if (env === "production")
  options.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  }
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, options)

const dbconn = async () => {
  try {
    await sequelize.authenticate()
    console.log(":::DB CONNECTED!")
  } catch (error) {
    console.error(":::Unable to connect to the database:", error)
  }
}

module.exports = dbconn
