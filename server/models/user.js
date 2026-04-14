"use strict"
const { Model } = require("sequelize")
const { roles } = require("../utils/contants")
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Wishlist, { foreignKey: "idUser", as: "rWishlist" })
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      emailVerified: DataTypes.BOOLEAN,
      phone: DataTypes.STRING,
      role: {
        type: DataTypes.ENUM,
        values: roles,
      },
      fullname: DataTypes.STRING,
      phoneVerified: DataTypes.BOOLEAN,
      password: DataTypes.STRING,
      avatar: DataTypes.STRING,
      balance: DataTypes.INTEGER,
      resetPwdToken: DataTypes.STRING,
      resetPwdExpiry: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "User",
    }
  )
  return User
}
