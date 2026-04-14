"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_Payments_method" ADD VALUE IF NOT EXISTS 'MoMo';`
    )
  },

  async down(queryInterface, Sequelize) {
    // PostgreSQL không hỗ trợ DROP VALUE trực tiếp cho ENUM.
    // Giữ no-op để rollback migration không làm hỏng dữ liệu đang có.
    return Promise.resolve()
  },
}

