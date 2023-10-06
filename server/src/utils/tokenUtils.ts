import express from "express";
import jwt from "jsonwebtoken";

const createAccessToken = (userId:string) =>{
  return jwt.sign({userId}, process.env.ACCESS_JWT_SECRET,{
    expiresIn: '2m'
  });
};

const createRefreshToken = (userId:string) => {
  return jwt.sign({userId}, process.env.REFRESH_JWT_SECRET, {
    expiresIn: '1d'
  });
};

const sendAccessToken = (
  req:express.Request, res:express.Response, accessToken:string) => {
    res.send({
      accessToken,
      email: req.body.email
    });
};

const sendRefreshToken = (res:express.Response, refreshToken:string) => {
  res.cookie("refreshtoken",refreshToken,{
    httpOnly : true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24*60*60*1000,
    path: "/refresh_token"
  })
}

export {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken
}