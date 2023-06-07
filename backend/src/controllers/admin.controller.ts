import express from 'express';

import ClientModel from '../models/client';
import AgencyModel from '../models/agency';
import IdTrackingModel from '../models/idTracking';
import WorkerModel from '../models/worker';


export class AdminController{

    
    getAllClients = (req : express.Request, res : express.Response) => {

        ClientModel.find({'type' : 'client', 'regStatus' : 'accepted'}, (error, clients) => {
            if(error){
                console.log(error);
            }
            else{
                res.json(clients);
            }
        });
    }

    getPendingAgencies = (req : express.Request, res : express.Response) => {
        AgencyModel.find({'regStatus' : 'pending'}, (error, agencies) => {
            if(error){
                console.log(error);
            }
            else{
                res.json(agencies);
            }
        });
    }
    

    getPendingClients = (req : express.Request, res : express.Response) => {
        ClientModel.find({'type' : 'client', 'regStatus' : 'pending'}, (error, clients) => {
            if(error){
                console.log(error);
            }
            else{
                res.json(clients);
            }
        });
    }


    getAllAgencies = (req : express.Request, res : express.Response) => {

        AgencyModel.find({'regStatus' : 'accepted'}, (error, agencies) => {
            if(error){
                console.log(error);
            }
            else{
                res.json(agencies);
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


    acceptClient = (req : express.Request, res : express.Response) => {

        let clientUsername = req.body.clientUsername;
        

        ClientModel.updateOne({'username' : clientUsername}, {$set : {'regStatus' : 'accepted'}}, (error, resp) => {
            if(error){
                console.log(error);
            }
            else{
                res.json({'message' : 'clientAccepted'});
            }
        });
    }


    declineClient = (req : express.Request, res : express.Response) => {

        let clientUsername = req.body.clientUsername;

        ClientModel.updateOne({'username' : clientUsername}, {$set : {'regStatus' : 'declined'}}, (error, resp) => {
            if(error){
                console.log(error);
            }
            else{
                res.json({'message' : 'clientDeclined'});
            }
        });
    }


    acceptAgency = (req : express.Request, res : express.Response) => {

        let agencyUsername = req.body.agencyUsername;

        AgencyModel.updateOne({'username' : agencyUsername}, {$set : {'regStatus' : 'accepted'}}, (error, resp) => {
            if(error){
                console.log(error);
            }
            else{
                res.json({'message' : 'agencyAccepted'});
            }
        });
    }


    declineAgency = (req : express.Request, res : express.Response) => {

        let agencyUsername = req.body.agencyUsername;

        AgencyModel.updateOne({'username' : agencyUsername}, {$set : {'regStatus' : 'declined'}}, (error, resp) => {
            if(error){
                console.log(error);
            }
            else{
                res.json({'message' : 'agencyDeclined'});
            }
        });
    }


    getLastWorkerId = (req : express.Request, res : express.Response) => {

        // This will fetch all rows from database - need to take only necessary one, which is workerId
        IdTrackingModel.findOne({}, (err, idData) => {
            if(err){
                console.log(err);
            }
            else{
                res.json(idData);
            }
        });
    }


    insertNewLastWorkerId = (req : express.Request, res : express.Response) => {
        
        let workerId = req.body.workerId;

        // Filter is {}, because there is only one row in the collection, therefore I'm updating entire collection, which consists of only one element (with three fields)
        IdTrackingModel.updateOne({}, {$set : {'workerId' : workerId}}, (err, resp) => {
            if(err){
                console.log(err);
            }
            if(resp){
                res.json({'message' : 'updatedWorkerId'});
            }
        });
    }


    insertNewWorkerIntoDatabase = (req : express.Request, res : express.Response) => {

        let worker = new WorkerModel(
            {
                workerId : req.body.workerId,
                worksFor : req.body.worksFor,
                firstname : req.body.firstname,
                lastname : req.body.lastname,
                email : req.body.email,
                phoneNumber : req.body.phoneNumber,
                expertise : req.body.expertise
            }
        );

        worker.save( (err, resp) => {
            if(err){
                console.log(err);
                return res.json({'message' : 'error'});
            }
            else {
                return res.json({'message' : 'insertedWorker'});
            }
        });

    }


    deleteClientWithUsername = (req : express.Request, res : express.Response) => {

        let clientUsername = req.body.username;

        ClientModel.deleteOne({'username' : clientUsername}, (err, resp) => {
            if(err){
                console.log(err);
            }
            else{
                res.json({'message' : 'clientDeleted'});
            }
        });

    }


    updateClientWithUsername = (req : express.Request, res : express.Response) => {

        let clientUsername = req.body.username;

        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let email = req.body.email;
        let phone = req.body.phoneNumber;

        console.log("Prezime je" + lastname);


        ClientModel.updateOne({'username' : clientUsername}, {$set: {'firstname' : firstname, 'lastname' : lastname, 'email' : email, 'phoneNumber' : phone}}, (err, resp) => {
            if(err){
                console.log(err);
            }
            else{
                res.json({'message' : 'clientUpdated'});
            }
        });
    }


    deleteAgencyWithUsername = (req : express.Request, res : express.Response) => {

        let agencyUsername = req.body.username;

        AgencyModel.deleteOne({'username' : agencyUsername}, (err, resp) => {
            if(err){
                console.log(err);
            }
            else{
                res.json({'message' : 'agencyDeleted'});
            }
        });
    }


    updateAgencyWithUsername =  (req : express.Request, res : express.Response) => {

        let username = req.body.username;
        
        let agencyName = req.body.agencyName;
        let streetAddress = req.body.streetAddress;
        let streetNumber = req.body.streetNumber;
        let city = req.body.city;
        let state = req.body.state;
        let description = req.body.description;
        let phoneNumber = req.body.phoneNumber;
        let email = req.body.email;

        
        AgencyModel.updateOne({'username' : username}, {$set : {'agencyName' : agencyName, 'streetAddress' : streetAddress,
                                                                'streetNumber' : streetNumber, 'city' : city, 'state' : state, 'description' : description,
                                                                'phoneNumber' : phoneNumber, 'email' : email}}, (err, resp) => {

                                                                    if(err){
                                                                        console.log(err);
                                                                    }
                                                                    else{
                                                                        res.json({'message' : 'agencyUpdated'});
                                                                    }
                                                                });
    }


    setRegStatusToAccepted =  (req : express.Request, res : express.Response) => {

        let type = req.body.type;
        let username = req.body.username;

        if(type == 'agency'){
            AgencyModel.updateOne({'username' : username}, {$set : {'regStatus' : 'accepted'}}, (err, resp) => {
                if(err){
                    console.log(err);
                }
                else{
                    res.json({'message' : 'adminRegConfirmed'});
                }
            })
        }

        else if(type == 'client'){
            ClientModel.updateOne({'username' : username}, {$set : {'regStatus' : 'accepted'}}, (err, resp) => {
                if(err){
                    console.log(err);
                }
                else{
                    res.json({'message' : 'adminRegConfirmed'});
                }
            })
        }
    }


    verifyIfEmailIsUnique = (req : express.Request, res : express.Response) => {

        let email = req.body.email;

        // Proveri prvo za ClientModel
        ClientModel.findOne({'email' : email}, (err, client) => {
            if(err){
                console.log(err);
            }

            else{

                if(client){
                    res.json({'message' : 'emailNotUnique'});
                }

                else{

                    AgencyModel.findOne({'email' : email}, (err, agency) => {
                        if(err){
                            console.log(err);
                        }
                        else{
                            if(agency){
                                res.json({'message' : 'emailNotUnique'});
                            }
                            else{

                                WorkerModel.findOne({'email' : email}, (err, worker) => {
                                    if(err){
                                        console.log(err);
                                    }
                                    else{
                                        if(worker){
                                            res.json({'message' : 'emailNotUnique'});
                                        }
                                        else{
                                            res.json({'message' : 'emailUnique'});
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        })

    }
}