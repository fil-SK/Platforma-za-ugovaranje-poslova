import express from 'express';
import ClientModel from '../models/client';

const multiparty = require('multiparty');

import path from 'path';


export class ClientController{


    verifyClientUnique = (req : express.Request, res : express.Response) => {

        let client = new ClientModel(
            {
                username : req.body.username,
                email : req.body.email
            }
        );


        // Check if username and email from the request already exist in the database
        // Nest findOne functions, to make sure that the second findOne function is called ONLY if the first one doesn't find matching user
        // Because findOne is asynchronous, non-blocking

        // First check for username
        ClientModel.findOne({'username' : client.username}, (err, user) => {

            if(user){   // If user is returned, then user with that username already exists in database
                return res.json({'message' : 'usernameNotUnique'});
            }
            else{

                // Check email
                ClientModel.findOne({'email' : client.email}, (err, user) => {

                    if(user){
                        return res.json({'message' : 'emailNotUnique'})
                    }
                    else{
                        return res.json({'message' : 'userNotInDatabase'});     // If this returns, we can insert the user in database
                    }
                })
            }
        });

    }

    registerClient = (req : express.Request, res : express.Response) => {

        let image;
        let imagePathServer;

        if(req.file){
            // If user did upload an image then use his image, else take a default image for client
            image = req.file;
            imagePathServer = path.join('uploads', image.filename);
        }
        else{
            imagePathServer = path.join('uploads', 'clientDefault.png');
        }
        

        console.log("");
        console.log("form data vrednosti iz kontrolera na bekendu");
        

        console.log(req.body);
        if(req.file){
            console.log(req.file);
        }
        

        // Console log each value in body of request
        for (const key in req.body) {
            if (Object.hasOwnProperty.call(req.body, key)) {
              const value = req.body[key];
              console.log(`${key}: ${value}`);
            }
        }

        // Prepare client with data from request

        let client = new ClientModel(
            {
                type : "client",                    // Hardcode type as client
                firstname : req.body.firstname,
                lastname : req.body.lastname,
                username : req.body.username,
                password : req.body.password,
                phoneNumber : req.body.phone,
                email : req.body.email,
                imagePath : imagePathServer
            }
        );

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