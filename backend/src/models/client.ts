import mongoose from "mongoose";

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
        imagePath : {type : String}
    }
);


export default mongoose.model('ClientModel', Client, 'client');