const express = require('express'); 
const cors = require('cors'); 
const dotenv = require('dotenv'); 

dotenv.config(); 

const authRoutes = require('./routes/auth.routes'); 
const assessmentRoutes = require('./routes/assessment.routes'); 

const app = express(); 

app.use(cors()); 
app.use(express.json()); 

app.use('/api/auth', authRoutes); 
app.use('/api/assessment', assessmentRoutes); 

const PORT = process.env.PORT || 5000; 

app.listen(PORT, () => { 
  console.log(`Server is running on port ${PORT}`); 
 }); 

