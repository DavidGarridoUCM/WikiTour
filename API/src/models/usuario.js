'use strict'
var {isEmail} = require('validator');
var mongoose = require('mongoose');
var bcrypt = require('mongoose-bcrypt');
const { response } = require('express');


const userRedSchema = mongoose.Schema({
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
    }},
    {
        autoCreate: false,
        autoIndex: false
});

const userSchema = mongoose.Schema({
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
        required: [true, "La contraseña es necesaria"],
        bcrypt: true
    },
    fotoPerfil: {
        type: String,
        default: null
    },
    biografia: {
        type: String,
        default: null
    },
    numSeguidores: {
        type : Number,
        default : 0
    }, 
    numSeguidos: {
        type : Number,
        default : 0
    },
    publicaciones: {
        type : Number,
        default : 0
    },
    seguidos : [userRedSchema],
    seguidores : [userRedSchema]
},
{
collection: "usuarios"
});

userSchema.plugin(bcrypt);
const Usuario = mongoose.model('Usuario', userSchema);
const UsuRed = mongoose.model('UsuRed', userRedSchema);
module.exports = {Usuario: Usuario, UsuRed: UsuRed};


