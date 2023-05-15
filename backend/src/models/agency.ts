import mongoose from "mongoose";

const Schema = mongoose.Schema;


let Agency = new Schema(
    {
        agencyName : {type : String},
        streetAddress : {type : String},
        streetNumber : {type: String},
        city : {type : String},
        state : {type : String},
        agencyId : {type : String},         // Maticni broj
        description : {type : String},
        username : {type : String},
        password : {type : String},
        phoneNumber : {type : String},
        email : {type : String},

        type : {type : String}
    }
);

export default mongoose.model('AgencyModel', Agency, 'agency');