import {Router} from 'express';

import {UserController} from '../controller/user-controller.js';
import {upload} from '../utils/upload.js';

const router = new Router();

router.post("/sign-in",UserController.signIn);
router.post("/sign-up",upload.single("avatar"),UserController.signUp);
router.post("/add-user-to-group",UserController.addUserToGroup);


export default router;