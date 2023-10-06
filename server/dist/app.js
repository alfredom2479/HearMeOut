import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
const port = process.env.PORT || 5000;
connectDB();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/", (req, res) => { res.send("<h1>Test 2</h1>"); });
app.listen(port, () => console.log(`server started on port ${port}`));
//# sourceMappingURL=app.js.map