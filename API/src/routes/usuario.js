'use strict'

var express = require('express');
var UsuarioController = require("../controller/usuario");

var apiR = express.Router();

apiR.route("/user/:id").get(UsuarioController.getUsuario).
put(UsuarioController.updateUsuario).delete(UsuarioController.deleteUsuario);

apiR.route("/user/:id").get(UsuarioController.getUsuarios);

apiR.route("/user").post(UsuarioController.createUsuario);

apiR.post("/user/login", UsuarioController.loginUsuario);

apiR.put("/user/msg/:id", UsuarioController.addMensaje);

apiR.post("/user/foll", UsuarioController.addSeguidor);

apiR.post("/user/fll/:id", UsuarioController.addSeguido);

module.exports = apiR;