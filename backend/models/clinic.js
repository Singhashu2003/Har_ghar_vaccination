import mongoose from 'mongoose'

const clinicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  years: {
    type: String,
    required: true
  },
  services: [
    {
      type: String,
      required: true
    }
  ]
})

export default mongoose.model('Clininc', clinicSchema)
