'use strict'

var Usuario = require('../modules/usuario');


function prueba(req, res){
    res.status(200).send({
        message: "Prueba, funciona correcto"
    });
}

module.exports = {prueba};