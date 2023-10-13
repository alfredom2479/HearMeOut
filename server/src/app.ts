//npm packages
import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";

//Configuration
import connectDB from "./config/db.js"
import useRoutes from "./routes/index.js";

//My Middleware
import {
  errorHandler
} from "./middleware/errorMiddleware.js";

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

useRoutes(app);

app.use(errorHandler);

app.listen(port, ()=> console.log(`server started on port ${port}`))