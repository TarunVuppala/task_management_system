import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

import router from '../api/router/index.js';
import auth from '../middleware/auth.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ['http://localhost:5173', 'https://task-management-system-fawn.vercel.app', 'task-management-system-git-main-taruns-projects-93c37392.vercel.app', 'task-management-system-qz59cs00d-taruns-projects-93c37392.vercel.app'],
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    credentials: true
}));

app.use('/api', router);

app.get('/', auth, (req, res) => {
    res.json(200).send({
        message: 'Welcome to Task Management System',
        success: true
    });
});

export default app;