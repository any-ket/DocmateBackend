const { dbCli } = require("../dal/dbClient");
var bcrypt = require('bcrypt');
const { StatusCodes } = require('http-status-codes');

function Signup(reqData){
  return new Promise(async (resolve, reject) => {
    try{
      var { name, email, mob, password } = reqData.body;
    }catch(e){
      logger.error("Invalid ReqBody", e);
      return reject({statusCode: StatusCodes.BAD_REQUEST, responseData: "Invalid Request"});
    }


    const hash = await bcrypt.hash(password, 10);
    const values = [{name, email, mob, hash}];
    const resp = await dbCli.insert("users", values);
    resolve({statusCode: StatusCodes.OK, responseData: resp});
  });
}

function Login(reqData){
  return new Promise((resolve, reject) => {
    try{
      var {mob, password} = reqData.body;
    }catch(e){
      logger.error("Invalid ReqBody", e);
      return resolve({statusCode: StatusCodes.BAD_REQUEST, responseData: "Invalid Request"});
    }

    const result = dbCli.findOne("users", {mob: mob}, {projection: {hash: 1, _id: 1, name: 1, email: 1}});
    try{
      var isPassCorrect = bcrypt.compareSync(password, result[0].pwd);
    }catch(e){
      console.log("Mongo error", e);
    }

    if(!isPassCorrect)
      return resolve({statusCode: StatusCodes.UNAUTHORIZED, responseData: "Authentication Failed!"});
    delete result[0].pwd;
    console.log(result);
    reqData.session.idx = result[0].idx;
    reqData.session.name = result[0].name;
    reqData.session.mobile = mob;
    reqData.session.email = result[0].email;
    reqData.session.save();

    return resolve({statusCode: StatusCodes.OK, responseData: result[0]});
  });
}

function IsLoggedIn(reqData){
  return new Promise((resolve) => {
    if(reqData.session.idx)
      return resolve({statusCode: StatusCodes.OK, responseData: {idx: reqData.session.idx, mob: reqData.session.mob, name: reqData.session.name, email: reqData.session.email, isLoggedIn: true}});
    return resolve({statusCode: StatusCodes.OK, responseData: {isLoggedIn: false}});
  });
}

module.exports = {
  Signup,
  Login,
  IsLoggedIn
};
