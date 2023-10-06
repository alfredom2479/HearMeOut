const constructorMethod = (app) => {
    app.use("/*", (req, res) => {
        res.status(404);
        res.json({
            message: "Unable to find route"
        });
    });
};
export {};
//# sourceMappingURL=index.js.map