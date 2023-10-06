import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const {Schema} = mongoose;

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
  friends: [{username: String, roomId: String}]
});

userSchema.pre("save", async function(next: express.NextFunction){
  if(!this.isModified("password")){
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password,salt);
});

userSchema.methods.matchPassword = async function(enteredPassword: string){
  return await bcrypt.compare(enteredPassword,this.password);
}

const User = mongoose.model("User", userSchema);

export default User;