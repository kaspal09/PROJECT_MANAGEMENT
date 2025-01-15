const express = require('express');
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const { Server } = require('socket.io');
const http = require("http");
const { socketConnection } = require("./utils/socket")


const port = process.env.PORT || 8000;

//initialize app and server
const app = express();
const server = http.createServer(app);
const io = new Server(server);
io.on("connection", (socket) => {
    console.log("socket.io is connected successfully", socket.id)
    socketConnection(io, socket)
    // Notify all users when a project is created
    // socket.on("projectCreated", (project) => {
    //     console.log("Project Created:", project);
    //     io.emit("notifyProjectCreated", {
    //         message: `A new project was created: ${project.name}`,
    //         project,
    //     });
    // });

    // // Notify all users when a project is updated
    // io.on("projectUpdated", (project) => {
    //     console.log("Project Updated:", project);
    //     io.emit("notifyProjectUpdated", {
    //         message: `The project "${project.name}" was updated.`,
    //         project,
    //     });
    // });

    // // Notify all users when a project is deleted
    // io.on("projectDeleted", (projectId) => {
    //     console.log("Project Deleted:", projectId);
    //     io.emit("notifyProjectDeleted", {
    //         message: `A project was deleted: ${projectId}`,
    //         projectId,
    //     });
    // });

    // // Notify all users when a task is added to a project
    // io.on("taskAdded", (task) => {
    //     console.log("Task Added to Project:", task);
    //     io.emit("notifyTaskAdded", {
    //         message: `A new task "${task.name}" was added to project "${task.projectId}".`,
    //         task,
    //     });
    // });

    // // Notify all users when a task is removed from a project
    // io.on("taskRemoved", (task) => {
    //     console.log("Task Removed from Project:", task);
    //     io.emit("notifyTaskRemoved", {
    //         message: `The task "${task.name}" was removed from project "${task.projectId}".`,
    //         task,
    //     });
    // });

    // // Notify all users when a task is updated
    // io.on("taskUpdated", (task) => {
    //     console.log("Task Updated:", task);
    //     io.emit("notifyTaskUpdated", {
    //         message: `The task "${task.name}" was updated in project "${task.projectId}".`,
    //         task,
    //     });
    // });

});
// Log disconnects
io.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
});


//routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes')

//middleware
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



server.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});
