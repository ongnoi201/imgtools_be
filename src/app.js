require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const pictureRoutes = require('./routes/pictureRoutes');
const folderRoutes = require('./routes/folderRoutes');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
connectDB();

app.use('/api/users', userRoutes);
app.use('/api/pictures', pictureRoutes);
app.use('/api/folders', folderRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});