const mongoose = require("mongoose");
const configDB = require("./configDB");
const logger = require("pino")();
// console.log(config.moongoose.enabled)

const connectMongoDB = () => {
  if (configDB.moongoose.enabled) {
    mongoose
      .connect(configDB.moongoose.url)
      .then(() => {
        logger.info("Connected to MongoDB");
      })
      .catch((err) => console.error("Error connecting to MongoDB"));
  }
};

module.exports = connectMongoDB