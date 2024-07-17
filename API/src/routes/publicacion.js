'use strict'

var express = require('express');
var PublicacionController = require("../controller/publicacion");

var apiR = express.Router();

apiR.route("/publi/:id").get(PublicacionController.getPubli).
put(PublicacionController.updatePubli).delete(PublicacionController.deletePubli);

apiR.route("/publi").post(PublicacionController.createPubli);

apiR.route("/publis").get(PublicacionController.getPublis);

apiR.route("/publi/upd/:id").post(PublicacionController.updatePubli);

apiR.route("/publi/comm/:id").post(PublicacionController.addComment);

apiR.route("/publi/like/:id").post(PublicacionController.addLike);

apiR.route("/publi/dislike/:id").post(PublicacionController.deleteLike);

module.exports = apiR;