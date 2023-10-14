const express = require("express");
const indexRouter = express.Router();
const authRouter = require("./auth");
const medRouter = require("./med")

indexRouter.use("/auth", authRouter);
indexRouter.use("/medications", medRouter);

module.exports = indexRouter;

