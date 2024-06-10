'use strict'

var express = require('express');
var PublicacionController = require("../controller/publicacion");

var apiR = express.Router();

apiR.route("/publi/:id").get(PublicacionController.getPubli).
put(PublicacionController.updatePubli).delete(PublicacionController.deletePubli);

apiR.route("/publi").get(PublicacionController.getPublis).post(PublicacionController.createPubli);

apiR.post("/publi/:id", PublicacionController.aceptCambio);

module.exports = apiR;