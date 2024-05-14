import { Router } from "express";

import { ChatController } from "../controller/chat-controller.js";

const router = new Router();

router.get("/home", ChatController.homePage);
router.get("/group-chat/:groupId", ChatController.fetchGroupMessage);

export default router;
