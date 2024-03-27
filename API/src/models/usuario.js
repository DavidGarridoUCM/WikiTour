'use strict'
var {isEmail} = require('validator');
var mongoose = require('mongoose');
var bcrypt = require('mongoose-bcrypt');
const { response } = require('express');

var userRedSchema = mongoose.Schema({
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
        required: true
    }
});

var notiSchema = mongoose.Schema({
    tipo: {
        type: String,
        required: true
    },
    usuario: {
        type: userRedSchema,
        required: true
    },
    estado: {
        type: String,
        required: true
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

var mensajeSchema = mongoose.Schema({
    texto:{
        type: String,
        required: true
    },
    adjuntos: [adjuntoSchema],
    fecha: {
        type: Date, 
        default: Date.now
    }
});

var conversacionSchema = mongoose.Schema({
    usuarioEmisor: {
        type: userRedSchema,
        required: true
    }, 
    mensajes: [mensajeSchema],
    estado:{
        type: String,
        enum: ['leida', 'sin leer'],
        default: 'sin leer'
    }
});

var userSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es necesario"]
    },
    apellidos: {
        type: String,
        required: [true, "El apellido es necesario"]
    },
    nick: {
        type: String,
        unique: true,
        required: [true, "El nombre de usuario es necesario"]
    },
    email: {
        type: String,
        required: [true, "El mail es necesario"],
        unique: true,
        validate: [isEmail, 'Escribe un mail correcto']
    },
    password:{
        type: String,
        unique: true,
        required: [true, "La contraseña es necesaria"],
        bcrypt: true
    },
    fotoPerfil: String,
    biografia: String,
    puntuacion: Number,
    rol: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default:'user'
    },
    seguidos : [userRedSchema],
    seguidores : [userRedSchema],
    bloqueados: [userRedSchema],
    notificaciones: [notiSchema],
    mensajes:[conversacionSchema]
});

userSchema.plugin(bcrypt);
module.exports = mongoose.model('Usuario', userSchema);


