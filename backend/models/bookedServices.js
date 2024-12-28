import mongoose from 'mongoose'

const bookedServicesSchema = new mongoose.Schema(
  {
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clininc',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    vaccine: {
      type: String,
      required: true
    },
    appointmentDate: {
      type: String,
      required: true
    },
    appointmentTime: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('BookedServices', bookedServicesSchema)
