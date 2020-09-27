const {Schema, model} = require('mongoose');


const Users = new Schema ({
    Nombre: String,
    Apellidos:String,
    Celular:String,
    Cedula:String,
    Correo: String,
    Contraseña: String
})

module.exports =  model('Users',Users);
