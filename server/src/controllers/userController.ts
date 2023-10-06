import asyncHandler from "express-async-handler";
import {body, validationResult} from "express-validator";

import User from "../models/userModel.js"
import generateToken from "../utils/generateToken.js";