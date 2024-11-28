const express = require('express');
const { getTasks, createTask, updateTask, deleteTask, toggleStatus } = require('../controller/taskController');

const router = express.Router();

router.get('/tasks', getTasks);

router.post('/tasks', createTask);

router.put('/tasks/:id', updateTask);

router.patch('/tasks/:id/status', toggleStatus);

router.delete('/tasks/:id', deleteTask);

module.exports = router;