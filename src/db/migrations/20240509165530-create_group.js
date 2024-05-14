module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('groups', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(25),
        allowNull: false,
        unique: true,
        set(value) {
          this.setDataValue("name", value.trim());
        },
        validate: {
          isShort(value) {
            if (value.length < 3) {
              throw new Error("name of group must be at least 3 characters");
            }
          },
          isLong(value) {
            if (value.length > 20) {
              throw new Error("name of group cann't be more than 20 characters");
            }
          },
        },
      },
      ownerId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type:Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('groups');
  }
};