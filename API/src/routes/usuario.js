'use strict'

var express = require('express');
var UsuarioController = require("../controller/usuario");

var apiR = express.Router();

apiR.route("/user/:id").get(UsuarioController.getUsuario).
put(UsuarioController.updateUsuario).delete(UsuarioController.deleteUsuario);

apiR.route("/user").get(UsuarioController.getUsuarios).post(UsuarioController.createUsuario);

apiR.post("/user/login", UsuarioController.loginUsuario);

apiR.put("user/msg/:id", UsuarioController.addMensaje);

apiR.put("user/fol/:id", UsuarioController.addSeguidor);

apiR.put("user/fll/:id", UsuarioController.addSeguidor);

module.exports = apiR;