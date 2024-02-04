const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

router.get('/tasks', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Extract token from request headers
        jwt.verify(token, secretKey, async (err, decoded) => {
            if (err) {
                res.status(401).json({ error: 'Unauthorized' });
            } else {
                const userEmail = decoded.email; // Extract email from decoded token
                console.log({current:userEmail})
                const tasks = await Task.find({ user: userEmail }); // Fetch tasks associated with the user's email
                res.json(tasks);
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// POST a new task for the current user
router.post('/tasks', async (req, res) => {
    console.log(req);
    if(!req.body.priority) req.body.priority=2;
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        priority: req.body.priority,
        user: req.body.user 
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// update 
router.patch('/tasks/:id', getTask, async (req, res) => {
    try {
        // Update task properties if provided in the request body
        if (req.body.title != null) {
            res.task.title = req.body.title;
        }
        if (req.body.description != null) {
            res.task.description = req.body.description;
        }
        if (req.body.dueDate != null) {
            res.task.dueDate = req.body.dueDate;
        }
        if (req.body.priority != null) {
            res.task.priority = req.body.priority;
        }

        // Check if the completed status is explicitly set to true
        if (req.body.completed === true) {
            res.task.completed = true;
            res.task.completedDate = new Date().toISOString().slice(0, 10); // Set completed date
        } else if (req.body.completed === false) {
            res.task.completed = false;
            res.task.completedDate = null; // Reset completed date
        }

        // Save the updated task
        const updatedTask = await res.task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// DELETE a task for the current user
router.delete('/tasks/:id', getTask, async (req, res) => {
    try {
        await Task.deleteOne({ _id: req.params.id }); // Use Task model directly to delete the task
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// getTask 
async function getTask(req, res, next) {
    let task;
    try {
        const token = req.headers.authorization.split(' ')[1]; // Extract token from request headers
        const decoded = jwt.verify(token, secretKey); // Decode the token synchronously

        const userEmail = decoded.email; // Extract email from decoded token
        task = await Task.findOne({ _id: req.params.id, user: userEmail });
        if (task == null) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.task = task;
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

// update priority 
router.patch('/tasks/priority/:id', getTask, async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Extract token from request headers
        jwt.verify(token, secretKey, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Unauthorized' });
            } else {
                const userEmail = decoded.email; // Extract email from decoded token
                const updatedTask = await Task.findByIdAndUpdate({ _id: req.params.id, user: userEmail }, { priority: req.body.priority }, { new: true });
                res.json(updatedTask);
            }
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});



module.exports = router;
