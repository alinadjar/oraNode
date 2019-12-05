const ReservationHeader_Dto = require('./ReservationHeader_Dto');

class ReserveDto {
    constructor(p1, p2) {
        this.reservation = new ReservationHeader_Dto(p1);
        this.OccasionSeatIDs = p2;
    }
}


module.exports = ReserveDto;