const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./db/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const passwordResetRoutes = require('./routes/resetPassword');
const app = express();
const PORT = 9000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/signup', (req, res) => {
  res.render('app');
});
app.get('/login',(req,res)=>{
    res.render('login')
})

app.get('/forgot-password', (req, res) => {
  res.render('resetPassword');
});

app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', passwordResetRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on${PORT}`);
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database');
  }
});
