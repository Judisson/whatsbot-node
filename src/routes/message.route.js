const express = require('express')
const controller = require('../controllers/message.controller');
const router = express.Router();

// console.log("router",router.route('/menssages').post(controller.Receive));
// router.route('/menssages').post(controller.Receive)
router.post('/menssages', controller.Receive)
router.post('/statuses', controller.Status)
router.post('/response-message', controller.Response)

module.exports = router