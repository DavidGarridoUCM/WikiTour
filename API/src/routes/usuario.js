'use strict'

var express = require('express');
var UsuarioController = require("../controller/usuario");

var apiR = express.Router();

apiR.route("/user/:id").get(UsuarioController.getUsuario).delete(UsuarioController.deleteUsuario);

apiR.route("/users/:n").get(UsuarioController.getUsuarios);

apiR.route('/userConv/:id/:idConv').get(UsuarioController.getConversacion);

apiR.route("/user/upd/:id").post(UsuarioController.updateUsuario);

apiR.route("/user").post(UsuarioController.createUsuario);

apiR.post("/user/login", UsuarioController.loginUsuario);

apiR.put("/user/msg/:id", UsuarioController.addMensaje);

apiR.post("/user/foll", UsuarioController.follow);

apiR.post("/user/unfoll", UsuarioController.unfollow);

apiR.post("/user/folled", UsuarioController.isFollowed);

module.exports = apiR;