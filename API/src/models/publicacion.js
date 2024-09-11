'use strict'

var mongoose = require('mongoose');

const userRedPSchema = mongoose.Schema({
    idUsu:{
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    nick: {
        type: String,
        unique: true,
        required: true
    },
    fotoPerfil: {
        type: String,
        default: null
    }
},
{
    autoCreate: false,
    autoIndex: false
});


const etapaSchema = mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    usuario:{
        type: String,
        required: true
    },
    idUsu:{
        type: String,
        required: true
    },
    texto: {
        type: String,
        required: true
    }
});

const comentSchema = mongoose.Schema({
    idUsu: {
        type: String,
        required: true
    },
    nick: {
        type: String,
        required: true
    },
    texto: {
        type: String,
        required: true
    }
});

const publicacion = mongoose.Schema({
    usuario: {
        type: userRedPSchema,
        required: true
    },
    titulo: {
        type: String,
        required: true
    },
    etapas:[{
        type: etapaSchema,
        required: true
    }],
    fecha:{
        type: Date, 
        default: Date.now
    },
    numlikes: {
        type: Number,
        default: 0
    },
    likes:[String],
    comentarios:[comentSchema],
    ciudad:{
        type: String,
        required: true
    },
    continente:{
        type: String,
        required: true
    },
    pais:{
        type: String,
        required: true
    },
    foto: String
},
{
collection: "publicaciones"
});

const Publicacion  = mongoose.model('Publicacion', publicacion);
const UsuPRed = mongoose.model('UsuPRed', userRedPSchema);
module.exports = {Publicacion: Publicacion, UsuPRed: UsuPRed};