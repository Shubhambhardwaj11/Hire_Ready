async function register(){
    const fullname = document.getElementById('fullname').value 
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const yearOfStudy = document.getElementById('yearOfStudy').value
    const response = await fetch('http://localhost:5000/api/auth/register', {
        method : 'POST',
        headers : {'content-Type':'application/json'},
        body : JSON.stringify({fullname,email,password,yearOfStudy})

    })

    const data = await response.json()

    if(response.ok){
        alert('Registration successful ! Please login.')
        window.location.href = 'login.html'
    }else {
        alert(data.message)
    }
}

async function login(){
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    
    const response = await fetch('https://hire-ready-i2ot.onrender.com/api/auth/login',{
        method : 'POST',
        headers : {'content-Type' : 'application/json'},
        body : JSON.stringify({email,password})
        })

        const data = await response.json()

        if(response.ok){
            localStorage.setItem('token',data.token)
            window.location.href ='dashboard.html'
        }else{
            alert(data.message)
        }
}