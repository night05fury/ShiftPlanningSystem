const express = require('express');
require("dotenv").config();
const mongoose = require('mongoose');
const cors=require('cors');
const authRoutes = require('../backend/routes/authRoutes');


const app = express();
const PORT = process.env.PORT || 5000;
const db=process.env.MONGO_URI;

// MongoDB database here
mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

//middlewares
app.use(cors())
// Parse incoming JSON data
// app.use(parseJSON());

app.use(express.json());
app.use('/api/auth', authRoutes); 

//listeners
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(db);
});