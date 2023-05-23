import { Room } from "./room";

export class RealEstate {
    realEstateId : number;
    ownerUsername : string;

    type : string;
    address : string;
    numberOfRooms : number;
    squareFootage : number;
    
    roomArray : Array<Room> = [];
    doorImagePath : string;
}