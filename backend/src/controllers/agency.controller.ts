import express from 'express';
import AgencyModel from '../models/agency';
import ClientModel from '../models/client';
import RequestModel from '../models/request';
import RealEstateModel from '../models/realestate';
import WorkerModel from '../models/worker';

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

        // First check with agency
        AgencyModel.findOne({'username' : agency.username}, (err, user) => {
            
            if(user){
                return res.json( {'message' : 'usernameNotUnique'} );
            }
            else{

                // Check username in ClientModel
                ClientModel.findOne({'username' : agency.username}, (err, client) => {

                    if(client){
                        return res.json( {'message' : 'usernameNotUnique'} );
                    }


                    else{

                        // Check if email is unique

                        // First check with agency
                        AgencyModel.findOne({'email' : agency.email}, (err, user2) => {

                            if(user2){
                                return res.json( {'message' : 'emailNotUnique'} );
                            }
                            else{

                                // Check email in ClientModel
                                ClientModel.findOne({'email' : agency.email}, (err, client2) => {
                                    
                                    if(client2){
                                        return res.json( {'message' : 'emailNotUnique'} );
                                    }

                                    else{

                                        WorkerModel.findOne({'email' : agency.email}, (err, worker) => {
                                            if(worker){
                                                return res.json( {'message' : 'emailNotUnique'} );
                                            }

                                            else{

                                                // Check if agencyId is unique
                                                AgencyModel.findOne({'agencyId' : agency.agencyId}, (err, user3) =>{
                                                    if(user3){
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
                imagePath : imagePathServer,
                regStatus : "pending"
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

                if(user){
                    // Check for registration status
                    if(user.regStatus == 'pending'){
                        res.json({'message' : 'regStatusPending'});
                    }
                    else if(user.regStatus == 'declined'){
                        res.json({'message' : 'regStatusDeclined'});
                    }
                    else{   // Agency is accepted - return agency object
                        res.json(user);
                    }
                }
                else{
                    res.json({'message' : 'userIsntAgency'});
                }
            }
        });
    }


    changePassword = (req : express.Request, res : express.Response) => {

        let loggedUserUsername = req.body.username;
        let newPassword = req.body.password;

        AgencyModel.updateOne({'username' : loggedUserUsername}, {$set : {'password' : newPassword}}, (error, resp) => {
            if(error){
                console.log(error);
            }
            else{
                res.json({'message' : 'changedPassword'});
            }
        });
    }


    getAgencyWithUsername = (req : express.Request, res : express.Response) => {

        let username = req.body.username;

        AgencyModel.findOne({'username' : username}, (err, agency) => {
            if(err){
                console.log(err);
            }
            else{
                res.json(agency);
            }
        })
    }


    getAllRequestsForThisAgency = (req : express.Request, res : express.Response) => {

        let username = req.body.username;

        // Dohvatamo samo one zahteve koje je klijent tek zatrazio, pa se ceka odluka agencije
        RequestModel.find({'agencyUsername' : username, 'clientRequestStatus' : 'clientRequested'}, (err, requests) => {
            if(err){
                console.log(err);
            }
            else{
                if(requests.length == 0){
                    res.json({'message' : 'noRequests'});
                }
                else{
                    res.json(requests);
                }
            }
        });
    }


    acceptClientRequest = (req : express.Request, res : express.Response) => {

        let requestId = req.body.requestId;
        let agencyOffer = req.body.agencyOffer;

        RequestModel.updateOne({'requestId' : requestId}, {$set : {'clientRequestStatus' : 'agencyAccepted', 'agencyOffer' : agencyOffer}}, (err, resp) => {
            if(err){
                console.log(err);
            }
            else{
                res.json({'message' : 'requestAccepted'});
            }
        });
    }


    declineClientRequest = (req : express.Request, res : express.Response) => {

        let requestId = req.body.requestId;

        RequestModel.updateOne({'requestId' : requestId}, {$set : {'clientRequestStatus' : 'agencyRejected'}}, (err, resp) => {
            if(err){
                console.log(err);
            }
            else{
                res.json({'message' : 'requestRejected'});
            }
        });

    }


    getAllActiveJobsForThisAgency = (req : express.Request, res : express.Response) => {

        let username = req.body.username;

        // Odradi isto kao ovo iznad, samo gledaj koji flag treba da posmatras i koju vrednost, da bi se smatralo aktivnim poslom

        // Dohvatamo samo one zahteve za koje je posao AKTIVAN -- ako je requestStatus jednak ongoing ili agencyDone
        // Koristim in da bi uzimao u obzir samo vrednosti iz tog skupa
        RequestModel.find({'agencyUsername' : username, 'requestStatus' : {$in : ['ongoing', 'agencyDone']}}, (err, activeJobs) => {
            if(err){
                console.log(err);
            }
            else{
                if(activeJobs.length == 0){
                    res.json({'message' : 'noActiveJobs'});
                }
                else{
                    res.json(activeJobs);
                }
            }
        });
    }


    changeRoomColor = (req : express.Request, res : express.Response) => {

        let roomId = req.body.roomId;
        let roomColor = req.body.roomColor;

        // $ se u roomArray.$.roomColor koristi kako bi se match-ovao tacno odgovarajuci indeks unutar roomArray niza
        RealEstateModel.updateOne({'roomArray.roomId' : roomId}, {$set : {'roomArray.$.roomColor' : roomColor}}, (err, resp) => {
            if(err){
                console.log(err);
            }
            else{
                res.json({'message' : 'roomUpdated'});
            }
        });
    }


    setAgencyDone = (req : express.Request, res : express.Response) => {

        let requestId = req.body.requestId;

        RequestModel.updateOne({'requestId' : requestId}, {'requestStatus' : 'agencyDone'}, (err, resp) => {
            if(err){
                console.log(err);
            }
            else{
                res.json({'message' : 'agencyDoneSet'});
            }
        });

    }




    getAllWorkerObjectsForAgency = (req : express.Request, res : express.Response) => {

        let agencyUsername = req.body.username;
        let workersArray = req.body.workersArray;

       
        WorkerModel.find({'worksFor' : agencyUsername, 'workerId' : {$in : workersArray}}, (err, workers) => {

            if(err){
                console.log(err);
            }
            else{



                res.json(workers);
            }
        });

    }


    // Ova metoda se poziva kada su konacno svi radnici prikupljeni i potrebno ih je dodati objektu time sto ce se evidentirati u zahtevu
    assignCollectedWorkersToTheRequest = (req : express.Request, res : express.Response) => {

        let requestId = req.body.requestId;
        let allWorkers = req.body.allWorkers;


        RequestModel.updateOne({'requestId' : requestId}, {$set : {'allWorkers' : allWorkers}}, (err, resp) => {
            if(err){
                console.log(err);
            }
            else{
                res.json({'message' : 'allWorkersAssignedToRequest'});
            }
        });
    }


    // Ova metoda poziva se nakon sto su u request-u sacuvani svi radnici koji su dodeljeni poslu
    // Sada u ovoj metodi te radnike treba ukloniti, kako se ne bi videli kod ostalih poslova kao da su slobodni
    deleteWorkersFromAgency = (req : express.Request, res : express.Response) => {

        let agencyUsername = req.body.username;
        let allWorkers = req.body.allWorkers;

        AgencyModel.updateOne({'username' : agencyUsername}, {$pull : {'workersArray' : {$in : allWorkers}}}, (err, resp) => {
            if(err){
                console.log(err);
            }
            else{
                res.json({'message' : 'workersDeletedFromAgency'});
            }
        });
    }


    // Ova metoda se poziva nakon sto je klijent potvrdio placanje i time finalizirao posao
    // Svi radnici koji su bili dodeljeni tom poslu vracaju se nazad u agenciju, u niz workersArray
    releaseWorkersFromJob = (req : express.Request, res : express.Response) => {

        let agencyUsername = req.body.username;
        let allWorkersFromJob = req.body.allWorkers;


        AgencyModel.updateOne({'username' : agencyUsername}, {$push : {'workersArray' : {$each : allWorkersFromJob}}}, (err, resp) => {
            if(err){
                console.log(err);
            }
            else{
                res.json({'message' : 'workersSuccessfullyRestored'});
            }
        });
    }


    // Ovu metodu pozivamo da dohvatimo sve iz kolekcije requests za tu agenciju, kako bismo prosli kroz to i dohvatili sve recenzije
    getAllRequestsWithReviews = (req : express.Request, res : express.Response) => {

        let agencyUsername = req.body.username;

        RequestModel.find({'agencyUsername' : agencyUsername}, (err, jobs) => {
            if(err){
                console.log(err);
            }
            else{
                let i : number;
                let jobsWithReviews = [];

                for(i = 0; i < jobs.length; i++){
                    if(jobs[i].review !== null && jobs[i].review !== undefined){        // Ako polje review nije null ili undefined onda taj element dodaj
                        jobsWithReviews.push(jobs[i]);
                    }
                }
                res.json(jobsWithReviews);
            }
        });
    }
}