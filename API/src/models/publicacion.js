'use strict'

var mongoose = require('mongoose');

var userRedPSchema = mongoose.Schema({
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
});

var cambioSchema = mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    texto: {
        type: String,
        required: true
    },
    adjuntos:[adjuntoSchema],
    usuario:{
        type: userRedPSchema,
        required: true
    },
    fecha:{
        type: Date, 
        default: Date.now
    }
});

var adjuntoSchema = mongoose.Schema({
    tipo: {
        type: String,
        enum: ['ubicacion', 'imagen', 'link'],
        required: true
    },
    adjunto: {
        type: String,
        required: true
    }
});

var etapaSchema = mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    texto: {
        type: String,
        required: true
    },
    adjuntos:[adjuntoSchema],
    cambios:[cambioSchema],
    tipo:{
        type: String,
        enum: ['original', 'nueva'],
        default:'original',
        required: true
    }
});

var comentSchema = mongoose.Schema({
    texto: {
        type: String,
        required: true
    },
    likes: Number
});

var publicacion = mongoose.Schema({
    usuario: userRedPSchema,
    titulo: {
        type: String,
        required: true
    },
    etapas:[etapaSchema],
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
});

module.exports = mongoose.model('Publicacion', publicacion);
