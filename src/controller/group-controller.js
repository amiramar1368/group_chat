import jwt from "jsonwebtoken";

const { ACCESS_TOKEN_KEY } = process.env;
import { Group } from "../db/models/group.js";
import { UserGroup } from "../db/models/user-group.js";
import { getUserByToken } from "../utils/get-user-by-token.js";
import sequelize from "../db/models/index.js";
export class GroupController {
  static async addGroup(req, res) {
    try {
      const user = req.user;
      const { name } = req.body;
      let newgroup;
      await sequelize.transaction(async () => {
        newgroup = await Group.create({ name, ownerId: user.id });
        await UserGroup.bulkCreate([
          { groupId: newgroup.id, userId: user.id },
          { groupId: newgroup.id, userId: 1 },
        ]);
      });
      const prevToken = req.cookies.token;
      const userInfo = getUserByToken(prevToken);
      userInfo.groups.push({ id: newgroup.id, name });
      const newToken = jwt.sign(userInfo, ACCESS_TOKEN_KEY);
      res.cookie("token", newToken, { httpOnly: true });
      return res.sendSuccess(201,"New Group Add Succesfully",{ groupId: newgroup.id })
    } catch (err) {
      if (err.errors) {
        return res.sendError(409, err.errors[0].message);
      }
      res.sendError();
    }
  }
}
