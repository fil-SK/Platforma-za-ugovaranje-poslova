import express from 'express';

import ClientModel from '../models/client';
import AgencyModel from '../models/agency';


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
}