'use strict'

var Usuario= require('../models/usuario');
 
function prueba(req, res){
    res.status(200).send({
        message: "Prueba, funciona correcto"
    });
   
}

module.exports = {prueba};