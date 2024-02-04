const mongoose = require('mongoose');

// Define the Task schema
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    dueDate: {
        type: Date,
        required: true
    },
    priority: {
        type: Number,
        enum: [1, 2, 3], // Priority levels (1 = high, 2 = medium, 3 = low)
        default: 2 // Default priority is medium
    },
    completed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: String, // primary key
        required: true
    },
    completedDate: {
        type: Date // Date when the task was completed
    },

});

// Create a Task model using the schema
const TaskModel = mongoose.model('Task', taskSchema);

module.exports = TaskModel;
