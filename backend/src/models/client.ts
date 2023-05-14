import mongoose from "mongoose";

const Schema = mongoose.Schema;


let Client = new Schema(
    {
        firstname : {type : String},
        lastname : {type : String},
        username : {type : String},
        password : {type : String},
        phoneNumber : {type : String},
        email : {type : String},
    }
);


export default mongoose.model('ClientModel', Client, 'client');