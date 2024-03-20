'use strict'

var express = require('express');
var UsuarioController = require("../controller/usuario");

var apiR = express.Router();

apiR.route("/:id").get(UsuarioController.getUsuario).
put(UsuarioController.updateUsuario).delete(UsuarioController.deleteUsuario);

apiR.route("/").get(UsuarioController.getUsuarios).post(UsuarioController.createUsuario);

module.exports = apiR;