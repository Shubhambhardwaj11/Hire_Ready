const score = localStorage.getItem('score')
const total = localStorage.getItem('total')

document.getElementById('score-display').textContent = score

if (score >= 8) {
    document.getElementById('score-message').textContent = '🔥 Excellent! You are well prepared!'
} else if (score >= 5) {
    document.getElementById('score-message').textContent = '👍 Good job! Keep practicing!'
} else {
    document.getElementById('score-message').textContent = '💪 Keep going! Practice makes perfect!'
}