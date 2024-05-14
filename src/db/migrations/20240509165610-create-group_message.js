module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('group_messages', {
      id:{
        type:Sequelize.BIGINT,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    text:{
        type:Sequelize.STRING(2000),
        allowNull:false
    },
    senderId:{
        type:Sequelize.INTEGER.UNSIGNED,
        allowNull:false
    },
    groupId:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('group_messages');
  }
};