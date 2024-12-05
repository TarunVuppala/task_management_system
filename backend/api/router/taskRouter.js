import express from 'express';
import { getTasks, createTask, updateTask, deleteTask, toggleStatus } from '../controller/taskController.js';

const router = express.Router();

router.get('/', getTasks);

router.post('/', createTask);

router.put('/:id', updateTask);

router.patch('/:id/toggle', toggleStatus);

router.delete('/:id', deleteTask);

export default router;