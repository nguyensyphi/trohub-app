"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class SeenPost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SeenPost.belongsTo(models.Post, { foreignKey: "idPost", as: "rPost" })
    }
  }
  SeenPost.init(
    {
      idUser: DataTypes.INTEGER,
      idPost: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "SeenPost",
    }
  )
  return SeenPost
}
