import express from 'express';

import ClientModel from '../models/client';
import AgencyModel from '../models/agency';


export class AdminController{

    getAllClients = (req : express.Request, res : express.Response) => {

        ClientModel.find({'type' : 'client'}, (error, clients) => {
            if(error){
                console.log(error);
            }
            else{
                res.json(clients);
            }
        });
    }
    

    getAllAgencies = (req : express.Request, res : express.Response) => {

        AgencyModel.find({}, (error, agencies) => {
            if(error){
                console.log(error);
            }
            else{
                res.json(agencies);
            }
        });
    }
}