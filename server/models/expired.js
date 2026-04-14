"use strict"
const { Model } = require("sequelize")
const { paymentStatus } = require("../utils/contants")
module.exports = (sequelize, DataTypes) => {
  class Expired extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Expired.belongsTo(models.Post, { foreignKey: "idPost", as: "rPost" })
      Expired.belongsTo(models.User, { foreignKey: "idUser", as: "rUser" })
    }
  }
  Expired.init(
    {
      idPost: DataTypes.INTEGER,
      idInvoice: DataTypes.STRING,
      idUser: DataTypes.INTEGER,
      total: DataTypes.INTEGER,
      days: DataTypes.INTEGER,
      status: {
        type: DataTypes.ENUM,
        values: paymentStatus,
      },
    },
    {
      sequelize,
      modelName: "Expired",
    }
  )
  return Expired
}
