'use strict';
const bcrypt = require('bcryptjs');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      const password = await bcrypt.hash("123",10);
      await queryInterface.bulkInsert('users', [{
        fullname: 'admin',
        username: 'admin',
        imageName: 'admin',
        password,
        createdAt:new Date(),
        updatedAt:new Date(),
      }], {});
  
  },

  async down (queryInterface, Sequelize) {

      await queryInterface.bulkDelete('users', null, {});
     
  }
};
