import express from "express";

const appRouter = express.Router();

appRouter.get("/data", (req, res) => {
    res.status(200).json({score: req.anomalyScore});
});


export default appRouter;