'use strict'
const {Usuario, UsuRed, Conver, Noti} = require('../models/usuario');
var bcrypt = require('bcrypt-nodejs');
const jwt = require('../../services/jwt');
const { default: mongoose } = require('mongoose');
 
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
              const usu = await Usuario.findOne({'_id': id}, {'_id': 1, 'nombre': 1,
              'apellidos': 1, 'nick': 1, 'fotoPerfil': 1, 'numSeguidores' : 1, 'numSeguidos' : 1, 'publicaciones' : 1});
              res.status(200).json(usu);
       }
       catch (err) {
              console.log(err.message);
       }
}

async function getUsuarios(req, res) {
       try {
              var usuarios;
              if(res.tipo = 'seguidos'){
                     const { id } = req.params;
                     usuarios = await Usuario.find({'_id': id}, {'seguidos': 1, '_id': 0});
              }
              else if(res.tipo == "seguidores"){
                     const { id } = req.params;
                     usuarios = await Usuario.find({'_id': id}, {'seguidores': 1, '_id': 0});
              }
              else if(res.tipo == "bloqueados"){
                     const { id } = req.params;
                     usuarios = await Usuario.find({'_id': id}, {'bloqueados': 1, '_id': 0});
              }
              else {
                     usuarios = await Usuario.find();
                     res.status(200).json(usuarios); 
              }
              
       }
       catch (err) {
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
                                   return res.status(200).send({message: "Not Match"});
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
                            nombre: usu.nombre,
                            apellidos: usu.apellidos,
                            nick: usu.nick
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


async function addSeguidor(req, res) {
       try {  
              var idSeguidor  = req.body.idSeguidor;
              var idSeguido = req.body.idSeguido;
              await Usuario.findOneAndUpdate({'_id': idSeguido}, {$push : {'seguidores' : idSeguidor}, $inc: {'numSeguidores': 1}}, {returnNewDocument: true}).exec();
              res.status(200).send({message: "Seguidor añadido"});
       }
       catch (err) {
              console.log(err.message);
       }
}

async function deleteSeguidor(req, res) {
       try {  
              var idSeguidor  = req.body.idSeguidor;
              var idSeguido = req.body.idSeguido;
              await Usuario.findOneAndUpdate({'_id': idSeguido}, {$pull : {'seguidos._id' : idSeguidor}, $inc: {'numSeguidores': -1}}, {upsert: true}).exec();
              res.status(200).send({message: "Seguidor eliminado"});
       }
       catch (err) {
              //Poner error
              res.status(200).send({message: "Added"});
       }
}

async function addSeguido(req, res) {
       try {  
              try {  
                     var idSeguidor  = req.body.idSeguidor;
                     var idSeguido = req.body.idSeguido;
                     var idSeg = mongoose.Types.ObjectId(idSeguido);
                     await Usuario.findOneAndUpdate({'_id': idSeguidor}, {$push : {'seguido' : idSeg}, $inc: {'numSeguidos': 1}}, {upsert: true}).exec();
                     res.status(200).send({message: "Seguido añadido"});
              }
              catch (err) {
                     console.log(err.message);
              }
              
       }
       catch (err) {
              console.log(err.message);
       }
}

async function deleteSeguido(req, res) {
       try {  
              var idSeguidor  = req.body.idSeguidor;
                     var idSeguido = req.body.idSeguido;
                     await Usuario.findOneAndUpdate({'_id': idSeguidor}, {$pull : {'seguido' : idSeguido}, $inc: {'numSeguidos': -1}}, {upsert: true}).exec();
                     res.status(200).send({message: "Seguido eliminado"});
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

module.exports = {createUsuario, deleteUsuario, updateUsuario, getUsuario, getUsuarios, 
       loginUsuario, addMensaje, addSeguidor, addSeguido, addNoti, 
        deleteSeguido, deleteSeguidor};