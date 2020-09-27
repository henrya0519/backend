'use strict';
const assert = require( 'assert' );
const UTIL = require.main.require( './util' );
const COLLECTION_USER = require('../db/collections/loan');


///////////////////////////////////////////////////////////////////////////////////
///// PROMISIFY  METHODS //////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////



var find_loans = (args, succes, fail) => {


    COLLECTION_USER.find({Cedula: args.Cedula})
        .then(result => {
            console.log('Result: ', result);
            succes(result);

        })
        .catch(error => {

            fail(error);
        })


}



var send_data = (args, succes, fail) => {
   
    const Name = args.Nombre;
   
    const Prestamos = args.loans;
    const array = [];
    
    for(let i=0; i<Prestamos.length; i++)
    {
        array.push({
            Id: Prestamos[i].Id,
            Nombre: Name,
            Estado: Prestamos[i].Estado,
            Pago: Prestamos[i].Pago,
            Valor: Prestamos[i].Valor,
        })
    }
    succes(array);

}









///////////////////////////////////////////////////////////////////////////////////
///// MAIN ENDPOINT HANDLER  METHOD ///////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

var main_request_handler = ( req, res, next ) => {

	let _ = {
		...req.body
	}

	
	UTIL.promisify(find_loans,_)
	.then (loans =>{
        _.loans = loans 
        //UTIL.response_success(req,res,fuser);
        return UTIL.promisify(send_data, _);;

    })
    .then (resp =>{
        console.log('llego acaaa:', resp);
		UTIL.response_success(req,res,resp);

	})
	.catch( error => {
		UTIL.response_error( req, res, error );

	})
	
	//UTIL.response_success(req,res,{cmd:'hola'});
	

	

};





///////////////////////////////////////////////////////////////////////////////////
///// MODULE EXPORTS //////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

module.exports = {
	main: ( req, res, next) => {
		let method = main_request_handler;
		UTIL.main_request_handler( method, req, res, next);
	}
};
