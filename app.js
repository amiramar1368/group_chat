import http from "http";

import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import { Server } from "socket.io";

import check_token from "./src/middlewares/check-token.js";
import sendResponse from "./src/middlewares/send-response.js";
import sendError from "./src/middlewares/error-handler.js";

import signinRouter from "./src/routes/signin-router.js";
import userRouter from "./src/routes/user-router.js";
import groupRouter from "./src/routes/group-router.js";
import chatRouter from "./src/routes/chat-router.js";
import { ChatController } from "./src/controller/chat-controller.js";
import "./src/db/models/index.js";
import {getUserByToken} from './src/utils/get-user-by-token.js';

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(sendResponse);
app.use(sendError);
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));

app.set("view engine", "ejs");

app.use("/", signinRouter);
app.use("/users", userRouter);
app.use("/chat", check_token, chatRouter);
app.use("/groups",check_token, groupRouter);

const connectedUsers = {}; 

io.on("connection", (socket) => {
  socket.on("join to group", (data) => {
    const userId ="user_"+ data.user.id; 
    const groupId ="group_"+ data.groupId; 

    const prevGroupId = connectedUsers[userId]; 
    if (prevGroupId && prevGroupId !== groupId) {
      socket.leave(prevGroupId);
    }
    socket.join(groupId);
    socket.broadcast.to(groupId).emit("message", { senderId:1 , text: `${data.user.fullname} has joined!` });
    connectedUsers[userId] = groupId;
  });

  socket.on("message", async (data) => {
    const token = socket.request.headers.cookie.split("=")[1];
    const groupId = "group_"+data.groupId;
    const userGroups =  getUserByToken(token).groups;
    const hasAccess = userGroups.find(group=>group.id==data.groupId)
    if(hasAccess){
      const response = await ChatController.addNewGroupChat(token, data);
      if(response.success){
        io.to(groupId).emit("message", { senderId:response.senderId, text:response.text ,image:response.image});
      }else{
        io.to(groupId).emit("message", {senderId:1, text:"an error occured" });
      }
    }
  });
});

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
