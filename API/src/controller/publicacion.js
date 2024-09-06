'use strict'

const {Publicacion, UsuPRed} = require('../models/publicacion');
const {Usuario} = require('../models/usuario');

const fs = require('fs');
const path = require('path');

/*
//Añadir propuesta cambio de etapa
async function addCambio(req, res) {
       try {  
              const {id} = req.params;
              var etapaId = req.body.etapaId;
              var cambio = req.body.cambio;
              const publi = await Publicacion.updateOne({'_id': id, 'etapas': etapaId}, {$push : {'etapas.$.propuestos': cambio}});
              res.status(200).json(publi.likes);
       }
       catch (err) {
              console.log(err.message);
       }
}
//Aceptar cambio de etapa
async function aceptCambio(req, res) {
       try {  
              const {id} = req.params;
              var idP = req.body.idP;
              var etapaId = req.body.etapaId;
              //Datos del cambio propuesto
              const cambio = await Publicacion.findOne({'etapas.propuestos._id': idP},{'etapas.propuestos.$': 1, 'propuestos.usuario._id': 1 , '_id': 0});
              //Sacar IDusuario
              const usuId = await Publicacion.findOne({'etapas.propuestos.$': idP}, {'etapas.propuestos.usuario._id': 1, '_id': 0});
              //Sacar Usuario
              const usu = await Usuario.findOne({'_id': usuId});
              var usuRed = new UsuPRed({
                     nombre: usu.nombre,
                     apellidos: usu.apellidos,
                     nick: usu.nick,
                     puntuacion: usu.puntuacion
              });
              //Eliminar propuesto
              await Publicacion.updateOne({'etapas.propuestos._id': idP}, {$pull : {'etapas.$.propuestos': {'_id': idP}}}).exec();
              //Añadir aceptado
              const publi = await Publicacion.updateOne({'etapas._id': etapaId}, 
              {$push: {'etapas.$.aceptados':  { 
                     "texto" : cambio.texto,
                     "usuario" : usuRed,
                     "tipo": cambio.tipo
                 }}});
                

              res.status(200).json(usuRed);
       }
       catch (err) {
              console.log(err.message);
       }
}*/

//Eliminar comentario
async function deleteComment(req, res) {
       try {  
              const {id} = req.params;
              var commentId = req.body.commentId;
              const publi = await Publicacion.updateOne({'_id': id}, {$pull : {'comentarios._id': commentId}});
              res.status(200).json(publi.likes);
       }
       catch (err) {
              console.log(err.message);
       }
}
//Añadir comentario
async function addComment(req, res) {
       try {  
              const {id} = req.params;
              var comment = req.body;
              const publi = await Publicacion.updateOne({'_id': id}, {$push : {'comentarios': comment}});
              res.status(200).json(publi);
       }
       catch (err) {
              console.log(err.message);
       }
}
//Quitar like
async function deleteLike(req, res) {
       try {  
              const {id} = req.params;
              const userId = req.body.userId;
              const publi = await Publicacion.updateOne({'_id': id}, {$inc : {'numlikes': -1}, $pull: {'likes': userId}});
              res.status(200).json(publi.likes);
       }
       catch (err) {
              console.log(err.message);
       }
}
//Sumar like
async function addLike(req, res) {
       try {  
              const {id} = req.params;
              const userId = req.body.userId;
              const publi = await Publicacion.updateOne({'_id': id}, {$inc : {'numlikes': 1}, $push: {'likes': userId}});
              res.status(200).json(publi.likes);
       }
       catch (err) {
              console.log(err.message);
       }
}

async function updatePerfilPublis(req, res) {
       try {  
              const {id} = req.params;
              const pub = await Publicacion.updateMany({'usuario.idUsu' : id}, {'usuario.nick': user.nick, 'usuario.nombre': user.nombre, 
                                          'usuario.apellidos': user.apellidos, 'usuario.fotoPerfil': user.fotoPerfil});
              res.status(200).json(pub);
       }
       catch (err) {
              console.log(err.message);
       }
}


async function createPubli(req, res) {
    try { 
           const publi = await Publicacion.create(req.body);
           Usuario.updateOne({'_id': publi.usuario.idUsu}, {$inc : {'publicaciones': 1}}).exec();
           res.status(200).send(publi);
    }
    catch (err) {
           res.status(500).send(err.message);
           console.log(err.message);
    }
}

async function deletePubli(req, res) {
    try {
           const { id } = req.params;
           const publi = await Publicacion.findByIdAndDelete(id);
           res.status(200);
    }
    catch (err) {
           console.log(err.message);
    }
}

async function updatePubli(req, res) {
    try {
           const { id } = req.params;
           const publi = await Publicacion.updateOne({'_id': id}, {'etapas': req.body});
           res.status(200).json(publi);
    }
    catch (err) {
           console.log(err.message);
    }
}

async function getPubli(req, res) {
    try {
           const { id } = req.params;
           const publi = await Publicacion.findById(id);
           res.status(200).json(publi);
    }
    catch (err) {
           console.log(err.message);
    }
}

async function getLastPublis(req,res) {
       
       try {
              const publis = await Publicacion.find({},{'_id': 1, 'titulo': 1, 'pais': 1, 'continente': 1, 'ciudad': 1, 'usuario': 1, 'foto': 1}).sort({'fecha': -1}).limit(50);
              res.status(200).json(publis);
       }
       catch (err) {
              console.log(err.message);
       }
}

async function getPublis(req, res) {
    try {
           const {n} = req.params;
           const publis = await Publicacion.find({$or : [{'titulo': new RegExp(n, 'i')}, {'pais': new RegExp(n, 'i')}, 
              {'continente': new RegExp(n, 'i')}, {'ciudad': new RegExp(n, 'i')}]}, 
              {'_id': 1, 'titulo': 1, 'pais': 1, 'continente': 1, 'ciudad': 1, 'usuario': 1, 'foto': 1}).sort({'fecha': -1});
           res.status(200).json(publis);
    }
    catch (err) {
           console.log(err.message);
    }
}

async function getPublisFollows(req, res) {
       try {
              const {id} = req.params;
              var resul = await Usuario.findOne({'_id': id});
              var seguidos = [];
              resul.seguidos.forEach((seg) => 
              {
                    seguidos.push(seg._id);
              });
              const publis = await Publicacion.find({'usuario.idUsu' : {$in: seguidos}}, 
                 {'_id': 1, 'titulo': 1, 'pais': 1, 'continente': 1, 'ciudad': 1, 'usuario': 1, 'foto': 1}).sort({'fecha': -1}).limit(200);
              res.status(200).json(publis);
       }
       catch (err) {
              console.log(err.message);
       }
   }


async function getPublisUser(req, res) {
       try {
              const {idUsu} = req.params;
              const publis = await Publicacion.find({'usuario.idUsu': idUsu}, 
                 {'_id': 1, 'titulo': 1, 'pais': 1, 'continente': 1, 'ciudad': 1, 'foto': 1}).sort({'fecha': -1});
              res.status(200).json(publis);
       }
       catch (err) {
              console.log(err.message);
       }
}

async function uploadFotos(req, res) {
       try {  
           if(req.files){
              const{id} = req.params;
              var file_path =  req.files.image.path;
              var file_split = file_path.split('\\');
              var file_name = file_split[1];
              var ext_spl = file_name.split('\.');
              var ext = ext_spl[1];
              if(ext == 'jpeg' || ext == 'jpg' || ext == 'png'){
                     
                     const usu = await Publicacion.findOneAndUpdate({'_id': id}, {'foto': file_name});
                     return res.status(200).send(usu);
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

async function getFoto(req, res) {
       try {  
           var nombre_imagen =  req.params.foto;
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

module.exports = {
    createPubli,
    deletePubli,
    updatePubli,
    getPubli,
    getPublis,
    getLastPublis,
    addLike,
    deleteLike,
    addComment,
    deleteComment,
    /*addCambio,
    aceptCambio,*/
    getPublisUser, 
    uploadFotos,
    getFoto,
    getPublisFollows,
    updatePerfilPublis
}