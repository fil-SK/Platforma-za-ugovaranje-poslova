import express from 'express';
import ClientModel from '../models/client';


export class ClientController{


    registerClient = (req : express.Request, res : express.Response) => {

        let client = new ClientModel(
            {
                firstname : req.body.firstname,
                lastname : req.body.lastname,
                username : req.body.username,
                password : req.body.password,
                phoneNumber : req.body.phoneNumber,
                email : req.body.email
            }
        );

        client.save( (err, resp) => {
            if(err){
                console.log(err);
                res.json({'message' : 'error'});
            }
            else{
                res.json({'message' : 'registeredClient'});
            }
        } );

    }
}