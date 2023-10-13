import express from "express";

import userRoutes from "./userRoutes.js"

const constructorMethod = (app : express.Application) =>{

  app.use("/api/users",userRoutes);

  app.use("*", (req : express.Request, res : express.Response) =>{
    res.status(404);
    res.json({
      message: "Unable to find route"
    })
  })
}

export default constructorMethod;