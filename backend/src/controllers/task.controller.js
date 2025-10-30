const mongoose = require("mongoose");
const Joi = require("joi");
const taskdb= require("../models/task.model.js"); // adjust path if needed
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

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
const createTask = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    req.body.userId = _id.toString();
    
    const { error, value } = createTaskSchema.validate(req.body, { abortEarly: false });
    if (error) {
        throw new ApiError(400, "Validation failed", error.details.map(d => d.message));
    }

    if (!isValidObjectId(value.userId)) {
        throw new ApiError(400, "Invalid userId");
    }

    const task = new taskdb({
        title: value.title,
        description: value.description,
        status: value.status || "Pending",
        userId: value.userId,
    });

    const saved = await task.save();
    return res
        .status(201)
        .json(new ApiResponse(201, saved, "Task created successfully"));
});

// Get all tasks (optionally filter by userId or status via query)
const getAllTasks = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const userId = _id.toString();

    if (userId) {
        if (!isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid userId query parameter");
        }
    }

    const tasks = await taskdb.find({ userId: userId }).sort({ createdAt: -1 });
    return res
        .status(200)
        .json(new ApiResponse(200, tasks, "Tasks retrieved successfully"));
});

// Get single task by id
const getTaskById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid task id");
    }

    const task = await taskdb.findById(id);
    if (!task) throw new ApiError(404, "Task not found");
    if (task.userId.toString() !== req.user._id.toString()) throw new ApiError(401, "You are not authorized to access this task.")
    
    return res
        .status(200)
        .json(new ApiResponse(200, task, "Task retrieved successfully"));
});

// Update a task (partial update allowed)
const updateTask = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid task id");
    }

    const { error, value } = updateTaskSchema.validate(req.body, { abortEarly: false });
    if (error) {
        console.log(error)
        throw new ApiError(400, "Validation failed", error.details.map(d => d.message));
    }

    if (value.userId && !isValidObjectId(value.userId)) {
        throw new ApiError(400, "Invalid userId");
    }

    const updated = await taskdb.findByIdAndUpdate(id, { $set: value }, { new: true, runValidators: true });
    if (!updated) throw new ApiError(404, "Task not found");

    return res
        .status(200)
        .json(new ApiResponse(200, updated, "Task updated successfully"));
});

// Delete a task
const deleteTask = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid task id");
    }

    const task = await taskdb.findById(id);
    if (task.userId.toString() !== req.user._id.toString()) throw new ApiError(401, "You are not authorized to delete this task.")

    const deleted = await taskdb.findByIdAndDelete(id);
    if (!deleted) throw new ApiError(404, "Task not found");

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Task deleted successfully"));
});

// Optional: export default for convenience
module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
};
