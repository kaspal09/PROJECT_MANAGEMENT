const Task = require('../models/taskSchema');
const Project = require('../models/projectSchema');
const { sendMessage } = require("../utils/socket")

// Create a new task within a project
exports.createTask = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { title, description } = req.body;

        // Check if the project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const task = new Task({
            title,
            description,
            project: projectId,
            createdBy: req.user.id
        });

        await task.save();
        sendMessage("taskAdded", {
            message: `Task "${task._id}" has been created.`,
        });

        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Error creating task' });
    }
};

// Get tasks for a specific project with pagination, search, and sorting
exports.getTasks = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { page = 1, limit = 10, search = '', sortBy = 'createdAt', order = 'asc' } = req.query;

        // Check if the project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const query = {
            project: projectId,
            ...(search && { title: { $regex: search, $options: 'i' } })
        };

        const tasks = await Task.find(query)
            .populate('createdBy', 'name email') // Populate user info
            .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Task.countDocuments(query);
        //to notify about the task retrivtion
        //sendMessage(`Task wth id ${tasks._id} has been created`)

        res.status(200).json({
            data: tasks,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total
            }
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Error fetching tasks' });
    }
};

// Update a specific task within a project
exports.updateTask = async (req, res) => {
    try {
        const { projectId, taskId } = req.params;
        const { title, description } = req.body;

        // Check if the task exists and is linked to the project
        const task = await Task.findOne({ _id: taskId, project: projectId });
        if (!task) {
            return res.status(404).json({ error: 'Task not found in this project' });
        }

        // Check if the user is the creator of the task or project
        if (task.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ error: 'You are not authorized to update this task' });
        }

        task.title = title || task.title;
        task.description = description || task.description;

        await task.save();
        //to notify about the updates
        sendMessage("taskupdate", {
            message: `Task wth id ${task._id} has been updated`
        });
        res.status(200).json(task);

    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Error updating task' });
    }
};

// Delete a task within a project
exports.deleteTask = async (req, res) => {
    try {
        const { projectId, taskId } = req.params;

        // Check if the task exists and is linked to the project
        const task = await Task.findOne({ _id: taskId, project: projectId });
        if (!task) {
            return res.status(404).json({ error: 'Task not found in this project' });
        }

        // Check if the user is the creator of the task or project
        if (task.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ error: 'You are not authorized to delete this task' });
        }

        await task.deleteOne();
        //to notify about the deletion
        sendMessage("taskDelected", {
            message: `Task "${task._id}" has been deleted.`,
        });
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Error deleting task' });
    }
};
