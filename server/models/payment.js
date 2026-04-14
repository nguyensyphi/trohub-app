"use strict"
const { Model } = require("sequelize")
const { paymentStatus, paymentMethod } = require("../utils/contants")
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Payment.init(
    {
      idUser: DataTypes.INTEGER,
      idInvoice: DataTypes.STRING,
      method: {
        type: DataTypes.ENUM,
        values: paymentMethod,
      },
      idUser: DataTypes.INTEGER,
      amount: DataTypes.BIGINT,
      status: {
        type: DataTypes.ENUM,
        values: paymentStatus,
      },
    },
    {
      sequelize,
      modelName: "Payment",
    }
  )
  return Payment
}
