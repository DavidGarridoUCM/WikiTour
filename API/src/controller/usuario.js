'use strict'

var Usuario = require('../models/usuario');
var bcrypt = require('bcrypt-nodejs');
 
async function createUsuario(req, res) {
       try {  
              const usu = await Usuario.create(req.body);           
              res.status(200).json(usu);
       }
       catch (err) {
              if (err.keyValue.email != null && err.name === "MongoServerError" && err.code === 11000) {
                     res.status(500).send({message: "Ya existe una cuenta con ese mail"});
              } else if (err.keyValue.nick != null && err.name === "MongoServerError" && err.code === 11000) {
                     res.status(500).send({message: "Ya existe ese nombre de usuario"});
              } else {
                     res.status(500).send(err.message);
              }
       }
}

async function deleteUsuario(req, res) {
       try {
              const { id } = req.params;
              const usu = await Usuario.findByIdAndDelete(id);
              res.status(200);
       }
       catch (err) {
              console.log(err.message);
       }
}

async function updateUsuario(req, res) {
       try {
              const { id } = req.params;
              const usu = await Usuario.findByIdAndUpdate(id, req.body);
              res.status(200).json(usu);
       }
       catch (err) {
              console.log(err.message);
       }
}

async function getUsuario(req, res) {
       try {
              const { id } = req.params;
              const usu = await Usuario.findById(id);
              res.status(200).json(usu);
       }
       catch (err) {
              console.log(err.message);
       }
}

async function getUsuarios(req, res) {
       try {
              const usuarios = await Usuario.find();
              res.status(200).json(usuarios);
       }
       catch (err) {
              console.log(err.message);
       }
}

async function loginUsuario(req, res) {
       try {  
              var nick  = req.body.nick;
              var email = req.body.email;
              const usu = await Usuario.findOne({nick: nick, email: email});
              if(usu){
                     bcrypt.compare(req.body.password, usu.password, function(err, ok){
                            if(err){
                                   console.log(err.message);
                            }
                            if(ok){
                                   res.status(200).send({message: "Match"});
                            }
                            else{
                                   res.status(200).send({message: "Not Match"});
                            }
                     })
              }
       }
       catch (err) {
              console.log(err.message);
       }
}

async function addMensaje(req, res) {
       try {  
              var nick  = req.body.nick;
              var mensaje = req.body.mensaje;
              const { id } = req.params;
              //Si el usuario que envia el mensaje tiene ya una conversacion añadir mensaje, si no existia 
              //añadir conversacion y añadir el mensaje
              const mens = await Usuario.findOne({'_id': id, 'mensajes.usuarioEmisor.nick': nick}, {'mensajes.$': 1});
              if (mens) {
                     //const up =
                     await Usuario.findOneAndUpdate({'_id': id, 'mensajes.usuarioEmisor.nick': nick}, {$push : {'mensajes.$.mensajes' : mensaje}}, {upsert: true}).exec();
              }
              else{  
                     const usu = await Usuario.findOne({'nick': nick}).exec();
                     console.log(usu);
                    /* Usuario.findOneAndUpdate({'_id': id}, 
                     {$set : {'mensajes.usuarioEmisor.nombre' : usu.nombre}, 
                     $set : {'mensajes.usuarioEmisor.apellidos' : usu.apellidos}}, {upsert: true}).exec();*/
              }
              
       }
       catch (err) {
              console.log(err.message);
       }
}

module.exports = {createUsuario, deleteUsuario, updateUsuario, getUsuario, getUsuarios, loginUsuario, addMensaje};