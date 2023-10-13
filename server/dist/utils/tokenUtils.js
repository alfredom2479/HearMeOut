import jwt from "jsonwebtoken";
const createAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.ACCESS_JWT_SECRET, {
        expiresIn: '10m'
    });
};
const createRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.REFRESH_JWT_SECRET, {
        expiresIn: '1d'
    });
};
const sendAccessToken = (username, res, accessToken) => {
    res.json({
        accessToken,
        username
    });
};
const sendRefreshToken = (res, refreshToken) => {
    res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
        path: "/refresh_token"
    });
};
export { createAccessToken, createRefreshToken, sendAccessToken, sendRefreshToken };
//# sourceMappingURL=tokenUtils.js.map