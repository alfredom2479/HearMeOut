import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
//you need to change this so that it uses access token
//instead of refresh token
const protect = asyncHandler(async (req, res, next) => {
    const accessToken = req.get('accesstoken');
    console.log(accessToken);
    if (!accessToken)
        throw new Error("missing accessToken");
    //const decodedToken = accessToken.splitI
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_JWT_SECRET);
    console.log("decoded token: ");
    console.log(decodedToken);
    next();
    /*
    let token:string;

    token = req.cookies.refreshtoken;

    if(token){
      try{
        const decodedToken:any = jwt.verify(token, process.env.ACCESS_JWT_SECRET);
        req.user = await User.findById(decodedToken.userId);
        next();
      }catch(error){
        console.error(error);
        res.status(401);
        throw new Error("Not authorized, invalid refresh token");
      }
    }
    else{
      res.status(401);
    }
    */
});
const checkAndRefresh = (req, res, next) => {
    const userRefreshToken = req.cookies.refreshtoken;
    console.log(req.cookies);
    console.log(userRefreshToken);
    if (!userRefreshToken)
        return res.json({ accessToken: '' });
    const decodedToken = jwt.verify(userRefreshToken, process.env.REFRESH_JWT_SECRET);
    if (!decodedToken)
        return res.json({ accessToken: '' });
    req.refreshtoken = decodedToken;
    next();
};
export { protect, checkAndRefresh };
//# sourceMappingURL=authMiddleware.js.map