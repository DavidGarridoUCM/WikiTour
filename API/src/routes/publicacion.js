'use strict'

var express = require('express');
var PublicacionController = require("../controller/publicacion");

var apiR = express.Router();

const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({
    uploadDir: './upload'
});

apiR.post('/publi-uploadImage/:id', multipartMiddleware, PublicacionController.uploadFotos);

apiR.get('/publi/fotoPortada/:foto', PublicacionController.getFoto);

apiR.route("/publi/:id").get(PublicacionController.getPubli).
put(PublicacionController.updatePubli).delete(PublicacionController.deletePubli);

apiR.route("/publi").post(PublicacionController.createPubli);

apiR.route("/publis/:n").get(PublicacionController.getPublis);

apiR.route("/publisUser/:idUsu").get(PublicacionController.getPublisUser);

apiR.route("/publis").get(PublicacionController.getLastPublis);

apiR.route("/publi/upd/:id").post(PublicacionController.updatePubli);

apiR.route("/publi/comm/:id").post(PublicacionController.addComment);

apiR.route("/publi/like/:id").post(PublicacionController.addLike);

apiR.route("/publi/dislike/:id").post(PublicacionController.deleteLike);

module.exports = apiR;