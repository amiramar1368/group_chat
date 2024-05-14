import {Router} from 'express';

import {GroupController} from '../controller/group-controller.js';

const router = new Router();

router.post("/",GroupController.addGroup);




export default router;