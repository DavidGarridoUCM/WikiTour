'use strict'
const {Usuario, UsuRed, Conver, Noti} = require('../models/usuario');
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

async function getUsuarios(req, res, tipo) {
       try {
              var usuarios;
              if(tipo = 'seguidos'){
                     const { id } = req.params;
                     usuarios = await Usuario.find({'_id': id}, {'seguidos': 1, '_id': 0});
              }
              else if(tipo == "seguidores"){
                     const { id } = req.params;
                     usuarios = await Usuario.find({'_id': id}, {'seguidores': 1, '_id': 0});
              }
              else if(tipo == "bloqueados"){
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
              var email = req.body.email;
              const usu = await Usuario.findOne({'nick': nick, 'email': email});
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
              var nick  = req.body.nick;
              const { id } = req.params;
              const usu = await Usuario.findOne({'nick': nick});
              if (usu) {
                     var usuRed = new UsuRed({
                            nombre: usu.nombre,
                            apellidos: usu.apellidos,
                            nick: usu.nick
                     });
                     await Usuario.findOneAndUpdate({'_id': id}, {$push : {'seguidores' : usuRed}}, {upsert: true}).exec();
                     res.status(200).send({message: "Seguidor añadido"});
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

async function deleteSeguidor(req, res) {
       try {  
              var idFoll  = req.body.idFoll;
              const { id } = req.params;
              await Usuario.findOneAndUpdate({'_id': id}, {$pull : {'seguidos._id' : idFoll}}, {upsert: true}).exec();
              res.status(200).send({message: "Seguidor eliminado"});
       }
       catch (err) {
              //Poner error
              res.status(200).send({message: "Added"});
       }
}

async function addSeguido(req, res) {
       try {  
              var nick  = req.body.nick;
              const { id } = req.params;
              const usu = await Usuario.findOne({'nick': nick});
              if (usu) {
                     var usuRed = new UsuRed({
                            nombre: usu.nombre,
                            apellidos: usu.apellidos,
                            nick: usu.nick
                     });
                     await Usuario.findOneAndUpdate({'_id': id}, {$push : {'seguidos' : usuRed}}, {upsert: true}).exec();
                     res.status(200).send({message: "Seguido añadido"});
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

async function deleteSeguido(req, res) {
       try {  
              var idSeg  = req.body.idSeg;
              const { id } = req.params;
              await Usuario.findOneAndUpdate({'_id': id}, {$pull : {'seguidos._id' : idSeg}}, {upsert: true}).exec();
              res.status(200).send({message: "Seguido eliminado"});
       }
       catch (err) {
              //Poner error
              res.status(200).send({message: "Added"});
       }
}

async function addBloqueado(req, res) {
       try {  
              var nick  = req.body.nick;
              const { id } = req.params;
              const usu = await Usuario.findOne({'nick': nick});
              if (usu) {
                     var usuRed = new UsuRed({
                            nombre: usu.nombre,
                            apellidos: usu.apellidos,
                            nick: usu.nick
                     });
                     await Usuario.findOneAndUpdate({'_id': id}, {$push : {'bloqueados' : usuRed}}, {upsert: true}).exec();
                     res.status(200).send({message: "Bloqueado añadido"});
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

async function deleteBloqueado(req, res) {
       try {  
              var idBloq  = req.body.idBloq;
              const { id } = req.params;
              await Usuario.findOneAndUpdate({'_id': id}, {$pull : {'bloqueados._id' : idBloq}}, {upsert: true}).exec();
              res.status(200).send({message: "Seguidor añadido"});
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
       loginUsuario, addMensaje, addSeguidor, addSeguido, addBloqueado, addNoti, 
       deleteBloqueado, deleteSeguido, deleteSeguidor};