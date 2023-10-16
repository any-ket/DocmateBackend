const express = require("express");
const session = require("express-session");
const logger = require("logger");
const app = express();
const PORT = 9099;

const { InitialiseMongoClient } = require("./dal/dbClient");

app.use(session({
  secret: "SECRET",
  resave: false,
  saveUninitialized: true,
}));

app.use("/static", express.static('uploads'))

app.use(require("./httpl"));

InitialiseMongoClient().then(() => {
  app.listen(PORT, () => {
    logger.info(`Server is running at http://localhost:${PORT}`);
  });
}).catch(e => {
  logger.error("Error while connecting to database", e);
});
