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
        agencyOffer : {type : Number},
        clientResponseToOffer : {type : String},        // offerAccepted, offerRejected
        requestStatus : {type : String},                // awaitingApproval (initially), rejected, ongoing, agencyDone (agencija zavrsila, sad klijent treba plati i time postavi na completed), completed (completed je kad je klijent platio i posao zvanicno gotov)

        review : {type : Review},

        allWorkers : [Number]
    }
);


export default mongoose.model('RequestModel', Request, 'requests');