'use strict';
require('./config');

const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
const UTIL = require('./util');
const DB_MONGO = require('./db/mongo');


const ENDPOINT_POST_FIND_USER = require('./endpoints/post_api_find_user');
const ENDPOINT_POST_CREATE_USER = require('./endpoints/post_api_create_user');
const ENDPOINT_POST_APPLY_FOR_LOAN = require('./endpoints/post_api_apply_for_loan');
const ENDPOINT_POST_GET_LOANS = require('./endpoints/post_api_get_loans');
const ENDPOINT_POST_PAY_LOAN = require('./endpoints/post_api_pay_loan');
const ENDPOINT_POST_GET_LOGIN = require('./endpoints/post_api_get_login');


const BASE_PATH='/api';



app.post(BASE_PATH +'/find_user',ENDPOINT_POST_FIND_USER.main);
app.post(BASE_PATH +'/create_user',ENDPOINT_POST_CREATE_USER.main);
app.post(BASE_PATH +'/loan',ENDPOINT_POST_APPLY_FOR_LOAN.main);
app.post(BASE_PATH +'/get_loans',ENDPOINT_POST_GET_LOANS.main);
app.post(BASE_PATH +'/pay_loan',ENDPOINT_POST_PAY_LOAN.main);
app.post(BASE_PATH +'/get_user',ENDPOINT_POST_GET_LOGIN.main);

app.use( UTIL.not_found );

DB_MONGO.connect().then(mongo =>{
	app.listen( __.PORT , ()=> console.log( `Listen on PORT ${__.PORT}`) );
})
.catch( error =>{
	console.log(error);
})


