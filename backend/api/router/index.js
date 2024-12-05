import express from 'express';

import taskTouter from './taskRouter.js';
import authRouter from './authRouter.js'
import auth from '../../middleware/auth.js';

const router = express.Router();

router.get('/verify', auth, (req, res) => {
    res.status(200).json({
        message: 'Welcome to Task Management System',
        success: true
    });
});

router.use('/tasks', auth, taskTouter);

router.use('/auth', authRouter);

export default router;