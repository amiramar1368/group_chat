module.exports = {
  async up(queryInterface, Sequelize) {
   await queryInterface.addConstraint('group_messages', {
      type: 'foreign key',
      fields: ['senderId'],
      name: 'fk_sender_id_group_messages',
      references: {
        table: 'users',
        field: 'id' 
      }
    });
   await queryInterface.addConstraint('group_messages', {
      type: 'foreign key',
      fields: ['groupId'],
      name: 'fk_group_id_group_messages',
      references: {
        table: 'groups',
        field: 'id' 
      }
    });
  },
  async down(queryInterface, Sequelize) {
   await queryInterface.removeConstraint('group_messages', 'fk_sender_id_group_messages');
   await queryInterface.removeConstraint('group_messages', 'fk_group_id_group_messages');
  }
};