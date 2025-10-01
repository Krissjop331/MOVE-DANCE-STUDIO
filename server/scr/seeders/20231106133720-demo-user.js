'use strict';

const bcrypt = require('bcryptjs');

const adminHashPassword = bcrypt.hash("admin", 10);
const userHashPassword = bcrypt.hash("user1234", 10);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      {
        first_name: 'admin',
        last_name: 'admin',
        email: 'admin@mail.ru',
        password: (await adminHashPassword).toString(),
        admin: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name: 'user',
        last_name: 'user',
        email: 'user@mail.ru',
        password: (await userHashPassword).toString(),
        admin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
