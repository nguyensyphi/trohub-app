"use strict"
const { Model } = require("sequelize")
const { genders, statuses, postTypes, roomStatuses } = require("../utils/contants")
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      // define association here
      Post.belongsTo(models.User, { foreignKey: "idUser", as: "postedBy" })
      Post.hasOne(models.Order, { foreignKey: "idPost", as: "rOrder" })
    }
  }
  Post.init(
    {
      title: DataTypes.STRING,
      address: DataTypes.STRING,
      ward: DataTypes.STRING,
      addressBonus: DataTypes.STRING,
      averageStar: DataTypes.FLOAT,
      district: DataTypes.STRING,
      province: DataTypes.STRING,
      price: DataTypes.BIGINT,
      size: DataTypes.INTEGER,
      priority: DataTypes.INTEGER,
      bedroom: DataTypes.INTEGER,
      bathroom: DataTypes.INTEGER,
      views: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      gender: {
        type: DataTypes.ENUM,
        values: genders,
      },
      postType: {
        type: DataTypes.ENUM,
        values: postTypes,
      },
      idUser: DataTypes.INTEGER,
      expiredDate: DataTypes.DATE,
      verified: DataTypes.BOOLEAN,
      status: {
        type: DataTypes.ENUM,
        values: statuses,
      },
      roomStatus: {
        type: DataTypes.ENUM,
        values: roomStatuses,
      },
      media: {
        type: DataTypes.TEXT,
        get() {
          const raw = this.getDataValue("media")
          return raw ? JSON.parse(raw) : []
        },
        set(value) {
          this.setDataValue("media", JSON.stringify(value))
        },
      },
      convenient: {
        type: DataTypes.TEXT,
        get() {
          const raw = this.getDataValue("convenient")
          return raw ? JSON.parse(raw) : []
        },
        set(value) {
          this.setDataValue("convenient", JSON.stringify(value))
        },
      },
    },
    {
      sequelize,
      modelName: "Post",
    }
  )
  return Post
}
