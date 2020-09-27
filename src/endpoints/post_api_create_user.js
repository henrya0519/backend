'use strict';
const assert = require( 'assert' );
const UTIL = require.main.require( './util' );
const COLLECTION_USER = require('../db/collections/createuser');

///////////////////////////////////////////////////////////////////////////////////
///// PROMISIFY  METHODS //////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////



var creater_user =(args,succes,fail) =>{
	
        console.log('args create user:', args);
		const insert =new COLLECTION_USER({
			Nombre: args.Nombre,
			Apellidos:args.Apellidos,
			Celular:args.Celular,
			Cedula:args.Cedula,
			Correo: args.Correo,
			Contraseña: args.Contraseña
		});
		insert.save((err,resp)=>{
			if(err)
			{
				fail(err);
			}
			else{
				succes(resp);
			}

		})


	
}






///////////////////////////////////////////////////////////////////////////////////
///// MAIN ENDPOINT HANDLER  METHOD ///////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

var main_request_handler = ( req, res, next ) => {

	let _ = {
		...req.body
	}

	
	UTIL.promisify(creater_user,_)
	.then (fuser =>{
		UTIL.response_success(req,res,fuser);
	})
	.catch( error => {
		UTIL.response_error( req, res, error );

	})

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
