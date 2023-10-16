const logger = require("logger");
const { default: MongoDBClient } = require("nodemongodbclient");

const dbCli = new MongoDBClient("docMate", ("mongodb+srv://aniket:Z6GjqBZ5mety0JXl@cluster0.rt82z3p.mongodb.net/?retryWrites=true&w=majority"));

async function InitialiseMongoClient(){
  await dbCli.connect();
}

module.exports = {
  InitialiseMongoClient,
  dbCli,
};