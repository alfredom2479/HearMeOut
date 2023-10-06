import express from "express";



const constructorMethod = (app : express.Application) =>{


  app.use("/*", (req : express.Request, res : express.Response) =>{
    res.status(404);
    res.json({
      message: "Unable to find route"
    })
  })
}