class SeatDetail {
    constructor(rec) {
        this.OCCASION_SEAT_ID = rec.OCCASION_SEAT_ID;
        this.OCCASION_TIME_ID = rec.OCCASION_TIME_ID;
        this.SALON_NAME = rec.SALON_NAME;
        this.ZONE_NAME = rec.ZONE_NAME;
        this.RADIF_SHO = rec.RADIF_SHO;
        this.SEAT_SHO = rec.SEAT_SHO;
        this.NERKH = rec.NERKH;
        this.SEAT_ACTIVE_NAME = rec.SEAT_ACTIVE_NAME;
        this.SEAT_STATUS_NAME = rec.SEAT_STATUS_NAME;
        this.SEAT_STATUS_CODE = rec.SEAT_STATUS_CODE;
        this.SEAT_STATUS_CLASS = rec.SEAT_STATUS_CLASS;
    }
}

module.exports = SeatDetail;