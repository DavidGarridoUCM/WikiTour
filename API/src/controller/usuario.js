'use strict'

var Usuario = require('../models/usuario');
 
const createUsuario = async (req, res)=>{
       try{
              const usu = await Usuario.create(req.body);
              res.status(200).json(usu);
       }
       catch (err){
              console.log(err.message);
       }     
}

/*const deleteUsuario = async (req, res)=>{
       res.status(200).json(usu)
}

const updateUsuario = async (req, res)=>{
       res.status(200).json(usu)
}

const getUsuario = async (req, res)=>{
       res.status(200).json(usu)
}

const getUsuarios = async (req, res)=>{
       res.status(200).json(usu)
}*/

module.exports = {createUsuario};