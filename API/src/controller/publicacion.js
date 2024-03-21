'use strict'

var Publicacion = require('../models/publicacion');


async function createPubli(req, res) {
    try {  
           const publi = await Publicacion.create(req.body);
           res.status(200).json(usu);
    }
    catch (err) {
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
           const publi = await Publicacion.findByIdAndUpdate(id, req.body);
           res.status(200).json(usu);
    }
    catch (err) {
           console.log(err.message);
    }
}

async function getPubli(req, res) {
    try {
           const { id } = req.params;
           const publi = await Publicacion.findById(id);
           res.status(200).json(usu);
    }
    catch (err) {
           console.log(err.message);
    }
}

async function getPublis(req, res) {
    try {
           const publis = await Publicacion.find();
           res.status(200).json(usuarios);
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
    getPublis
}