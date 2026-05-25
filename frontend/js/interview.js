const token = localStorage.getItem('token')

if (!token) {
    window.location.href = 'login.html'
}

// Get role from URL
const urlParams = new URLSearchParams(window.location.search)
const role = urlParams.get('role')

let questions = []
let answers = []
let currentIndex = 0
let sessionId = null

// Load questions when page opens
async function loadQuestions() {
    const response = await fetch('http://localhost:5000/api/interview/start', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ targetRole: role })
    })

    const data = await response.json()
    questions = data.questions
    sessionId = data.sessionId
    answers = new Array(10).fill('')

    document.getElementById('loading-screen').style.display = 'none'
    document.getElementById('question-screen').style.display = 'block'

    showQuestion()
}

function showQuestion() {
    document.getElementById('current-q').textContent = currentIndex + 1
    document.getElementById('question-text').textContent = questions[currentIndex]
    document.getElementById('answer-input').value = answers[currentIndex]

    // Update progress bar
    const percent = ((currentIndex + 1) / 10) * 100
    document.getElementById('progress-fill').style.width = percent + '%'

    // Change last button to Submit
    const btn = document.getElementById('next-btn')
    if (currentIndex === 9) {
        btn.textContent = 'Submit ✓'
    } else {
        btn.textContent = 'Next →'
    }
}

function nextQuestion() {
    answers[currentIndex] = document.getElementById('answer-input').value

    if (currentIndex === 9) {
        submitInterview()
    } else {
        currentIndex++
        showQuestion()
    }
}

function prevQuestion() {
    answers[currentIndex] = document.getElementById('answer-input').value
    if (currentIndex > 0) {
        currentIndex--
        showQuestion()
    }
}

async function submitInterview() {
    document.getElementById('question-screen').style.display = 'none'
    document.getElementById('loading-screen').style.display = 'block'
    document.getElementById('loading-screen').innerHTML = '🤖 Evaluating your answers...'

    const response = await fetch('http://localhost:5000/api/interview/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sessionId, answers })
    })

    const data = await response.json()
    localStorage.setItem('score', data.score)
    localStorage.setItem('total', data.total)
    window.location.href = 'results.html'
}

loadQuestions()