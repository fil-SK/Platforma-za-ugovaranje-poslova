import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Review = new Schema(
    {
        rating : {type : Number},
        comment : {type : String}
    }
);

let Request = new Schema(
    {
        requestId : {type : Number},
        agencyUsername : {type : String},
        clientUsername : {type : String},

        realEstateId : {type : Number},
        startDate : {type : Date},
        endDate : {type : Date},

        clientRequestStatus : {type : String},          // clientRequested, agencyAccepted, agencyRejected
        clientResponseToOffer : {type : String},        // offerAccepted, offerRejected
        requestStatus : {type : String},                // awaitingApproval (initially), ongoing, agencyDone, completed

        review : {type : Review}
    }
);


export default mongoose.model('RequestModel', Request, 'requests');