const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    targetRole: { type: String, required: true },
    questions: [String],
    answers: [String],
    score: Number,
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Session', sessionSchema)