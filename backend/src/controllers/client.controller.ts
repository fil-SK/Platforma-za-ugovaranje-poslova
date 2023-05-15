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



    loginClient = (req : express.Request, res : express.Response) => {

        // Get data from request
        let username = req.body.username;
        let password = req.body.password;


        ClientModel.findOne({'username' : username, 'password' : password}, (err, user) => {
            if(err){
                console.log(err);
                res.json({'message' : 'failedToLogin'});
            }
            else{

                if(user == null){
                    res.json({'message' : 'userIsntClient'});
                }

                // Check if the returned user is client and not admin
                else if(user.type == 'client'){
                    res.json(user);
                }
                else{
                    res.json({'message' : 'userIsAdmin'});
                }

            }
        });


    }
    

    loginAdmin = (req : express.Request, res : express.Response) => {

        // Get data from request
        let username = req.body.username;
        let password = req.body.password;

        ClientModel.findOne({'username' : username, 'password' : password}, (err, admin) => {
            if(err){
                console.log(err);
                res.json({'message' : 'errorWithLogin'});
            }
            else{

                if(admin == null){
                    res.json({'message' : 'userNotExists'});
                }

                else if(admin.type == 'admin'){
                    res.json(admin);
                }
                else{
                    res.json({'message' : 'userNotAdmin'});
                }
                
            }
        });
    }
}