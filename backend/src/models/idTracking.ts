
// Model that will be used to access the 'idTracking' collection, which works as a primary key tracking database
// For each 

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let IDTracking = new Schema(
    {
        realEstateId : {type : Number},
        roomId : {type : Number}
    }
);

export default mongoose.model('IdTrackingModel', IDTracking, 'idTracking');