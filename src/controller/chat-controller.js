import schedule, { Job } from "node-schedule";
import { getUserByToken } from "../utils/get-user-by-token.js";
import { GroupMessage } from "../db/models/group-message.js";
import { User } from "../db/models/user.js";
import { Group } from "../db/models/group.js";
import { saveMassageTemproryInRedis, redis } from "../db/redis/redis.js";

const { MAX_TEMPORARY_MESSAGE } = process.env;
export class ChatController {
  static async homePage(req, res) {
    const userId = req.user.id;
    const groups = await Group.findAll({ where: { ownerId: userId } });
    const users = await User.findAll();
    res.render("chat", { groups, users, userId });
  }

  static async fetchGroupMessage(req, res) {
    try {
      let { limit, page } = req.query;
      limit = Number(limit);
      page = Number(page);
      const { groupId } = req.params;
      const totalCount = await GroupMessage.count({ where: { groupId } });
      let offset = totalCount - limit * page;
      if (offset < 0) {
        offset = 0;
        limit = limit - (limit * page - totalCount);
      }
      const messages = await GroupMessage.findAll({
        where: { groupId },
        offset,
        limit,
        include: { model: User, attributes: ["id", "fullname", "imageName"] },
      });
      res.sendSuccess(200, "All Groups message fetch successfully", messages);
    } catch (err) {
      res.sendError();
    }
  }

  static async addNewGroupMessage(token, data) {
    try {
      const text = data.newMessage.trim();
      const groupId = data.groupId;
      const user = getUserByToken(token);

      await saveMassageTemproryInRedis("group_Messages", {
        text,
        senderId: user.id,
        groupId,
      });
      if (await saveRedisMessageInMainDB("group_Messages", GroupMessage)) {
        return { success: true, text, senderId: user.id, image: user.image };
      } else {
        return { success: false };
      }
    } catch (err) {
      return { success: false };
    }
  }
}

const job = schedule.scheduleJob("10 * * * * *", () => saveRedisMessageInMainDB("group_Messages", GroupMessage));

async function saveRedisMessageInMainDB(key, tableName) {
  try {
    if (!(await redis.exists(key))) {
      redis.set(key, "[]");
    }
    const time = new Date();
    const second = time.getSeconds() + time.getMilliseconds() / 1000;
    let messages = await redis.get(key);
    messages = JSON.parse(messages);
    if (messages.length === Number(MAX_TEMPORARY_MESSAGE) || (second > 10 && second < 11)) {
      await tableName.bulkCreate(messages);
      await redis.del(key);
    }
    return true;
  } catch (err) {
    return false;
  }
}
