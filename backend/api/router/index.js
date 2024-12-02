const express = require('express');

const taskTouter = require('./taskRouter');
const authRouter = require('./authRouter')
const auth = require('../../middleware/auth');

const router = express.Router();

router.get('/verify', (req, res) => {
    res.json(200).send({
        message: 'Welcome to Task Management System',
        success: true
    });
});

router.use('/tasks', auth, taskTouter);

router.use('/auth', authRouter);

module.exports = router;