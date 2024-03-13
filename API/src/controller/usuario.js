'use strict'

var Usuario = require('../models/usuario');
 
const createUsuario = async (req, res)=>{
       const usu = await Usuario.create(req.body);
       res.status(200).json(usu)
}

module.exports = {createUsuario};