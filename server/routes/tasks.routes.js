import express from 'express';
// import db from '../db/connection';
// import { sendResponse } from '../utils/response.js';
import { getTasks, createTasks, updateTask, deleteTask } from '../controllers/tasks.controller.js';

const router = express.Router();


router.get('/', getTasks);
router.post('/', createTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);



export default router;

