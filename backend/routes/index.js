import express from 'express'
import { Authentication } from '../controllers'
import auth from '../middleware/auth'
import admin from '../middleware/admin'

const router = express.Router()

router.post('/login', Authentication.login)
router.post('/register', Authentication.register)
router.get('/validateUser', auth, Authentication.validateUser)

router.post(
  '/book-services/:clinicId/:vaccine/:date/:time',
  auth,
  Authentication.bookService
)
router.get('/getClinic', Authentication.getClinic)
router.get('/allClinic', Authentication.getAllClinic)


router.get('/mybookings', auth, Authentication.MyBookings)

//LabTest




export default router
