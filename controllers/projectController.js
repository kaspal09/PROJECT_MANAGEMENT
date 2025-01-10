const Project = require('../models/projectSchema');

// Create a new project
exports.createProject = async (req, res) => {
    try {
        const { name, description } = req.body;

        const project = new Project({
            name,
            description,
            createdBy: req.user.id // Assuming req.user contains the authenticated user
        });

        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ error: 'Error creating project' });
    }
};

// Get all projects with pagination, search, and sorting
exports.getProjects = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', sortBy = 'createdAt', order = 'asc' } = req.query;

        const query = search ? { name: { $regex: search, $options: 'i' } } : {};

        const projects = await Project.find(query)
            .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Project.countDocuments(query);

        res.status(200).json({
            data: projects,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching projects' });
    }
};

// Update a project
exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Check if the authenticated user is the creator
        if (project.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ error: 'You are not authorized to update this project' });
        }

        project.name = name || project.name;
        project.description = description || project.description;

        await project.save();
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: 'Error updating project' });
    }
};

// Delete a project
exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Check if the authenticated user is the creator
        if (project.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ error: 'You are not authorized to delete this project' });
        }

        await project.deleteOne();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error deleting project' });
    }
};
