const router = require('express').Router();
const notificationController = require('../controllers/notificationController.js')
const auth = require('../middleware/auth.js')

router.get("/", auth.verifyUser, notificationController.get_user_notification)

module.exports = router