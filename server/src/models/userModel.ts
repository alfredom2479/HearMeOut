import express from "express";
//import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {Model, Schema, model} from "mongoose";

//const {Schema, Model, model} = mongoose;

type friendObj = {
  username: string,
  roomId: string
}

interface IUser {
  _id?: any,
  username: string,
  email: string,
  password: string,
  friends?: Array<friendObj>,
  refreshtoken?: string
}

interface IUSerMethods {
  matchPassword(enteredPassword:string): Boolean
}

type UserModel = Model<IUser, {}, IUSerMethods>;

const userSchema = new Schema({
  username:{
    type: String,
    required: [true, "Please add a username"],
    unique: true
  },
  email: {
    type: String,
    required: [true, "Please add an email address"],
    unique: true
  },
  password:{
    type: String,
    required: [true, "Please add a password"]
  },
  friends: [{username: String, roomId: String}],
  refreshtoken: {type: String}
});

userSchema.pre("save", async function(next: express.NextFunction){
  if(!this.isModified("password")){
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password,salt);
});

userSchema.method('matchPassword', async function(enteredPassword: string){
  return await bcrypt.compare(enteredPassword,this.password);
})

const User = model<IUser,UserModel>("User", userSchema);

export default User;