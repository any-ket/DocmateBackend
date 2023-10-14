const express = require("express");
const CreateAPI = require("../apiBuilder");
const path  = require("path");

const Bl = require("../../bl/auth");

const Router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
  cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
  cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
  })
const upload = multer({storage})

const APIS = [
  {
    endpoint: "/signup",
    method: "post",
    blFunction: Bl.Signup,
    middleware: upload.any("file")
  },
  {
    endpoint: "/logout",
    method: "post",
    blFunction: Bl.Logout
  },
  {
    endpoint: "/login",
    method: "post",
    blFunction: Bl.Login
  },
  {
    endpoint: "/isloggedin",
    method: "get",
    blFunction: Bl.IsLoggedIn
  }
];


CreateAPI(Router, APIS);

module.exports = Router;