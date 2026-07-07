import express from 'express';
import userController from './src/controller.js';
import sequelize from './src/db/db.js';
import cors from 'cors';
import os from 'os';
import multer from 'multer';

import { initAdmin } from './src/db/initAdmin.js';

const interfaces = os.networkInterfaces();

const corsOptions = {
  origin: '*',
  methods: 'GET, POST, PATCH, DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors(corsOptions));
const uploads = multer({ dest: 'files/', limits: { fileSize: 20000000 } }); // 20MB
app.use(express.static('files'));

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World',
  });
});

app.use('/users', userController);

app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Not Found',
  });
});

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  await sequelize.sync({
    force: false,
  }).then(async () => {
    await initAdmin();
  });
});