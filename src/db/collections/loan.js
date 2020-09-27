const {Schema, model} = require('mongoose');


const Users = new Schema ({
    Cedula:String,
    Fecha:String,
    Estado:String,
    Pago: String,
    Valor:String,
    Id:String
})

module.exports =  model('Prestamos',Users);
