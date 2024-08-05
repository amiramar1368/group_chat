import { Server } from "socket.io";

import { ChatController } from "../controller/chat-controller.js";
import authHandler from "./helper.js";

const connectedUsers = {};

const socket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use(authHandler);

  io.on("connection", (socket) => {
    socket.on("join to group", (data) => {
      const userId = "user_" + data.user.id;
      const groupId = "group_" + data.groupId;

      const prevGroupId = connectedUsers[userId];
      if (prevGroupId && prevGroupId !== groupId) {
        socket.to(prevGroupId).emit("left the group",{user:socket.user.fullname,id:socket.user.id})
        socket.leave(prevGroupId);
      }
      socket.join(groupId);
      socket.broadcast.to(groupId).emit("message", { senderId: 1, text: `${data.user.fullname} has joined!` });
      connectedUsers[userId] = groupId;
    });

    socket.on("message", async (data) => {
      const token = socket.request.headers.cookie.split("token=")[1];
      const groupId = "group_" + data.groupId;
      const userGroups = socket.user.groups;
      const hasAccess = userGroups.find((group) => group.id == data.groupId);
      if (hasAccess) {
        const response = await ChatController.addNewGroupMessage(token, data);
        if (response.success) {
          io.to(groupId).emit("message", { senderId: response.senderId, text: response.text, image: response.image });
        } else {
          io.to(groupId).emit("message", { senderId: 1, text: "an error occured" });
        }
      }
    });
  });
};

export default socket;
