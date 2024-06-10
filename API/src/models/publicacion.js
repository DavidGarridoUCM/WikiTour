'use strict'

var mongoose = require('mongoose');

const userRedPSchema = mongoose.Schema({
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
    fotoPerfil: String,
    puntuacion: Number
},
{
    autoCreate: false,
    autoIndex: false
});

const adjuntoSchema = mongoose.Schema({
    tipo: {
        type: String,
        required: true
    },
    adjunto: {
        type: String,
        required: true
    }
});

const cambioSchema = mongoose.Schema({
    texto: {
        type: String,
        required: true
    },   
    usuario:{
        type: userRedPSchema,
        required: true
    },
    adjuntos:[adjuntoSchema],
    tipo:{
        type: String,
        enum: ['original', 'cambio'],
        default:'original',
        required: true
    },
    fecha:{
        type: Date, 
        default: Date.now
    }
});


const etapaSchema = mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    texto: {
        type: String,
        required: true
    },
    adjuntos:[adjuntoSchema],
    propuestos:[cambioSchema],
    aceptados: [cambioSchema],
    tipo:{
        type: String,
        enum: ['original', 'cambio'],
        default:'original',
        required: true
    }
});

const comentSchema = mongoose.Schema({
    texto: {
        type: String,
        required: true
    },
    likes: Number
});

const publicacion = mongoose.Schema({
    usuario: {
        type: userRedPSchema,
        required: true,
        unique: true
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
    likes: Number,
    comentarios:[comentSchema],
    puntuacion:Number,
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
    }
},
{
collection: "publicaciones"
});

const Publicacion  = mongoose.model('Publicacion', publicacion);
const UsuPRed = mongoose.model('UsuPRed', userRedPSchema);
module.exports = {Publicacion: Publicacion, UsuPRed: UsuPRed};