import express from 'express';
import ClientModel from '../models/client';


export class ClientController{


    registerClient = (req : express.Request, res : express.Response) => {


        // Extract data from body

        let client = new ClientModel(
            {
                type : "client",    // Hardcode type as client
                firstname : req.body.firstname,
                lastname : req.body.lastname,
                username : req.body.username,
                password : req.body.password,
                phoneNumber : req.body.phoneNumber,
                email : req.body.email
            }
        );

        // Nest findOne functions, to make sure that the second findOne function is called ONLY if the first one doesn't find matching user
        // Because findOne is asynchronous, non-blocking

        // Check if username is unique
        ClientModel.findOne({'username' : client.username}, (err, user) => {

            if(user){
                return res.json( {'message' : 'usernameNotUnique'} );
            }
            else {

                // Check if email is unique
                ClientModel.findOne( {'email' : client.email}, (err, user) => {
                    
                    if(user){
                        return res.json( {'message' : 'emailNotUnique'} );
                    }
                    else {

                        // Both are unique - add to database
                        client.save( (err, resp) => {
                            
                            if(err){
                                console.log(err);
                                return res.json({'message' : 'error'});
                            }
                            else {
                                return res.json({'message' : 'registeredClient'});
                            }
                        } );
                    }
                });
            }
        });

    }
}