class User {
    constructor(obj) {
      this.id = obj.id
      this.patientId = obj.patientId
      this.address = obj.address
      this.telephone = obj.telephone
      this.diagnosis = obj.diagnosis
      this.medication = obj.medication
      this.doctorId = obj.doctorId
      this.orgId = obj.orgId
      this.message = obj.message
      this.newDoctorId = obj.newDoctorId
      


    }
  }
  
  module.exports = User