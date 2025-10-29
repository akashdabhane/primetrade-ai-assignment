const mongoose = require("mongoose");
const Joi = require("joi");
const Task = require("../models/task.model.js"); // adjust path if needed

// --- Validation Schemas ---
const createTaskSchema = Joi.object({
    title: Joi.string().min(1).max(200).required(),
    description: Joi.string().min(1).max(2000).required(),
    status: Joi.string().valid("Pending", "In Progress", "Completed").optional(),
    userId: Joi.string().required(),
});

const updateTaskSchema = Joi.object({
    title: Joi.string().min(1).max(200).optional(),
    description: Joi.string().min(1).max(2000).optional(),
    status: Joi.string().valid("Pending", "In Progress", "Completed").optional(),
    userId: Joi.string().optional(),
}).min(1); // require at least one field for update

// --- Helpers ---
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// --- Controllers ---

// Create a task
const createTask = async (req, res) => {
    try {
        const { error, value } = createTaskSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ success: false, errors: error.details.map(d => d.message) });
        }

        if (!isValidObjectId(value.userId)) {
            return res.status(400).json({ success: false, message: "Invalid userId" });
        }

        const task = new Task({
            title: value.title,
            description: value.description,
            status: value.status || "Pending",
            userId: value.userId,
        });

        const saved = await task.save();
        return res.status(201).json({ success: true, data: saved });
    } catch (err) {
        console.error("createTask error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get all tasks (optionally filter by userId or status via query)
const getAllTasks = async (req, res) => {
    try {
        const { userId, status } = req.query;
        const filter = {};

        if (userId) {
            if (!isValidObjectId(userId)) {
                return res.status(400).json({ success: false, message: "Invalid userId query parameter" });
            }
            filter.userId = userId;
        }

        if (status) {
            const allowed = ["Pending", "In Progress", "Completed"];
            if (!allowed.includes(status)) {
                return res.status(400).json({ success: false, message: "Invalid status query parameter" });
            }
            filter.status = status;
        }

        const tasks = await Task.find(filter).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: tasks });
    } catch (err) {
        console.error("getAllTasks error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get single task by id
const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: "Invalid task id" });
        }

        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ success: false, message: "Task not found" });

        return res.status(200).json({ success: true, data: task });
    } catch (err) {
        console.error("getTaskById error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// Update a task (partial update allowed)
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: "Invalid task id" });
        }

        const { error, value } = updateTaskSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ success: false, errors: error.details.map(d => d.message) });
        }

        if (value.userId && !isValidObjectId(value.userId)) {
            return res.status(400).json({ success: false, message: "Invalid userId" });
        }

        const updated = await Task.findByIdAndUpdate(id, { $set: value }, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ success: false, message: "Task not found" });

        return res.status(200).json({ success: true, data: updated });
    } catch (err) {
        console.error("updateTask error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// Delete a task
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: "Invalid task id" });
        }

        const deleted = await Task.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ success: false, message: "Task not found" });

        return res.status(200).json({ success: true, message: "Task deleted" });
    } catch (err) {
        console.error("deleteTask error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// Optional: export default for convenience
module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
};
