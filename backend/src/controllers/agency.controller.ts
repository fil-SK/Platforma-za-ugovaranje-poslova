import express from 'express';
import AgencyModel from '../models/agency';

export class AgencyController{

    registerAgency = (req : express.Request, res : express.Response) => {

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
                phoneNumber :req.body.phoneNumber,
                email : req.body.email
            }
        );


        agency.save( (err, resp) => {
            if(err){
                console.log(err);
                res.json( {'message' : 'error'} );
            }
            else{
                res.json({'message' : 'registeredAgency'});
            }
        } );
        
    }
}
