'use strict';
const assert = require('assert');
const UTIL = require.main.require('./util');
const COLLECTION_USER = require('../db/collections/loan');

///////////////////////////////////////////////////////////////////////////////////
///// PROMISIFY  METHODS //////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
var insert_loan = (args, succes, fail) => {
   
    const insert = new COLLECTION_USER({
        Cedula: args.Cedula,
        Fecha: args.Fecha,
        Estado: args.Estado,
        Pago: 'No',
        Valor: args.Valor,
        Id: Date.now()
    }); 
    insert.save((err, resp) => {
        if (err) {
            fail(err);
        } else {
            succes(resp);
        }

    })

}



var find_loan = (args, succes, fail) => {


    COLLECTION_USER.find({
            Cedula: args.Cedula
        })
        .then(result => {

            if (result.length >= 1) {
                succes('Existe');
            } else {
                succes('Realizar');
            }

        })
        .catch(error => {

            fail(error);
        })


}

var find_declined_loan_ = (args, succes, fail) => {


    switch (args.loan) {
        case 'Existe':
           
            COLLECTION_USER.find({
                    Cedula: args.Cedula,
                    Estado: 'Rechazado'
                })
                .then(result => {

                    if (result.length >= 1 && result[0].Estado === 'Rechazado') {
                        
                        succes('Rechazado');
                    } else {

                        succes('Aprobar');

                    }


                })
                .catch(error => {

                    fail(error);
                })



            break;
        case 'Realizar':
            succes('Realizar');

            break;
    }
}



var verify_loan_ = (args, succes, fail) => {
    console.log('status:', args);


    switch (args.status) {
        case 'Aprobar':
            COLLECTION_USER.find({
                    Cedula: args.Cedula,
                    Estado: 'Aprobado',
                    Pago: 'No'
                })
                .then(result => {

                    if (result.length >= 1) {
                        
                        args.Estado = 'NoPago'
                        UTIL.promisify(insert_loan, args)
                            .then(result => {
                                succes(result);

                            })
                            .catch(error => {

                                fail(error);
                            })

                    } 
                    else {
                       
                        args.Estado = 'Aprobado'
                        UTIL.promisify(insert_loan, args)
                            .then(result => {
                                succes(result);

                            })
                            .catch(error => {

                                fail(error);
                            })

                    }

                })
                .catch(error => {

                    fail(error);
                })



            break

        case 'Rechazado':

            args.Estado = 'Rechazado';
            UTIL.promisify(insert_loan, args)
                .then(result => {
                    succes(result);

                })
                .catch(error => {

                    fail(error);
                })

            break;

        case 'Realizar':
            const aproved = Math.round(Math.random());
            args.Estado = aproved === 0 ? 'Aprobado' : 'Rechazado';
            UTIL.promisify(insert_loan, args)
                .then(result => {

                    succes(result);

                })
                .catch(error => {

                    fail(error);
                })
            break;


    }


}




///////////////////////////////////////////////////////////////////////////////////
///// MAIN ENDPOINT HANDLER  METHOD ///////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

var main_request_handler = (req, res, next) => {

    let _ = {
        ...req.body
    }


    UTIL.promisify(find_loan, _)
        .then(loan => {
            _.loan = loan;
            return UTIL.promisify(find_declined_loan_, _);;
        })
        .then(status => {
            _.status = status;
            return UTIL.promisify(verify_loan_, _);;
          
        })
        .then(resp => {
            
            UTIL.response_success(req,res,resp);
        })
        .catch(error => {
            UTIL.response_error(req, res, error);

        })

};




///////////////////////////////////////////////////////////////////////////////////
///// MODULE EXPORTS //////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

module.exports = {
    main: (req, res, next) => {
        let method = main_request_handler;
        UTIL.main_request_handler(method, req, res, next);
    }
};