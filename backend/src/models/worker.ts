import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Worker = new Schema(
    {
        workerId : {type : Number},
        firstname : {type : String},
        lastname : {type : String},
        email : {type : String},
        phoneNumber : {type : String},
        expertise : {type : String}
    }
);


export default mongoose.model('WorkerModel', Worker, 'workers');