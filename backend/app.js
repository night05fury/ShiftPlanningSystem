//backend setups
const express = require('express');
const dotenv= require('dotenv');
const connectDB=require('./config/db.js');
const app= express();

app.get('/', (req, res){
    res.send('Hello World');
});

app.listen(5000,()=>{console.log('server started on port 5000')})