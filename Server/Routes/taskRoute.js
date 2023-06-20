import express from 'express';
import { createTasksController, getTasksController } from '../Controllers/taskControllers.js';
import { requireSignIn } from '../Middlewares/authMiddleware.js';



const router = express.Router()


router.post('/create', requireSignIn, createTasksController)

router.get("/user-tasks/:userId", getTasksController);




export default router;