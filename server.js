const express = require('express');
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 8000;

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes')

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api', projectRoutes);
app.use('/api', taskRoutes);

// Database connection
mongoose
    .connect(process.env.DB_URL,)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Connection error:", error);
    });

app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});
