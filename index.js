require('dotenv').config();
const mongoString = process.env.DATABASE_URL
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');



mongoose.connect(mongoString);
const database = mongoose.connection

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})


const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

const routes = require('./routes/routes');

app.use('/api', routes)

// app.get('/',(request,response)=>{


//     response.send('Welcome To API');
// })
const PORT = process.env.PORT;
app.listen(PORT, () => {

    
    console.log(`Server Started at ${PORT}`)
})