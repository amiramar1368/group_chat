module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      fullname: {
        type: Sequelize.STRING(100),
        allowNull: false,
        set(value) {
          this.setDataValue("fullname", value.trim());
        },
        validate: {
          isShort(value) {
            if (value.length < 3) {
              throw new Error("fullname must be at least 3 characters");
            }
          },
        },
      },
      username: {
        type: Sequelize.STRING(25),
        allowNull: false,
        unique: true,
        set(value){
          this.setDataValue("username",value.trim())
      },
        validate: {
          isShort(value) {
            if (value.length < 3) {
              throw new Error("username must be at least 3 characters");
            }
          },
          isLong(value) {
            if (value.length > 20) {
              throw new Error("username cann't be more than 20 characters");
            }
          },
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      imageName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
