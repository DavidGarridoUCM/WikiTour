'use strict'

var express = require('express');
var PublicacionController = require("../controller/publicacion");

var apiR = express.Router();

apiR.route("/:id").get(PublicacionController.getPubli).
put(PublicacionController.updatePubli).delete(PublicacionController.deletePubli);

apiR.route("/").get(PublicacionController.getPublis).post(PublicacionController.createPubli);

module.exports = apiR;