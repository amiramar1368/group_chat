// import {userValidator,groupValidator} from '../utils/validator.js';
import { getUserByToken } from "../utils/get-user-by-token.js";

import { GroupMessage } from "../db/models/group-message.js";
import { User } from "../db/models/user.js";
import { Group } from "../db/models/group.js";

export class ChatController {
  
  static async homePage(req, res) {
    const userId = req.user.id
    const groups = await Group.findAll({ where: { ownerId:userId  } });
    const users = await User.findAll();
    res.render("chat", { groups, users,userId });
  }

  static async fetchGroupMessage(req, res) {
    try {
      let { limit, page } = req.query;
      limit = Number(limit);
      page = Number(page);
      const { groupId } = req.params;
      const totalCount = await GroupMessage.count({ where: { groupId } });
      let offset = totalCount-(limit*page);
      if(offset<0){
        offset =  0;
        limit = limit-((limit*page)-totalCount)
      };
      const messages = await GroupMessage.findAll({
        where: { groupId },
        offset,
        limit,
        include: { model: User, attributes: ["id", "fullname","imageName"] },
      });
      res.sendSuccess(200,"All Groups message fetch successfully",messages)
    } catch (err) {
      console.log(err);
      res.sendError()
    }
  }

  static async addNewGroupChat(token, data) {
    try {
      const text = data.newMessage.trim();
      const groupId = data.groupId;
      const user = getUserByToken(token);
      await GroupMessage.create({
        text,
        senderId: user.id,
        groupId,
      });
      return {success:true, text, senderId: user.id , image:user.image};
    } catch (err) {
      console.log(err);
      return {success:false};
    }
  }
}
