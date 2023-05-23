import express from 'express';
import ClientModel from '../models/client';
import IdTrackingModel from '../models/idTracking';

const multiparty = require('multiparty');

import path from 'path';        // To use path

import fs from 'fs';            // Imports NodeJS module for working with file system




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
                imagePath : imagePathServer,
                regStatus : "pending"
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

                    if(user.regStatus == 'pending'){
                        res.json({'message' : 'regStatusPending'});
                    }
                    else if(user.regStatus == 'declined'){
                        res.json({'message' : 'regStatusDeclined'});
                    }
                    else{
                        res.json(user);     // Status is 'accepted' so login is allowed
                    }
                    
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


    changePassword = (req : express.Request, res : express.Response) => {

        let loggedUserUsername = req.body.username;
        let newPassword = req.body.password;

        ClientModel.updateOne({'username' : loggedUserUsername}, {$set : {'password' : newPassword}}, (error, resp) => {
            if(error){
                console.log(error);
            }
            else{
                res.json({'message' : 'changedPassword'});
            }
        });
    }


    getLastRoomAndRealEstateId = (req: express.Request, res : express.Response) => {

        IdTrackingModel.findOne({}, (err, idData) => {
            if(err){
                console.log(err);
            }
            else{
                res.json(idData);
            }
        });


    }

    insertNewLastUsedRoomAndRealEstateId = (req : express.Request, res : express.Response) => {

        let lastRoomId = req.body.roomId;
        let lastRealEstateId = req.body.realEstateId;

        // Filter is {}, because there is only one row in the collection, therefore I'm updating entire collection, which consists of only one element (with two fields)
        IdTrackingModel.updateOne({}, {$set : {'roomId' : lastRoomId, 'realEstateId' : lastRealEstateId}}, (err, resp) => {
            if(err){
                console.log(err);
            }
            if(resp){
                res.json({'message' : 'dbIdUpdated'});
            }
        });
    }


    insertRealEstateToClient = (req : express.Request, res : express.Response) => {

        let username = req.body.clientUsername;
        let newRealEstateId = req.body.realEstateId;

        ClientModel.findOneAndUpdate({'username' : username}, {$push : {'realEstateArray' : newRealEstateId}}, (err, resp) => {
            if(err){
                console.log(err);
            }
            else{
                return res.json({'message' : 'updatedClient'});
            }
        });

    }



    extractFromUploadedJSON = (req : express.Request, res : express.Response) => {

        // Get file from the filepath and read its content
        const filePath = req.file.path;
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(fileContent);


        // Create an object from JSON file
        let newRealEstate = {};
        const data = {
            type : jsonData.type,
            address : jsonData.address,
            numberOfRooms : jsonData.numberOfRooms,
            roomArray : jsonData.roomArray,
            doorImagePath : jsonData.doorImagePath
        };
        /*
        newRealEstate.type = jsonData.type;
        newRealEstate.address = jsonData.address;
        newRealEstate.numberOfRooms = jsonData.numberOfRooms;
        newRealEstate.roomArray = jsonData.roomArray;
        newRealEstate.doorImagePath = jsonData.doorImagePath;
*/
        fs.unlinkSync(filePath);        // Delete uploaded file

        console.log("Uploadovan JSON fajl na bekendu izgleda ovako: ");
        console.log(data);

        res.json(data);        // Return extracted object
    }
}