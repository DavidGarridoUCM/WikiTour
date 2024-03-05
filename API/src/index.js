'use strict'

var mongoose = require('mongoose');
var app =  require('./app');
var port = 3800;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/wikitour').then(() => {
    console.log("Conexion a bd Wikitour es OK");
    app.listen(port, () => {
        console.log("Servidor corriendo en http://localhost:" + port);
    })
}).catch(err => console.log(err));