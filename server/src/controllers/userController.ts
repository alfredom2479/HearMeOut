import express from "express";
import asyncHandler from "express-async-handler";
import {body, validationResult} from "express-validator";

import User from "../models/userModel.js"
import {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken
} from "../utils/tokenUtils.js";

// @desc      Create new user 
// @route     POST /api/users/register
// @access    Public
const createUser = [
  body("username")  
    .exists().withMessage("Username field is missing")
    .trim().notEmpty().withMessage("Username is required")
    .isLength({min:2, max:20}).withMessage("Username is too short or too long")
    .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers, and underscores"),
  body("email")
    .exists().withMessage("Email field is missing")
    .trim().notEmpty().withMessage("Email is required")
    .isLength({min:4,max:320}).withMessage("Email is too short or too long")
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
    .custom((value,{req})=>{
      if(value != req.body.password){
        throw new Error("Passwords do not match");
      }
      return true;
    }),


    asyncHandler(async (
      req: express.Request,
      res:express.Response,
      next:express.NextFunction)=>{
      const validationErrors = validationResult(req);

      if(!validationErrors.isEmpty()){
        res.status(400);
        let errorsArray = validationErrors.array();
        let outputErrorString= "";

        for(let i = 0; i < errorsArray.length; i++){
          outputErrorString = outputErrorString.concat(";",errorsArray[i].msg);
        }
        outputErrorString = outputErrorString.slice(0,-1);
        console.log("outputErrorString: "+outputErrorString);
        throw new Error(outputErrorString);
      }

      const {username, email, password} = req.body;

      const userExists = await User.findOne({email});

      if(userExists){
        res.status(400);
        throw new Error("User already exists");
      }

      const user = await User.create({
        username,
        email,
        password,
        isadmin: false
      });

      if(user){
        res.status(201).json({
          message: ` user '${username}' created`
        });
      }
      else{
        res.status(400);
        throw new Error("Invalid user data");
      }
    })
];


// @desc      Log in user 
// @route     POST /api/users/login
// @access    Public

const loginUser = asyncHandler(async(
  req:express.Request,res:express.Response)=>{
   const {email, password} = req.body;
   
   const user = await User.findOne({email});

   if(user && (await user.matchPassword(password)) ){
    
   }
})