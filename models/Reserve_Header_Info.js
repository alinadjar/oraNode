class Reserve_Header_Info {
    constructor(record) {
        this.Title = record[0];
        this.Saloon_Name = record[4];
        this.Occasion_Date = record[3];
        this.Occasion_Time = record[5];
        this.Occasion_Duration = record[6];
        this.Reserve_Date = record[9];
        this.Reserve_Time = record[10];
        this.Family = record[11];
        this.CodeMelli = record[12];
        this.Mobile = record[13];
        this.Address = record[14];
        this.PursuitCode = record[22];
    }
}

module.exports = Reserve_Header_Info;