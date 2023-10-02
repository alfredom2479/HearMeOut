import express from "express";
const port = 5000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", (req, res) => { res.send("<h1>Test</h1>"); });
app.listen(port, () => console.log(`server started on port ${port}`));
//# sourceMappingURL=app.js.map