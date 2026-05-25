const Session = require('../models/Session')
const Groq = require('groq-sdk')
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const startInterview = async (req, res) => {
    try {
        const { targetRole } = req.body
        const prompt = `Generate 10 technical interview questions for a ${targetRole} developer position. Return only a JSON array of 10 strings, no extra text, like this: ["question1", "question2", ...]`
        const result = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile"
        })
        const text = result.choices[0].message.content
        const questions = JSON.parse(text)
        const newSession = new Session({ userid: req.user.id, targetRole, questions })
        await newSession.save()
        res.status(201).json({ sessionId: newSession._id, questions })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const submitInterview = async (req, res) => {
    try {
        const { sessionId, answers } = req.body
        const session = await Session.findById(sessionId)
        if (!session) {
            return res.status(404).json({ message: "Session Not found" })
        }
        const prompt = `You are an expert interviewer. Score these interview answers.
Questions and Answers:
${session.questions.map((q, i) => `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i]}`).join('\n')}
Return ONLY a JSON object like this, no extra text:
{"score": 7, "total": 10}`
        const result = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile"
        })
        const text = result.choices[0].message.content
        const evaluation = JSON.parse(text)
        session.answers = answers
        session.score = evaluation.score
        await session.save()
        res.status(200).json({ score: evaluation.score, total: evaluation.total })
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}

const getHistory = async (req, res) => {
    try {
        const sessions = await Session.find({ userid: req.user.id })
        res.status(200).json({ sessions })
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}

module.exports = { startInterview, submitInterview, getHistory }