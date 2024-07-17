'use strict'

const {Publicacion, UsuPRed} = require('../models/publicacion');
const {Usuario} = require('../models/usuario');

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
}

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


async function createPubli(req, res) {
    try { 
           const publi = await Publicacion.create(req.body);
           //console.log(req.body);
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

async function getPublis(req, res) {
    try {
           const publis = await Publicacion.find({}, {'_id': 1, 'titulo': 1, 'pais': 1, 'continente': 1, 'ciudad': 1});
           res.status(200).json(publis);
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
    addLike,
    deleteLike,
    addComment,
    deleteComment,
    addCambio,
    aceptCambio
}