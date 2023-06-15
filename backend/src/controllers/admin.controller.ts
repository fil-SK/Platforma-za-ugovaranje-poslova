import express from 'express';

import ClientModel from '../models/client';
import AgencyModel from '../models/agency';
import IdTrackingModel from '../models/idTracking';
import WorkerModel from '../models/worker';
import RequestModel from '../models/request';


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


    insertWorkerToAgencyWorkersArray = (req : express.Request, res : express.Response) => {

        let usernameAgency = req.body.username;
        let workerId = req.body.workerId;

        // Cuvas ID radnika te agencije
        AgencyModel.updateOne({'username' : usernameAgency}, {$push : {'workersArray' : workerId}}, (err, resp) => {
            if(err){
                console.log(err);
            }
            else{
                res.json({'message' : 'workerInsertedToArray'});
            }
        })

    }


    getAllWorkersForAgency = (req : express.Request, res : express.Response) => {

        let agencyUsername = req.body.username;

        WorkerModel.find({'worksFor' : agencyUsername}, (err, workers) => {
            if(err){
                console.log(err);
            }
            else{
                res.json(workers);
            }
        });

    }


    getWorkerWithId = (req : express.Request, res : express.Response) => {

        let workerId = req.body.workerId;

        WorkerModel.findOne({'workerId' : workerId}, (err, worker) => {
            if(err){
                console.log(err);
            }
            else{
                res.json(worker);
            }
        });
    }


    updateWorkerWithId = (req : express.Request, res : express.Response) => {

        let workerId = req.body.workerId;
        let phone = req.body.phone;
        let expertise = req.body.expertise;

        WorkerModel.updateOne({'workerId' : workerId}, {$set : {'phoneNumber' : phone, 'expertise' : expertise}}, (err, resp) => {
            if(err){
                console.log(err);
            }
            else{
                res.json({'message' : 'workerUpdated'});
            }
        });
    }


    checkIfWorkerIsOnTheJob = (req : express.Request, res : express.Response) => {

        let workerId = req.body.workerId;
        let agencyUsername = req.body.username;

        // Time sto pretrazujem sa [workerId] ce se postici da ce se proveriti da li workerId postoji u CELOM workerArray nizu
        // Da sam to izostavio i napisao bez [ ] on bi proverio workerArray==workerId, sto nije ispravno ponasanje
        AgencyModel.findOne({'username' : agencyUsername, 'workersArray' : {$in : [workerId]}}, (err, status) => {
            if(err){
                console.log(err);
            }
            else{
                if(status){
                    res.json({'message' : 'workerFound'});
                }
                else{
                    res.json({'message' : 'workerNotFound'});
                }
            }
        });
    }


    // Za brisanje radnika - da se obrise iz kolekcije i iz agencije kojoj je dodeljen
    deleteWorkerFromCollection = (req : express.Request, res : express.Response) => {

        let workerId = req.body.workerId;

        WorkerModel.deleteOne({'workerId' : workerId}, (err, resp) => {
            if(err){
                console.log(err);
            }
            else{
                res.json({'message' : 'deletedFromCollection'});
            }
        });

    }


    deleteWorkerFromAgency = (req : express.Request, res : express.Response) => {

        let workerId = req.body.workerId;
        let agencyUsername = req.body.username;


        AgencyModel.updateOne({'username' : agencyUsername}, {$pull : {'workersArray' : workerId}}, (err, resp) => {
            if(err){
                console.log(err);
            }
            else{
                res.json({'message' : 'removedFromAgency'});
            }
        });
    }


    // Za deo gde admin treba da ima uvid u sve poslove svih klijenata
    getAllRequestsFromCollection = (req : express.Request, res : express.Response) => {

        RequestModel.find({}, (err, requests) => {
            if(err){
                console.log(err);
            }
            else{
                res.json(requests);
            }
        });

    }


    // Admin dohvata imena svih klijenata za koje ima korisnicka imena u pregledu poslova
    getClientNamesAndLastnamesForUsernameList =  (req : express.Request, res : express.Response) => {

        let clientUsernames = req.body.clientUsernames;

        ClientModel.find({'username' : {$in : clientUsernames}}, (err, clients) => {
            if(err){
                console.log(err);
            }
            else{

                // Prodji kroz sve dohvacene klijente i vrati par username-ime+prezime
                let clientNameAndLastname : String[] = [];

                let i : number;
                for(i = 0; i < clients.length; i++){
                    clientNameAndLastname.push(clients[i].firstname + " " + clients[i].lastname)
                }

                res.json(clientNameAndLastname);
            }
        });
    }


    // Admin dohvata nazive svih agencija za koje ima korisnicka imena u pregledu poslova
    getAgencyNamesForUsernameList = (req : express.Request, res : express.Response) => {

        let agencyUsernames = req.body.agencyUsernames;

        AgencyModel.find({'username' : {$in : agencyUsernames}}, (err, agencies) => {
            if(err){
                console.log(err);
            }
            else{
                
                // Prodji kroz sve dohvacene agencije i vrati nazive
                let agencyNameArray : String[] = [];

                let i : number;
                for(i = 0; i < agencies.length; i++){
                    agencyNameArray.push(agencies[i].agencyName);
                }

                res.json(agencyNameArray);
            }
        });
    }


    // Kada admin treba da pogleda detaljno posao izmedju klijenta i agencije
    getRequestWithThisId = (req : express.Request, res : express.Response) => {

        let requestId = req.body.requestId;

        RequestModel.findOne({'requestId' : requestId}, (err, request) => {
            if(err){
                console.log(err);
            }
            else{
                res.json(request);
            }
        });
    }
}