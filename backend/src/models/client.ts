import mongoose from "mongoose";

// import RealEstateModel from '../models/realestate';

const Schema = mongoose.Schema;


let Client = new Schema(
    {
        type : {type: String},
        firstname : {type : String},
        lastname : {type : String},
        username : {type : String},
        password : {type : String},
        phoneNumber : {type : String},
        email : {type : String},
        imagePath : {type : String},
        regStatus : {type : String},    // pending, accepted, denied

        realEstateArray : [Number]  // array of numbers, which represent the realEstateId for each real estate client has
    }
);


export default mongoose.model('ClientModel', Client, 'client');