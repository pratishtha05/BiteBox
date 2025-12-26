const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const dotenv = require('dotenv');
dotenv.config();

// db connection
const dbConnection = require('./config/db');
dbConnection();

// middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routers
const adminRouter = require('./routes/admin.routes');
app.use('/admin', adminRouter);

const authRouter = require('./routes/auth.routes');
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000 , () => {
  console.log('Server is running on port 3000');
});