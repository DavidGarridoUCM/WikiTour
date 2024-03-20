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

const deleteUsuario = async (req, res)=>{
       try{   
              const {id} = req.params;
              const usu = await Usuario.findByIdAndDelete(id);
              res.status(200);
       }
       catch (err){
              console.log(err.message);
       }   
}

const updateUsuario = async (req, res)=>{
       try{   
              const {id} = req.params;
              const usu = await Usuario.findByIdAndUpdate(id, req.body);
              res.status(200).json(usu);
       }
       catch (err){
              console.log(err.message);
       }
}

const getUsuario = async (req, res)=>{
       try{   
              const {id} = req.params;
              const usu = await Usuario.findById(id);
              res.status(200).json(usu);
       }
       catch (err){
              console.log(err.message);
       }
}

const getUsuarios = async (req, res)=>{
       try{   
              const usuarios = await Usuario.find();
              res.status(200).json(usuarios);
       }
       catch (err){
              console.log(err.message);
       }
}

module.exports = {createUsuario, deleteUsuario, updateUsuario, getUsuario, getUsuarios};