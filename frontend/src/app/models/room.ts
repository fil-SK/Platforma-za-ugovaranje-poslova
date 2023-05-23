export class Room {

    roomId : number;

    roomCoord : {
        x : number,
        y : number,
        width : number,
        height : number
    };

    doorCoord : {
        x : number,
        y : number,
        width : number,
        height : number
    };

    roomColor : string;             // So that client can track the progress of that room
}