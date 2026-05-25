const express = require("express");
const dotenv = require("dotenv");
dotenv.config()
const connectDB = require('./config/db')
connectDB();

const authRoutes = require('./routes/authRoutes')
const interviewRoutes = require('./routes/interviewRoutes')



const cors = require('cors');
const port = process.env.PORT || 5000;

const app = express()

app.use(express.json())
app.use(cors())

app.use('/api/auth',authRoutes)
app.use('/api/interview',interviewRoutes)

app.get('/',(req,res) => {
    res.json({
        message : "hire_ready is running"
    }
    )
})


app.listen(port, ()=>{
    console.log(`your app is on ${port}`)
})