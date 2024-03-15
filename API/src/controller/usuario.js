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
              res.status(200).json(usu);
       }catch(err){

       }
       
}

const updateUsuario = async (req, res)=>{
      try{
              res.status(200).json(usu);
       }catch(err){
              
       }
}

const getUsuario = async (req, res)=>{
       try{
              res.status(200).json(usu);
       }catch(err){
              
       }
}

const getUsuarios = async (req, res)=>{
       try{
              res.status(200).json(usu);
       }catch(err){
               
       }
}

module.exports = {createUsuario, deleteUsuario, updateUsuario, getUsuario, getUsuarios};