module.exports = {
  async up(queryInterface, Sequelize) {
   await queryInterface.addConstraint('user_groups', {
      type: 'foreign key',
      fields: ['userId'],
      name: 'fk_user_id_user_groups',
      references: {
        table: 'users',
        field: 'id' 
      }
    });
   await queryInterface.addConstraint('user_groups', {
      type: 'foreign key',
      fields: ['groupId'],
      name: 'fk_group_id_user_groups',
      references: {
        table: 'groups',
        field: 'id' 
      }
    });
   await queryInterface.addConstraint('user_groups', {
    type: 'unique',
    fields: ['userId', 'groupId'],
    name: 'unique_user_group_combination'
    });
  },
  async down(queryInterface, Sequelize) {
   await queryInterface.removeConstraint('user_groups', 'fk_user_id_user_groups');
   await queryInterface.removeConstraint('user_groups', 'fk_group_id_user_groups');
   await queryInterface.removeConstraint('user_groups', 'unique_user_group_combination');
  }
};