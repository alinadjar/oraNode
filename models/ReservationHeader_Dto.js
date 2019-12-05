class ReservationHeader_Dto {
    constructor(record) {
        this.NameFamily = record.NameFamily;
        this.MobileNumber =record.MobileNumber;
        this.NationalCode = record.NationalCode;
        this.Address = record.Address;
        this.SumPrice = record.SumPrice;
        this.OccasionTimeID = record.OccasionTimeID;
    }
}

module.exports = ReservationHeader_Dto;