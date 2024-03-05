'use strict'

var express = require('express');
var UsuarioController = require("../controller/usuario");

var apiR = express.Router();

apiR.get('/prueba', UsuarioController.prueba);

module.exports = apiR;