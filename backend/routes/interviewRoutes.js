const express = require('express')
const router = express.Router()

const {protect} = require('../middleware/authMiddleware')

const {startInterview,submitInterview,getHistory} = require("../controllers/interviewController")


router.post('/start',protect,startInterview)
router.post('/submit',protect,submitInterview)
router.get('/history',protect,getHistory)


module.exports = router