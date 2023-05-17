import express from 'express';
import AgencyModel from '../models/agency';

import path from 'path';

export class AgencyController{


    verifyAgencyUnique = (req : express.Request, res : express.Response) => {

        let agency = new AgencyModel(
            {
                username : req.body.username,
                email : req.body.email,
                agencyId : req.body.agencyId
            }
        );


        // Analogous as verifyClientUnique method
        // We are nesting findOne functions, so that the second one will be called only if first one doesn't find matching user
        
        // Check if username is unique
        AgencyModel.findOne({'username' : agency.username}, (err, user) => {
            
            if(user){
                return res.json( {'message' : 'usernameNotUnique'} );
            }
            else{

                // Check if email is unique
                AgencyModel.findOne({'email' : agency.email}, (err, user) => {

                    if(user){
                        return res.json( {'message' : 'emailNotUnique'} );
                    }
                    else{

                        // Check if agencyId is unique
                        AgencyModel.findOne({'agencyId' : agency.agencyId}, (err, user) =>{
                            if(user){
                                return res.json({'message' : 'agencyIdNotUnique'});
                            }
                            else{
                                return res.json({'message' : 'userNotInDatabase'});     // If we return this then we can insert agency into database
                            }
                        });
                    }
                });
            }
        });

    }


    registerAgency = (req : express.Request, res : express.Response) => {


        let image;
        let imagePathServer;

        if(req.file){
            // If user did upload an image then use his image, else take a default image for agency
            image = req.file;
            imagePathServer = path.join('uploads', image.filename);
        }
        else{
            imagePathServer = path.join('uploads', 'agencyDefault.png');
        }


        console.log("");
        console.log("form data vrednosti iz kontrolera na bekendu");
        
        console.log(req.body);
        if(req.file){
            console.log(req.file);
        }


        // Extract agency data from the body of request 
        let agency = new AgencyModel(
            {
                agencyName : req.body.agencyName,
                streetAddress : req.body.streetAddress,
                streetNumber : req.body.streetNumber,
                city : req.body.city,
                state : req.body.state,
                agencyId : req.body.agencyId,
                description : req.body.description,
                username : req.body.username,
                password : req.body.password,
                phoneNumber :req.body.phone,
                email : req.body.email,
                type : "agency",     // Hardcode the type
                imagePath : imagePathServer
            }
        );


        // Insert agency into database
        agency.save( (err, resp) => {
            if(err){
                console.log(err);
                return res.json( {'message' : 'error'} );
            }
            else{
                return res.json({'message' : 'registeredAgency'});
            }
        } );
 
    }



    loginAgency = (req : express.Request, res : express.Response) => {
        
        // Get data from request
        let username = req.body.username;
        let password = req.body.password;


        AgencyModel.findOne({'username' : username, 'password' : password}, (err, user) => {
            if(err){
                console.log(err);
                res.json({'message' : 'failedToLogin'});
            }
            else{
                res.json(user);
            }
        });
    }
}
