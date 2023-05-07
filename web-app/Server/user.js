class User {
    constructor(obj) {
      this.id = obj.id
      this.patientId = obj.patientId
      this.org = obj.org
      this.address = obj.address
      this.telephone = obj.tel
      this.diagnosis = obj.diagnosis
      this.medication = obj.medication
      this.doctorId = obj.doctorId
      this.role = obj.role
      this.username = obj.usernames
    }
  }
  
  module.exports = User