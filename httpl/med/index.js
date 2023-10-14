const express = require("express");
const CreateAPI = require("../apiBuilder");

const Bl = require("../../bl/med");

const Router = express.Router();

const APIS = [
  {
    endpoint: "/medicines",
    method: "get",
    blFunction: Bl.GetMedicines
  },
  {
    endpoint:"/medicines",
    method:"post",
    blFunction: Bl.PostMedicines
  },
  {
    endpoint:"/medicines",
    method:"delete",
    blFunction: Bl.DeleteMedicine
  },
];

CreateAPI(Router, APIS);


module.exports = Router;


