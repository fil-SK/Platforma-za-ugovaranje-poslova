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


        // By the same logic as in client controller, we are nesting findOne functions, so that the second one will be called only if first one doesn't find matching user

        // Check if username is unique
        AgencyModel.findOne( {'username' : agency.username}, (err, user) =>{

            if(user){
                return res.json( {'message' : 'usernameNotUnique'} );
            }
            else{

                // Check if email is unique
                AgencyModel.findOne( {'email' : agency.email}, (err, user) => {

                    if(user){
                        return res.json( {'message' : 'emailNotUnique'} );
                    }
                    else{

                        // Both are unique - add to database

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
                } );

            }
        } );




        
        
    }
}
