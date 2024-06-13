'use strict'

var express = require("express");
var bodyParser = require("body-parser");
const cors = require('cors');


var app =  express();

var rutas_usuario = require("./routes/usuario");
var rutas_publi = require("./routes/publicacion");

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(rutas_usuario);
app.use(rutas_publi);

module.exports = app;