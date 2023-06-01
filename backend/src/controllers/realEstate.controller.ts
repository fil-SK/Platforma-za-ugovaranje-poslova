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



    getAllRealEstatesForClient = async (req : express.Request, res : express.Response) => {


        try {
            const username = req.body.clientUsername;
            const allRealEstates = await RealEstateModel.find({ username }).exec();
        
            res.json(allRealEstates);
          }
        catch(err){
            console.log(err);
        }

    }


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
}