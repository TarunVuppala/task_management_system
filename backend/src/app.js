const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const router = require('../api/router/index');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH']
}));

app.use('/api', router);

app.get('/', (req, res) => {
    res.json(200).send({
        message: 'Welcome to Task Management System',
        success: true
    });
});

module.exports = app;