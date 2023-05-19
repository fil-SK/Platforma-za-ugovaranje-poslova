import mongoose from "mongoose";

const Schema = mongoose.Schema;

let RealEstate = new Schema(
    {
        realEstateId : {type : Number},
        type : {type : String},
        address : {type : String},
        numberOfRooms : {type : Number},
        squareFootage : {type : Number}
    }
);

export default mongoose.model('RealEstateModel', RealEstate, 'realEstate');