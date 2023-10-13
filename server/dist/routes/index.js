import userRoutes from "./userRoutes.js";
const constructorMethod = (app) => {
    app.use("/api/users", userRoutes);
    app.use("*", (req, res) => {
        res.status(404);
        res.json({
            message: "Unable to find route"
        });
    });
};
export default constructorMethod;
//# sourceMappingURL=index.js.map