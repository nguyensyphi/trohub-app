"use strict"
const { Model } = require("sequelize")
const { paymentStatus } = require("../utils/contants")
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.Post, { foreignKey: "idPost", as: "rPost" })
      Order.belongsTo(models.User, { foreignKey: "idUser", as: "rUser" })
    }
  }
  Order.init(
    {
      idPost: DataTypes.INTEGER,
      idUser: DataTypes.INTEGER,
      orderedDays: DataTypes.INTEGER,
      total: DataTypes.INTEGER,
      idInvoice: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM,
        values: paymentStatus,
      },
      confirmedDate: DataTypes.DATE,
      expiredDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Order",
    }
  )
  return Order
}
