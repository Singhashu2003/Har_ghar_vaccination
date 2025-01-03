import Joi from 'joi'
import { User, BookedServices, Clininc } from '../../models'
import bcrypt from 'bcrypt'
import { SALT } from '../../config'
import JwtService from '../../services/JwtService'
import CustomErrorHandler from '../../services/CustomErrorHandler'

const Authentication = {
  async register (req, res, next) {
    // Validation
    const registerSchema = Joi.object({
      fullName: Joi.string().min(3).max(30).required(),
      dob: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      gender: Joi.string().min(3).max(30).required(),
      mobileNumber: Joi.string().min(3).max(30).required(),
      occupation: Joi.string().min(3).max(30).required(),
      idType: Joi.string().required(),
      idNumber: Joi.required(),
      issuedAuthority: Joi.string().min(3).max(30).required(),
      password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),
      confirm_password: Joi.ref('password')
    })

    const { error } = registerSchema.validate(req.body)

    if (error) {
      return next(error)
    }

    // Check if user is in database?
    try {
      const exists = await User.exists({ email: req.body.email })
      if (exists) {
        return next(
          CustomErrorHandler.alreadyExists('This E-Mail already exists')
        )
      }
    } catch (err) {
      return next(err)
    }

    // Hash Password
    const {
      fullName,
      dob,
      email,
      mobileNumber,
      gender,
      occupation,
      idType,
      idNumber,
      issuedAuthority,
      password
    } = req.body
    const hashedPass = await bcrypt.hash(password, Number(SALT))
    const user = new User({
      password: hashedPass,
      fullName,
      dob,
      email,
      mobileNumber,
      gender,
      occupation,
      idType,
      idNumber,
      issuedAuthority
    })

    let access_token

    try {
      const result = await user.save()
      console.log(result)
      access_token = JwtService.sign({
        result
      })
    } catch (err) {
      return next(err)
    }
    res.json({ access_token })
  },

  async login (req, res, next) {
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required()
    })

    const { email, password } = req.body

    const { error } = loginSchema.validate(req.body)

    if (error) {
      return next(error)
    }

    try {
      //   Find User
      const user = await User.findOne({
        email
      })

      if (!user) {
        return next(
          CustomErrorHandler.notExists("User Doesn't Exists, Please Sign Up")
        )
      }
      // Comapre Password

      const match = await bcrypt.compare(password, user.password)

      if (!match) {
        return next(CustomErrorHandler.wrongPassword('Wrong Password'))
      }
      if (user.role === 'admin') {
        const access_token = JwtService.sign({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        })

        res.cookie('usercookie', access_token, {
          expires: new Date(Date.now() + 9000000),
          httpOnly: true
        })

        res.status(201).json({ user, access_token })
      } else {
        //   Token
        const access_token = JwtService.sign({
          _id: user._id,
          name: user.name,
          email: user.email
        })

        res.cookie('usercookie', access_token, {
          expires: new Date(Date.now() + 9000000),
          httpOnly: true
        })

        res.status(201).json({ user, access_token })
      }
    } catch (err) {
      return next(err)
    }
  },

  async validateUser (req, res, next) {
    try {
      const validateOne = await User.findById(req.user._id).select(
        '-__v -password'
      )
      if (!validateOne) {
        return next(CustomErrorHandler.notFound('User not found'))
      }
      res.json({ validateOne })
    } catch (error) {
      return next(error)
    }
  },

  async getAll (req, res, next) {
    try {
      const allUSers = await User.find().select('-password -__v')

      if (allUSers.length === 0) {
        return res.json({ msg: 'No users' })
      }

      res.json(allUSers)
    } catch (error) {
      next(error)
    }
  },

  async bookService (req, res, next) {
    const clinicId = req.params.clinicId
    const vaccine = req.params.vaccine
    const date = req.params.date
    const time = req.params.time
    const userId = req.user._id

    const bookedServices = new BookedServices({
      clinicId,
      userId,
      vaccine,
      appointmentDate: date,
      appointmentTime: time
    })

    bookedServices.save((err, bookedServices) => {
      if (err) {
        res.send(err)
      } else {
        res.send(bookedServices)
      }
    })
  },

  async getClinic (req, res, next) {
    try {
      const clinics = await Clininc.find({ services: service }).exec()
      res.json(clinics)
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  async getAllClinic (req, res, next) {
    try {
      const clinics = await Clininc.find()
      res.json(clinics)
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  async MyBookings (req, res, next) {
    try {
      const bookings = await BookedServices.find({ userId: req.user._id }).populate('userId clinicId')
      res.json(bookings)
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

export default Authentication
