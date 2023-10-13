//import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Schema, model } from "mongoose";
const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Please add a username"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Please add an email address"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please add a password"]
    },
    friends: [{ username: String, roomId: String }],
    refreshtoken: { type: String }
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
userSchema.method('matchPassword', async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
});
const User = model("User", userSchema);
export default User;
//# sourceMappingURL=userModel.js.map