import express from 'express';

import RealEstateModel from '../models/realestate';


export class RealEstateController{


    insertRealEstateToTheCollection = (req : express.Request, res : express.Response) => {

        let newRealEstate = req.body.realEstate;


        let realEstate = new RealEstateModel(
            {
                realEstateId : newRealEstate.realEstateId,
                ownerUsername : newRealEstate.ownerUsername,
                type : newRealEstate.type,
                address : newRealEstate.address,
                numberOfRooms : newRealEstate.numberOfRooms,
                squareFootage : newRealEstate.squareFootage,

                roomArray : newRealEstate.roomArray,
                doorImagePath : newRealEstate.doorImagePath,
                underRenovation : newRealEstate.underRenovation

            }
        );


        realEstate.save((err, resp) => {
            if(err){
                console.log(err);
            }
            else{
                res.json({'message' : 'realEstateInserted'});
            }
        });
    }



    getAllRealEstatesForClient = (req : express.Request, res : express.Response) => {

        let username = req.body.username;

        RealEstateModel.find({'ownerUsername' : username}, (err, allRealEstate) => {
            if(err){
                console.log(err);
            }
            else{
                res.json(allRealEstate);
            }
        });

        
    }

    /*
        Stara metoda od ove iznad
        getAllRealEstatesForClient = async (req : express.Request, res : express.Response) => {


        try {
            const username = req.body.username;
            const allRealEstates = await RealEstateModel.find({ username }).exec();
        
            res.json(allRealEstates);
          }
        catch(err){
            console.log(err);
        }

    }
    */


    markForRenovation = (req : express.Request, res : express.Response) => {

        let realEstateId = req.body.realEstateId;

        RealEstateModel.updateOne({'realEstateId' : realEstateId}, {$set : {'underRenovation' : true}}, (err, resp) => {
            if(err){
                console.log(err);
            }
            if(resp){
                res.json({'message' : 'realEstateMarked'});
            }
        });
    }


    getRealEstateWithId = (req : express.Request, res : express.Response) => {

        let realEstateId = req.body.realEstateId;


        RealEstateModel.findOne({'realEstateId' : realEstateId}, (err, realEstate) => {
            if(err){
                console.log(err);
            }
            else{
                res.json(realEstate);
            }
        })
    }

    /*
    stara metoda

    getRealEstateWithId = (req : express.Request, res : express.Response) => {

        let realEstateId = req.body.realEstateId;


        RealEstateModel.findOne({'realEstateId' : realEstateId}, (err, realEstate) => {
            if(err){
                console.log(err);
            }
            else{
                res.json(realEstate);
            }
        })
    }
    */
}