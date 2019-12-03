
class V_OCCASSION_TIME {
         constructor(record) {
             console.log(record);
            this.OCASION_TITLE = record[0]; 
            this.OCASION_DATE = record[1];
            this.OCASION_SALON = record[2];
            this.OCASION_START = record[3];
            this.OCASION_TIME = record[4];
            this.OCASION_TIME_DESC = record[5];
            this.OCASION_TIME_ACTIVE = record[6];
            this.OCASION_ID = record[7];
            this.OCASION_TIME_ID = record[8];
         }
}


module.exports = V_OCCASSION_TIME;