const express = require('express');
const { getTasks, createTask, updateTask, deleteTask, toggleStatus } = require('../controller/taskController');

const router = express.Router();

router.get('/', getTasks);

router.post('/', createTask);

router.put('/:id', updateTask);

router.patch('/:id/status', toggleStatus);

router.delete('/:id', deleteTask);

module.exports = router;