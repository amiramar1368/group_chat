import { DataTypes } from "sequelize";

import sequelize from "./index.js";
import { User } from "./user.js";

export const Group = sequelize.define("group", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(25),
    allowNull: false,
    unique: {
      msg: "name of group must be unique",
    },
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
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
});

Group.belongsTo(User, { foreignKey: { name: "ownerId", onUpdate: "CASCADE", onDelete: "NO ACTION" } });
