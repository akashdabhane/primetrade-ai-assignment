const mongoose = require("mongoose");
const userdb = require("../models/user.model");
const taskdb = require("../models/task.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Admin: Get all users
const getAllUsers = asyncHandler(async (req, res) => {
    if (!req.user?.isAdmin) {
        throw new ApiError(403, "Forbidden: Admins only");
    }

    const users = await userdb.find({}).select("-password -refreshToken").sort({ createdAt: -1 });
    return res
        .status(200)
        .json(new ApiResponse(200, users, "All users retrieved successfully"));
});

// Admin: Get grouped tasks for a specific user
const getUserTasksGrouped = asyncHandler(async (req, res) => {
    if (!req.user?.isAdmin) {
        throw new ApiError(403, "Forbidden: Admins only");
    }

    const { userId } = req.params;
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id");
    }

    // Ensure user exists (optional but helpful)
    const user = await userdb.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const tasks = await taskdb
        .find({ userId })
        .sort({ createdAt: -1 }); // recent first

    const grouped = {
        user: user,
        pending: [],
        inProgress: [],
        completed: []
    };

    for (const t of tasks) {
        if (t.status === "Pending") grouped.pending.push(t);
        else if (t.status === "In Progress") grouped.inProgress.push(t);
        else if (t.status === "Completed") grouped.completed.push(t);
    }

    return res
        .status(200)
        .json(new ApiResponse(200, grouped, "User tasks grouped successfully"));
});


module.exports = {
    getAllUsers,
    getUserTasksGrouped
}