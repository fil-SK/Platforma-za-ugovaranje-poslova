import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Room = new Schema(
    {
        roomId : {type : Number},

        roomCoord : {
            x : {type : Number},
            y : {type : Number},
            width : {type : Number},
            height : {type : Number}
        },

        doorCoord : {
            x : {type : Number},
            y : {type : Number},
            width : {type : Number},
            height : {type : Number}
        },

        roomColor : {type : String}
    }
);



let RealEstate = new Schema(
    {
        realEstateId : {type : Number},
        ownerUsername : {type : String},

        type : {type : String},
        address : {type : String},
        numberOfRooms : {type : Number},
        squareFootage : {type : Number},

        roomArray : [Room],                 // Has an array of rooms, described with Room schema
        doorImagePath : {type : String}
    }
);

export default mongoose.model('RealEstateModel', RealEstate, 'realEstate');