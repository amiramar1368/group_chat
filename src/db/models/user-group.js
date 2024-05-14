import { DataTypes } from "sequelize";

import sequelize from './index.js';
import { User } from "./user.js";
import { Group } from "./group.js";

export const UserGroup = sequelize.define(
  "user_group",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["userId", "groupId"],
      },
    ],
  }
);

UserGroup.belongsTo(User, { foreignKey: { name: "userId", onUpdate: "CASCADE", onDelete: "NO ACTION" } });
User.hasMany(UserGroup, { foreignKey: { name: "userId"} })

UserGroup.belongsTo(Group, { foreignKey: { name: "groupId", onUpdate: "CASCADE", onDelete: "NO ACTION" }});
Group.hasMany(UserGroup,{ foreignKey: { name: "groupId"}})