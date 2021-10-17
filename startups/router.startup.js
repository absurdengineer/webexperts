//? Load Modules
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const ApiRouter = require("../routers/api.router");

module.exports = (app) => {
  //? Middlewares to execute before Route Handlers
  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());
  //? Routers
  app.use("/api", ApiRouter);
  //? Middlewares to execute after Route Handlers
};
