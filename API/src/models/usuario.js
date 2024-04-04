'use strict'
var {isEmail} = require('validator');
var mongoose = require('mongoose');
var bcrypt = require('mongoose-bcrypt');
const { response } = require('express');

const userRedSchema = mongoose.Schema({
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
    }},
    {
        autoCreate: false,
        autoIndex: false
});

const notiSchema = mongoose.Schema({
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
    }},
    {
        autoCreate: false,
        autoIndex: false
});

const adjuntoSchema = mongoose.Schema({
    tipo: {
        type: String,
        enum: ['ubicacion', 'imagen', 'link'],
        required: true
    },
    adjunto: {
        type: String,
        required: true
    }},
    {
        autoCreate: false,
        autoIndex: false
});

const mensajeSchema = mongoose.Schema({
    texto:{
        type: String,
        required: true
    },
    adjuntos: [adjuntoSchema],
    fecha: {
        type: Date, 
        default: Date.now
    }},
    {
        autoCreate: false,
        autoIndex: false
});

const conversacionSchema = mongoose.Schema({
    usuarioEmisor: {
        type: userRedSchema,
        required: true
    }, 
    mensajes: [mensajeSchema],
    estado:{
        type: String,
        enum: ['leida', 'sin leer'],
        default: 'sin leer'
    }},
    {
        autoCreate: false,
        autoIndex: false
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
    conversaciones:[conversacionSchema]
});

userSchema.plugin(bcrypt);
const Usuario = mongoose.model('Usuario', userSchema);
const UsuRed = mongoose.model('UsuarioRed', userRedSchema);
const Conver = mongoose.model('Conver', conversacionSchema);
module.exports = {Usuario: Usuario, UsuRed: UsuRed, Conver: Conver};


