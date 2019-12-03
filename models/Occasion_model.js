class OccasionModel {
    constructor (record) {
      this.occasionID = record.OCCA01;
      this.title = record.OCCA02;
      this.description = record.OCCA03;
      this.activeState = record.OCCA04;
    }
  }

  module.exports = OccasionModel;