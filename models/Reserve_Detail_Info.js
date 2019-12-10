class Reserve_Detail_Info {
    constructor(record) {
        //this.RESERVE_ID = record[0];
        //this.RESERVE_CODE = record[1];
        //this.SALON_CODE = record[2];
        this.SALON_NAME = record[3];
        //this.ZONE_CODE = record[4];
        this.ZONE_NAME = record[5];
        this.RADIF_SHO = record[6];
        this.SEAT_SHO = record[7];
        this.NERKH = record[8];
        //this.RESERVE_INFO_ID = record[9];
    }
}

module.exports = Reserve_Detail_Info;