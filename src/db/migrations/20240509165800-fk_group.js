module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addConstraint('groups', {
      type: 'foreign key',
      fields: ['ownerId'],
      name: 'fk_group_user',
      references: {
        table: 'users',
        field: 'id' 
      }
    });
  },
  async down(queryInterface, Sequelize) {
    queryInterface.removeConstraint('groups', 'fk_group_user')
  }
};