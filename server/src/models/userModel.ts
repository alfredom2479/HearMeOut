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