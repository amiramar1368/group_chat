import http from "http";

import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";

import check_token from "./src/middlewares/check-token.js";
import sendResponse from "./src/middlewares/send-response.js";
import sendError from "./src/middlewares/error-handler.js";

import signinRouter from "./src/routes/signin-router.js";
import userRouter from "./src/routes/user-router.js";
import groupRouter from "./src/routes/group-router.js";
import chatRouter from "./src/routes/chat-router.js";
import "./src/db/models/index.js";
import socket from './src/socket/index.js';

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

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

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

socket(server)