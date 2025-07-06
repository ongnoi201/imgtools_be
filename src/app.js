require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const pictureRoutes = require('./routes/pictureRoutes');
const folderRoutes = require('./routes/folderRoutes');
const renderRoutes = require('./routes/renderRoutes');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: 'https://imgtools-kappa.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
connectDB();

app.use('/api/users', userRoutes);
app.use('/api/pictures', pictureRoutes);
app.use('/api/folders', folderRoutes);
// app.use('/api/render', renderRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});