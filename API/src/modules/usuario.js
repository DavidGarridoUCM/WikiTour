'use strict'
var {isEmail} = require('validator');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

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
        unique: true,
        required: true
    },
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

var userSchema = mongoose.Schema({
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
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [isEmail, 'Invalid mail']
    },
    password:{
        type: String,
        unique: true,
        required: true, 
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
    notificaciones: [notiSchema]
});

module.exports = mongoose.model('Usuario', userSchema);



