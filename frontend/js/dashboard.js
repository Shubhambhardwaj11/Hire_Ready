const token = localStorage.getItem('token')

if(!token){
    window.location.href ='login.html'
}

async function loadDashboard(){
    const response = await fetch('http://localhost:5000/api/interview/history',{
        headers : {'Authorization' : `Bearer ${token}`}
    })
    const data = await response.json()

    if(data.sessions.length > 0){
        const list = document.getElementById('sessions-list')
        list.innerHTML =''
        data.sessions.forEach(session => {
            list.innerHTML +=`
            <div class="session-card">
                    <div>
                        <p class="session-role">${session.targetRole} Developer</p>
                        <p class="session-date">${new Date(session.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div class="session-score">${session.score}/10</div>
                </div>
            `
        })
    }
}
function startInterview(role) {
    window.location.href = `interview.html?role=${role}`
}

function logout(){
    localStorage.removeItem('token')
    window.location.href ='login.html'
}

loadDashboard()