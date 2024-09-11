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
                                   const pub = await Publicacion.updateMany({'usuario.idUsu' : usu._id}, {'usuario.nick': user.nick, 'usuario.nombre': user.nombre, 
                                          'usuario.apellidos': user.apellidos, 'usuario.fotoPerfil': user.fotoPerfil});
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
              res.status(200).send({message: "Added"});
       }
}

async function uploadFotoPerfil(req, res) {
       try {  
           if(req.files){
              const{id} = req.params;
              var file_path = req.files.image.path;
              var file_split = file_path.split('\\');
              var file_name = file_split[1];
              var ext_spl = file_name.split('\.');
              var ext = ext_spl[1];
              if(ext == 'jpeg' || ext == 'jpg' || ext == 'png'){
                     //meter en fotoperfil usuario
                     const usu = await Usuario.findOneAndUpdate({'_id': id}, {$set : {'fotoPerfil': file_name}});
                     await Publicacion.updateMany({'usuario.idUsu' : usu._id}, {$set : {'usuario.fotoPerfil': file_name}}).exec();
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

async function deleteFotoPerfil(req, res) {
       try {  
           const {id} =  req.params;
           const usu = await Usuario.findOne({'_id': id}, {'fotoPerfil': 1});
           
           var path_file = './upload/' + usu.fotoPerfil;

           fs.unlink(path_file, () => {
              Usuario.findOneAndUpdate({'_id': id}, {$set: {'fotoPerfil': null}}).exec();
              Publicacion.updateMany({'usuario.idUsu' : usu._id}, { 'usuario.fotoPerfil': 'null'}).exec();
              return res.status(200).send({message: 'Borrado'});
              });
       }
       catch (err) {
              console.log(err.message);
       }
}




module.exports = {createUsuario, deleteUsuario, updateUsuario, getUsuario, getUsuarios, 
       loginUsuario, follow, unfollow, isFollowed, getSeguidos, getSeguidores, uploadFotoPerfil, getFotoPerfil, deleteFotoPerfil};