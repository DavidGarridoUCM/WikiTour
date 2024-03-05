'use strict'

var express = require("express");
var bodyParser = require("body-parser");

var app =  express();

var rutas_usuario = require("./routes/usuario");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(rutas_usuario);


module.exports = app;