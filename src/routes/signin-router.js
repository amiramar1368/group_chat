import {Router} from 'express';

import { UserController } from "../controller/user-controller.js";

const router = new Router();
router.get("/",UserController.signInPage);

export default router;