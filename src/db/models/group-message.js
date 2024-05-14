import {DataTypes} from 'sequelize';

import sequelize from './index.js';
import {User} from './user.js';
import {Group} from './group.js';

export const GroupMessage = sequelize.define("group_message",{
    id:{
        type:DataTypes.BIGINT,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    text:{
        type:DataTypes.STRING(2000),
        allowNull:false
    },
    senderId:{
        type:DataTypes.INTEGER.UNSIGNED,
        allowNull:false
    },
    groupId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },

});

GroupMessage.belongsTo(User,{foreignKey:{name:"senderId",onUpdate:"CASCADE",onDelete:"NO ACTION"}});
GroupMessage.belongsTo(Group,{foreignKey:{name:"groupId",onUpdate:"CASCADE",onDelete:"NO ACTION"}});
