'use strict'

var express = require('express');
var UsuarioController = require("../controller/usuario");

var apiR = express.Router();

apiR.route("/user/:id").get(UsuarioController.getUsuario).
put(UsuarioController.updateUsuario).delete(UsuarioController.deleteUsuario);

apiR.route("/user").get(UsuarioController.getUsuarios).post(UsuarioController.createUsuario);

apiR.post("/login", UsuarioController.loginUsuario);

apiR.put("/msg/:id", UsuarioController.addMensaje);

apiR.put("/fol/:id", UsuarioController.addSeguidor);

apiR.put("/fll/:id", UsuarioController.addSeguidor);

module.exports = apiR;