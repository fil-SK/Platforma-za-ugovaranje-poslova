import { Review } from "./review";

export class Request{
 
    requestId : number;

    agencyUsername : string;
    clientUsername : string;

    realEstateId : number;
    startDate : Date;
    endDate : Date;

    clientRequestStatus : string;       // clientRequested, agencyAccepted, agencyRejected
    agencyOffer : number;
    clientResponseToOffer : string;     // offerAccepted, offerRejected
    requestStatus : string;             // none (initially), ongoing, agencyDone, completed

    review : Review;

    allWorkers : Array<number> = [];
}