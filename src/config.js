'use strict';




global.__ = {};



__.NAME = 'ms_mlm_bulkload';
__.PORT = parseInt( process.env.PORT );
__.DEBUG = process.env.DEBUG === 'TRUE'? true: false;



// SECRETS
__.DB = {
	
		MONGODB_NAME: process.env.MONGODB_NAME,
	    MONGODB_HOST: process.env.MONGODB_HOST,
		MONGODB_PORT: process.env.MONGODB_PORT
	
}

