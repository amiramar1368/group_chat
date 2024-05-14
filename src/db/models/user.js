import { DataTypes } from "sequelize";

import sequelize from "./index.js";

export const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  fullname: {
    type: DataTypes.STRING(100),
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
    type: DataTypes.STRING(25),
    allowNull: false,
    unique: true,
    set(value) {
      this.setDataValue("username", value.trim());
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
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
