const userdb = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const validateMongodbId = require("../utils/validateMongodbId");
const jwt = require('jsonwebtoken');


const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await userdb.findById(userId)
        console.log('first')
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };


    } catch (error) {
        console.log(error)
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const options = {
    httpOnly: true,
    secure: false,
    sameSite: 'None'
}

// register user
exports.register = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (
        [email, password].some((field) => field?.trim() === "" || field.trim() === undefined || field.trim() === null)
    ) {
        throw new ApiError(400, "Email & password fields are required")
    }

    try {
        const existingUser = await userdb.findOne({ email });

        if (existingUser) throw new ApiError(400, "User with email already exist.");

        // new user
        const user = await userdb.create({
            email,
            password
        });

        return res
            .status(201)
            .json(
                new ApiResponse(201, { data: user }, "User registered successfully")
            )
    } catch (error) {
        throw new ApiError(500, error.message || "Failed to register user");
    }
})

// login
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (
        [email, password].some((field) =>
            field?.trim() === "" || field.trim() === undefined || field.trim() === null)
    ) {
        throw new ApiError(400, "Email & password fields are required")
    }

    try {
        const user = await userdb.findOne({ email });
        console.log(user)
        if (!user) {
            throw new ApiError(404, "User not found")
        }

        const isPasswordCorrect = user.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
            throw new ApiError(401, "Invalid password")
        }

        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

        const loggedInUser = await userdb.findById(user._id).select("-password -refreshToken")

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(200,
                    {
                        "accessToken": accessToken,
                        "refreshToken": refreshToken,
                        loggedInUser
                    },
                    "User logged in successfully")
            )
    } catch (error) {
        throw new ApiError(500, error.message || "Failed to login user");
    }
})

exports.logoutUser = asyncHandler(async (req, res) => {
    await userdb.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))
})

exports.refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await userdb.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed")
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

// get user
exports.getUser = asyncHandler(async (req, res) => {
    const id = req.params.id;
    validateMongodbId(id);

    const user = await userdb.findById(id)

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "User retrieved successfully")
        )
})

// get logged in user
exports.getLoggedInUser = asyncHandler(async (req, res) => {
    const user = await userdb.findById(req.user._id)

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "User retrieved successfully")
        )
})

// update user info
exports.updateUserInfo = asyncHandler(async (req, res) => {
    if (!req.body) {
        throw new ApiError(400, "Content can not be empty")
    }
    const userId = req.user._id;

    try {
        const updatedUser = await userdb.findByIdAndUpdate(userId,
            {
                $set: {
                    firstName: req?.body?.firstname,
                    lastName: req?.body?.lastname,
                    phone: req?.body?.phoneNumber,
                    password: req?.body?.password,
                    email: req?.body?.email,
                    address: req?.body?.address,
                }
            }, { runValidation: false, new: true })

        return res
            .status(200)
            .json(
                new ApiResponse(200, updatedUser, "User information updated successfully")
            )
    } catch (error) {
        throw new ApiError(500, error.message || "Some error occure while updating user information");
    }
})