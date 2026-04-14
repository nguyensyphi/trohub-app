"use strict"

const { posts } = require("../utils/faker-data")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Posts", posts, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Posts", null, {})
  },
}
