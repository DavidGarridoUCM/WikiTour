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

var etapaSchema = mongoose.Schema({

})

var comentSchema = mongoose.Schema({

})

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
