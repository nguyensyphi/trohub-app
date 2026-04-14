"use strict"
/** @type {import('sequelize-cli').Migration} */
const { postTypes, genders, statuses, convenients, roomStatuses } = require("../utils/contants")
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Posts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ward: {
        type: Sequelize.STRING,
      },
      addressBonus: {
        type: Sequelize.STRING,
      },
      district: {
        type: Sequelize.STRING,
      },
      province: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.BIGINT, // 9x10^18
        allowNull: false,
        defaultValue: 0,
      },
      averageStar: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      size: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      priority: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      bathroom: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      bedroom: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM,
        values: statuses,
        defaultValue: "Đang chờ duyệt",
      },
      roomStatus: {
        type: Sequelize.ENUM,
        values: roomStatuses,
        defaultValue: "Còn trống",
      },
      postType: {
        type: Sequelize.ENUM,
        values: postTypes,
        allowNull: false,
      },
      gender: {
        type: Sequelize.ENUM,
        values: genders,
        defaultValue: "Tất cả",
      },
      verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      expiredDate: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      media: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      convenient: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      idUser: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      views: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Posts")
  },
}
