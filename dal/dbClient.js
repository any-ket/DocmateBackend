const logger = require("logger");
const { default: MongoDBClient } = require("nodemongodbclient");

const dbCli = new MongoDBClient("docMate", ("mongodb://10.20.60.252/?retryWrites=true&w=majority"));

async function InitialiseMongoClient(){
  await dbCli.connect();
}

module.exports = {
  InitialiseMongoClient,
  dbCli,
};