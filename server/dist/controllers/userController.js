import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import User from "../models/userModel.js";
import { createAccessToken, createRefreshToken, sendAccessToken, sendRefreshToken } from "../utils/tokenUtils.js";
// @desc      Create new user 
// @route     POST /api/users/register
// @access    Public
const createUser = [
    body("username")
        .exists().withMessage("Username field is missing")
        .trim().notEmpty().withMessage("Username is required")
        .isLength({ min: 2, max: 20 }).withMessage("Username is too short or too long")
        .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers, and underscores"),
    body("email")
        .exists().withMessage("Email field is missing")
        .trim().notEmpty().withMessage("Email is required")
        .isLength({ min: 4, max: 320 }).withMessage("Email is too short or too long")
        .isEmail().withMessage("Please provide a valid email address"),
    body("password")
        .exists().withMessage("Password field is missing")
        .trim().notEmpty().withMessage("Password is required")
        .matches(/\d/).withMessage("Password must contain at least 1 number")
        .matches(/[a-z]/).withMessage("Password must contain at least 1 lowercase letter")
        .matches(/[A-z]/).withMessage("Password must contain at least 1 uppercase letter")
        .matches(/[\W_]/).withMessage("Password must contain at least one special character"),
    body("confirm_password")
        .exists().withMessage("Confirm password field is missing")
        .notEmpty().withMessage("Confirm password is requied")
        .custom((value, { req }) => {
        if (value != req.body.password) {
            throw new Error("Passwords do not match");
        }
        return true;
    }),
    asyncHandler(async (req, res, next) => {
        //get validation error messages if they exist and format them into
        //a single string for easy display
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            res.status(400);
            let errorsArray = validationErrors.array();
            let outputErrorString = "";
            for (let i = 0; i < errorsArray.length; i++) {
                outputErrorString = outputErrorString.concat(";", errorsArray[i].msg);
            }
            outputErrorString = outputErrorString.slice(0, -1);
            console.log("outputErrorString: " + outputErrorString);
            throw new Error(outputErrorString);
        }
        // Get body parameters and check if the user exists
        const { username, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error("User already exists");
        }
        //attempt to create user and return success or failure status
        const user = await User.create({
            username,
            email,
            password,
            isadmin: false
        });
        if (user) {
            res.status(201).json({
                message: ` user '${username}' created`
            });
        }
        else {
            res.status(400);
            throw new Error("Invalid user data");
        }
    })
];
// @desc      Log in user 
// @route     POST /api/users/login
// @access    Public
const loginUser = asyncHandler(async (req, res) => {
    //Get user email and password from body
    const { email, password } = req.body;
    //Get user from db using email parameter
    const user = await User.findOne({ email });
    console.log(user);
    //Check is user exists and if the password is correct
    if (user && (await user.matchPassword(password))) {
        //Create and send refresh token and access token
        const accessToken = createAccessToken(user.username);
        const refreshToken = createRefreshToken(user._id);
        //Add refressh token to user in DB
        user.refreshtoken = refreshToken;
        await user.save();
        res.status(200);
        sendRefreshToken(res, refreshToken);
        sendAccessToken(user.username, res, accessToken);
    }
    else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});
// @desc      Log out user 
// @route     POST /api/users/logout
// @access    Private
const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("refreshtoken", { path: '/refresh_token' });
    //remove refresh token from db
    res.status(200).json({ message: "Logged out succesfully" });
});
// @desc      Gets current user information
// @route     GET /api/users/me
// @access    Private
const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        req.json({
            _id: user._id,
            username: user.username,
            email: user.email
        });
    }
    else {
        res.status(404);
        throw new Error("User not found");
    }
});
// @desc      Get new access token
// @route     GET /api/users/refresh_token
// @access    Private
const getNewToken = asyncHandler(async (req, res) => {
    const userInfo = req.refreshtoken;
    console.log(userInfo);
    const user = await User.findOne({ _id: userInfo.userId });
    if (!user)
        res.json({ accessToken: '' });
    if (user.refreshtoken !== req.cookies.refreshtoken) {
        res.json({ accessToken: '' });
    }
    const newAccessToken = createAccessToken(user.username);
    const newRefreshToken = createRefreshToken(user._id);
    user.refreshtoken = newRefreshToken;
    await user.save();
    res.status(200);
    sendRefreshToken(res, newRefreshToken);
    sendAccessToken(user.username, res, newAccessToken);
});
export { createUser, loginUser, logoutUser, getMe, getNewToken };
//# sourceMappingURL=userController.js.map