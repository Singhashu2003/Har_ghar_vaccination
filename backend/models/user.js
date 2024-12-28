import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  dob: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  occupation: {
    type: String,
    required: true
  },
  idType: {
    type: String,
    required: true
  },
  idNumber: {
    type: String,
    required: true
  },
  issuedAuthority: {
    type: String,
    required: true
  },
  password: {
    type: String,
    require: true
  },role:{
    type:String,
    default:'User'
  }
})

export default mongoose.model('User', userSchema)
