import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from "../models/userModel.js";
//you need to change this so that it uses access token
//instead of refresh token
const protect = asyncHandler(async (req, res, next) => {
    let token;
    token = req.cookies.refreshtoken;
    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.ACCESS_JWT_SECRET);
            req.user = await User.findById(decodedToken.userId);
            next();
        }
        catch (error) {
            console.error(error);
            res.status(401);
            throw new Error("Not authorized, invalid refresh token");
        }
    }
    else {
        res.status(401);
    }
});
//# sourceMappingURL=authMiddleware.js.map