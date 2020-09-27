'use strict';

const error_objects = {

	ERROR_RUNTIME: {
		code : 1,
		details:'username parameter is missing'
	},
	ERROR_404: {
		code : 2,
	},
	ERROR_AUTHENTICATION: {
		code : 3,
		details: 'User Not Found by Email and Passoword'
	},
	ERROR_CHECK_SESSION: {
		code : 4,
		details: 'Active Session Not Found'
	}
};

var get_error_object_by_name = ( name )=>{
	let error = error_objects[ name ];
	if(!error) throw 'Error name not found: ' + name;
	error = JSON.parse( JSON.stringify( error ) );
	error.trace = [];
	return error;
};

var check_error_structure = (error)=>{
	if(typeof error !== 'object'){
		return false;
	}
	if(error === null || error === undefined){
		return false;
	}
	if( ! error.code ){
		return false;
	}
	if( ! Array.isArray( error.trace ) ){
		return false;
	}
	return true;
};


module.exports = {
	by_name: (name)=>{
		return get_error_object_by_name( name );
	},
	validate: (error)=>{
		return check_error_structure(error);
	}
};
