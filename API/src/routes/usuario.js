'use strict'

var express = require('express');
var UsuarioController = require("../controller/usuario");

var apiR = express.Router();

apiR.post('/', UsuarioController.createUsuario);

module.exports = apiR;