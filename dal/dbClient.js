const logger = require("logger");
const { default: MongoDBClient } = require("nodemongodbclient");

const dbCli = new MongoDBClient("docMate", ("mongodb://127.0.0.1:27017/?retryWrites=true&w=majority"));

async function InitialiseMongoClient(){
  await dbCli.connect();
}

module.exports = {
  InitialiseMongoClient,
  dbCli,
};