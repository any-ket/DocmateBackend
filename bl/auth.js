const { dbCli } = require("../dal/dbClient");
var bcrypt = require('bcrypt');
const { StatusCodes } = require('http-status-codes');

function Signup(reqData){
  return new Promise(async (resolve, reject) => {
    try{
      var { name, email, mob, password, age } = reqData.body;
    }catch(e){
      logger.error("Invalid ReqBody", e);
      return reject({statusCode: StatusCodes.BAD_REQUEST, responseData: "Invalid Request"});
    }
    const dp = reqData.files[0].filename;

    const hash = await bcrypt.hash(password, 10);
    const values = {name, email, mob: Number(mob), hash, dp, age: Number(age)};
    const resp = await dbCli.insert("users", values);
    resolve({statusCode: StatusCodes.OK, responseData: "Signed In successfully"});
  });
}


function Login(reqData){
  return new Promise(async (resolve, reject) => {
    try{
      var {email, password} = reqData.body;
    }catch(e){
      logger.error("Invalid ReqBody", e);
      return resolve({statusCode: StatusCodes.BAD_REQUEST, responseData: "Invalid Request"});
    }

    const result = await dbCli.findOne("users", {email: email}, {projection: {hash: 1, _id: 1, name: 1, email: 1, dp: 1, age: 1}});

    try{
      var isPassCorrect = bcrypt.compareSync(password, result.hash);
    }catch(e){
      console.log("Mongo error", e);
    }

    if(!isPassCorrect)
      return resolve({statusCode: StatusCodes.UNAUTHORIZED, responseData: "Authentication Failed!"});
    delete result.hash;
    reqData.session._id = result._id;
    reqData.session.name = result.name;
    reqData.session.age = result.age;
    // reqData.session.mobile = re;
    reqData.session.email = result.email;
    reqData.session.dp = result.dp;
    reqData.session.save();

    return resolve({statusCode: StatusCodes.OK, responseData: result});
  });
}

function IsLoggedIn(reqData){
  return new Promise((resolve) => {
    if(reqData.session._id)
      return resolve({statusCode: StatusCodes.OK, responseData: {_id: reqData.session._id, name: reqData.session.name, email: reqData.session.email, isLoggedIn: true, dp: reqData.session.dp, age: reqData.session.age}});
    return resolve({statusCode: StatusCodes.OK, responseData: {isLoggedIn: false}});
  });
}

function Logout(reqData){
  return new Promise((resolve) => {
    reqData.session.destroy();
    return resolve({statusCode: StatusCodes.OK, responseData: {isLoggedIn: false}});
  });
}

module.exports = {
  Signup,
  Login,
  IsLoggedIn,
  Logout
};
