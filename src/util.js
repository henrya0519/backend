'use strict';
const util = require('util');
const assert = require('assert');
const ERROR = require('./error');



exports.log = ( data ) =>{
	console.log(util.inspect( data, false, null, true) );
};


exports.response_error = ( req, res, error ) => {
	let http_code = 500;

	console.error( `\nRESPONSE ERROOOOOOOOOOOOOOOOOOOOR` );
	console.error( http_code );
	console.error( error );

	if( !ERROR.validate( error ) ){
		let e = ERROR.by_name('ERROR_RUNTIME');
		e.rid = req.headers.kte_rid;
		e.details = error.message || error;
		error = e;
	}

	let ms = {};
	ms.name = __.NAME;
	ms.method = req.method;
	ms.path = req.originalUrl;
	ms.version = __.VERSION;
	error.trace.push( ms );

	res.status( http_code ).send( { error } );
};


exports.response_success = ( req, res, data ) => {
	let http_code = 200;
	console.log('Sucees:' + data);
	res.status(http_code).send(data);
	if( __.DEBUG){
		console.log(`\nRESPONSE`);
		console.log(http_code);
		console.log( data );
	}
};


exports.response_headers = ( req, res, next )=>{
	res.set('Cache-Control', 'no-cache');
	res.removeHeader("X-Powered-By");
	next();
};


exports.request_log = ( req, res, next )=>{
	if(__.DEBUG){
		console.log('\n');
		console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -');
		console.log(new Date());
		console.log(__.NAME.toUpperCase());
		console.log( req.method + ' ' + req.path);
		console.log('\nHEADERS:');
		console.log(req.headers);
		console.log('\nQUERY:');
		console.log(req.query);
		console.log('\nBODY:');
		console.log(req.body);
	}
	next();
};


exports.body_to_json = ( req, res, next )=>{
	let buf = null;
	req.setEncoding('utf8');
	req.on('data', (chunk) => {
		if(buf === null) buf = '';
		buf += chunk;
	});
	req.on('end', () => {
		if( buf ){
			req.body = JSON.parse( buf );
		} else {
			req.body = {};
		}
		next();
	});
};


exports.allow_cross_origin = ( req, res, next )=>{
	res.header("Access-Control-Allow-Origin", '*');
	res.header('Access-Control-Allow-Methods', '*');
	res.header("Access-Control-Allow-Headers",'*');
	if(req.method === 'OPTIONS'){
	res.status( 200 ).send();
	}
	else{
		next();
	}
};


exports.request_health = ( req, res, next ) => {
	res.status( 200 ).send();
};


exports.request_info = ( req, res, next ) => {
	console.log('se enviara request: ', __)
	res.status( 200 ).send(__);
};


exports.not_found = ( req, res, next ) => {
	res.connection.destroy();
	if( __.DEBUG ){
		console.error('404 NOT FOUND');
	}
};


exports.kill_request = ( req, res ) =>{
	res.connection.destroy();
};


exports.promisify = ( method, args )=>{
	return new Promise( ( resolve, reject )=>{
		try{
			assert( typeof method === 'function');
			if(__.DEBUG){
				console.log(`\n${__.NAME}.promisify.${method.name}`);
				if ( args ) console.log( args );
			}
			method( args, ( data ) => {
				resolve( data );
			}, ( err ) => {
				reject( err );
			});
		}
		catch( err ){
			reject( err );
		}
	});
};


exports.main_request_handler = (method, req, res, next )=>{
	try{
		assert( typeof method === 'function');
		if( __.DEBUG ){
			console.log(`\n${__.NAME}.request.${method.name}`);
		}
		assert( typeof req === 'object');
		assert( typeof res === 'object');
		assert( typeof next === 'function');
		method( req, res, next );
	}
	catch(err){
		exports.response_error( req , res, err );
	}
};
