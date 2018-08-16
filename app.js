const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const config = require('./config/database');
const passport = require('passport');

mongoose.connect(config.database, {useNewUrlParser: true});

// App init
const app = express();
let db = mongoose.connection;
// Checking for db errors and successful connection
db.on('error', (err) => {
  console.log(err);
});
db.once('open', () => {
  console.log('DB connected successfully!');
});

// Bringing in models
let Articles = require('./models/article');

// Load views and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Setting public folder for statis assets
app.use(express.static(path.join(__dirname, 'public')));

// Adding middlewares
// Body parser middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Express messages middlewares
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express sessions middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Passport config
require('./config/passport')(passport);
// Passport middlewares
app.use(passport.initialize());
app.use(passport.session());

// Global setting
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// Routes
app.get('/', (req, res) => {
  Articles.find((err, articles) => {
    if (err) return console.log(err);
    res.render('index', {
      title: 'Articles',
      articles: articles
    });
  });
});

// Route files
let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/users', users);

app.listen(3000, () => {
  console.log('Server started on port 3000...');
});
