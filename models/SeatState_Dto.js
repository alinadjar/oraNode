class SeatState_Dto {
    constructor(record) {
        this.seatID = record.seatID;
        this.kindReserveCode = record.kindReserveCode;
        this.ConnectionID = record.ConnectionID;
    }
}

module.exports = SeatState_Dto;