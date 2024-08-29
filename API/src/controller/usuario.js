'use strict'
const {Usuario, UsuRed, Conver, Noti} = require('../models/usuario');
const {Publicacion} = require('../models/publicacion');
var bcrypt = require('bcrypt-nodejs');
const jwt = require('../../services/jwt');
const { default: mongoose } = require('mongoose');
const fs = require('fs');
const path = require('path');
 
async function createUsuario(req, res) {
       try {  
              if(await Usuario.findOne({'email': req.body.email})){
                     return res.status(500).send({message: "Ya existe una cuenta con ese mail"});
              }
              if(await Usuario.findOne({'nick': req.body.nick})){
                     return res.status(500).send({message: "Ya existe ese nombre de usuario"});
              }
              const usu = await Usuario.create(req.body);           
              return res.status(200).send({
                     token : jwt.createToken(usu)
              })
       }
       catch (err) {
                     return res.status(500).send(err.message);
       }
       
}

async function deleteUsuario(req, res) {
       try {
              const { id } = req.params;
              const usu = await Usuario.findByIdAndDelete(id);
              res.status(200).send(usu);
       }
       catch (err) {
              console.log(err.message);
       }
}

async function updateUsuario(req, res) {
       try {  
              const { id } = req.params;
              const usu = await Usuario.findOne({'_id': id}, {'_id': 1, 'password' : 1});
              if(usu){
                     bcrypt.compare(req.body.password, usu.password, async function(err, ok){
                            if(err){
                                   return res.status(500).send({message: "Not Match"});
                            }
                            if(ok){
                                   if(req.body.newPassword != ''){
                                          req.body.password = req.body.newPassword;
                                   }
                                   const us = await Usuario.findByIdAndUpdate(usu._id, req.body);
                                   const user = await Usuario.findOne({'_id': usu._id}, {'nick': 1, 'nombre': 1, 'apellidos': 1, 'fotoPerfil': 1});
                                   Publicacion.updateMany({'usuario.idUsu' : usu._id}, {'usuario.nick': user.nick, 'usuario.nombre': user.nombre, 
                                          'usuario.apellidos': user.apellidos, 'usuario.fotoPerfil': user.fotoPerfil}).exec();
                                   return res.status(200).send(us);
                            }
                            else{
                                   return res.status(500).send({message: "Not Match"});
                            }
                     })
              }
       }
       catch (err) {
              console.log(err.message);
       }
}

async function getUsuario(req, res) {
       try {
              const { id } = req.params;
              const usu = await Usuario.findOne({'_id': id}, {'_id': 1, 'nombre': 1,
              'apellidos': 1, 'nick': 1, 'fotoPerfil': 1, 'numSeguidores' : 1, 'numSeguidos' : 1, 'publicaciones' : 1, 'email': 1});
              res.status(200).json(usu);
       }
       catch (err) {
              console.log(err.message);
       }
}

async function getUsuarios(req, res) {
       try {
              var usuarios;
              const { n } = req.params;
              usuarios = await Usuario.find({nick : new RegExp(n, 'i')}, {'_id': 1, 'nick': 1, 'nombre':1, 'apellidos':1, 'fotoPerfil': 1});
              res.status(200).json(usuarios); 
              
       }
       catch (err) {
              console.log(err.message);
       }
}

async function getSeguidos(req, res) {
       try{   
              var usuarios;
              const { id } = req.params;
              usuarios = await Usuario.findOne({'_id': id}, {'seguidos': 1, '_id': 0});
              console.log(usuarios);
              res.status(200).json(usuarios);
       }
       catch(err) {
              console.log(err.message);
       }
       
}

async function getSeguidores(req, res) {
       try{   
              var usuarios;
              const { id } = req.params;
              usuarios = await Usuario.findOne({'_id': id}, {'seguidores': 1, '_id': 0});
              res.status(200).json(usuarios);
       }
       catch(err) {
              console.log(err.message);
       }
       
}

async function loginUsuario(req, res) {
       try {  
              var nick  = req.body.nick;
              
              const usu = await Usuario.findOne({'nick': nick}, {'_id': 1, 'nombre': 1, 'email':1,
                     'apellidos': 1, 'password' : 1, 'nick': 1, 'fotoPerfil': 1, 
                     'rol': 1});
              if(usu){
                     bcrypt.compare(req.body.password, usu.password, function(err, ok){
                            if(err){
                                   console.log(err.message);
                            }
                            if(ok){
                                   if(req.body.gettoken){
                                          return res.status(200).send({
                                                 token : jwt.createToken(usu)
                                          })
                                   }
                                   else{
                                         usu.password = undefined;
                                         return res.status(200).send(usu);    
                                   }
                                   
                            }
                            else{
                                   return res.status(200).send({message: "Contraseña Incorrecta"});
                            }
                     })
              }
              else{
                     return res.status(200).send({message: "No existe el usuario"});
              }
       }
       catch (err) {
              console.log(err.message);
       }
}

async function addMensaje(req, res) {
       try {  
              var nick  = req.body.nick;
              //El mensaje tiene que tener el formato que esta en el modelo y indicar si lo envias tu o lo recibes
              var mensaje = req.body.mensaje;
              const { id } = req.params;
              const mens = await Usuario.findOne({'_id': id, 'conversaciones.usuarioEmisor.nick': nick}, {'conversaciones.$': 1});
              if (mens) {
                     await Usuario.findOneAndUpdate({'_id': id, 'conversaciones.usuarioEmisor.nick': nick}, {$push : {'conversaciones.$.mensajes' : mensaje}}, {upsert: true}).exec();
                     res.status(200).send({message: "Updated"});
              }
              else{  
                     const usu = await Usuario.findOne({'nick': nick}).exec();
                     var usuRed = new UsuRed({
                            idUsu: usu._id,
                            nombre: usu.nombre,
                            apellidos: usu.apellidos,
                            nick: usu.nick,
                            fotoPerfil: usu.fotoPerfil
                     });
                     var conv = new Conver({
                            usuarioEmisor: usuRed,
                            mensajes: mensaje
                     })
                     Usuario.findOneAndUpdate({'_id': id}, {$push: {'conversaciones': conv}}, {upsert: true}).exec();
                     res.status(200).send({message: "Added"});
              }
              
       }
       catch (err) {
              console.log(err.message);
       }
}

async function isFollowed(req, res){
       try {  
              var idSeguidor  = req.body.idSeguidor;
              var idSeguido = req.body.idSeguido;
              const usu = await Usuario.findOne({'_id': idSeguido, 'seguidores._id': idSeguidor}).exec();
              res.status(200).send(usu);
              
       }
       catch (err) {
              console.log(err.message);
       }
}



async function follow(req, res) {
       try {  
              var idSeguidor  = req.body.idSeguidor;
              var idSeguido = req.body.idSeguido;
              var seguidor = await Usuario.findOne({'_id': idSeguidor}, {'_id': 1, 'nombre': 1,
                     'apellidos': 1, 'nick': 1, 'fotoPerfil': 1});
              var seguido = await Usuario.findOne({'_id': idSeguido}, {'_id': 1, 'nombre': 1,
                     'apellidos': 1, 'nick': 1, 'fotoPerfil': 1});
              await Usuario.findOneAndUpdate({'_id': idSeguido}, {$addToSet : {'seguidores' : seguidor}, $inc: {'numSeguidores': 1}}).exec();
              await Usuario.findOneAndUpdate({'_id': idSeguidor}, {$addToSet : {'seguidos' : seguido}, $inc: {'numSeguidos': 1}}).exec();
              res.status(200).send({message: "Follow hecho"});
       }
       catch (err) {
              console.log(err.message);
       }
}

async function unfollow(req, res) {
       try {  
              var idSeguidor  = req.body.idSeguidor;
              var idSeguido = req.body.idSeguido;
              await Usuario.findOneAndUpdate({'_id': idSeguido}, {$pull : {'seguidores' : {'_id' : idSeguidor} }, $inc: {'numSeguidores': -1}}).exec();
              await Usuario.findOneAndUpdate({'_id': idSeguidor}, {$pull : {'seguidos' : {'_id': idSeguido}}, $inc: {'numSeguidos': -1}}).exec();
              res.status(200).send({message: "Unfollow"});
       }
       catch (err) {
              //Poner error
              res.status(200).send({message: "Added"});
       }
}


async function addNoti(req, res) {
       try {  
              var nick  = req.body.nick;
              var typ = req.body.tipo;
              const { id } = req.params;
              const usu = await Usuario.findOne({'nick': nick});
              if (usu) {
                     var usuRed = new UsuRed({
                            nombre: usu.nombre,
                            apellidos: usu.apellidos,
                            nick: usu.nick
                     });
                     var noti = new Noti({
                            tipo: typ,
                            usuario: usuRed,
                            estado: "Sin leer"
                     })
                     await Usuario.findOneAndUpdate({'_id': id}, {$push : {'notificaciones' : noti}}, {upsert: true}).exec();
                     var num = await Usuario.find({'_id': id}, {'notificaciones': 1}).count();
                     if (num > 20){
                            Usuario.findOneAndUpdate({'_id': id}, {$pop : {'notificaciones' : 1}}).exec();
                     }
                     res.status(200).send({message: "Notificacion añadida"});
              }
              else{
                     //Poner error
                     res.status(200).send({message: "Added"});
              }
              
       }
       catch (err) {
              console.log(err.message);
       }
}


async function getConversacion(req, res) {
       try {  
           const {id} = req.params;
           console.log(id);
           const {idConv} = req.params;
           console.log(idConv);
           const conv = await Usuario.findOne({'_id': id, 'conversaciones._id': idConv}, {'conversaciones.mensajes.$': 1});
           console.log(conv);
           res.status(200).send(conv);
       }
       catch (err) {
              console.log(err.message);
       }
}

async function uploadFotoPerfil(req, res) {
       try {  
           if(req.files){
              console.log(req.files);
              const{id} = req.params;
              var file_path = req.files.image.path;
              var file_split = file_path.split('\\');
              var file_name = file_split[1];
              var ext_spl = file_name.split('\.');
              var ext = ext_spl[1];
              if(ext == 'jpeg' || ext == 'jpg' || ext == 'png'){
                     //meter en fotoperfil usuario
                     const usu = await Usuario.findOneAndUpdate({'_id': id}, {'fotoPerfil': file_name});
                     return res.status(200).send(usu)
              }
              else{
                     //quitar de carpeta upload
                     fs.unlink(file_path, (err) => {
                            return res.status(500).send({message: 'Extension no valida'})
                     });
              }
           }
           else{
              return res.status(500).send({message: 'No existen imagenes'});
           }
       }
       catch (err) {
              console.log(err.message);
       }
}

async function getFotoPerfil(req, res) {
       try {  
           var nombre_imagen =  req.params.fotoPerfil;
           var path_file = './upload/' + nombre_imagen;

           fs.stat(path_file, fs.constants.R_OK, (err) => {
              if (err){
                     return res.status(500).send({message: 'No existe la imagen'});
              }
              else{
                     return res.sendFile(path.resolve(path_file));
              }
              })
       }
       catch (err) {
              console.log(err.message);
       }
}




module.exports = {createUsuario, deleteUsuario, updateUsuario, getUsuario, getUsuarios, 
       loginUsuario, addMensaje, follow, addNoti, unfollow, isFollowed, getConversacion, getSeguidos, getSeguidores, uploadFotoPerfil, getFotoPerfil};