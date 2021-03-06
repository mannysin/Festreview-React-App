require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');

const session      = require('express-session');
const passport     = require('passport');
const cors         = require('cors');

require('./config/passport')


mongoose
  .connect(process.env.MONGODB_URI, {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'FestReview.com';

app.use(session({
  secret:"some secret goes here",
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000', 'https://festreview.herokuapp.com/']
}));

const index = require('./routes/index');
app.use('/', index);

const userRoutes = require('./routes/user-routes');
app.use('/api', userRoutes);

const festivalRoutes = require('./routes/festival-routes');
app.use('/api', festivalRoutes);

const reviewRoutes = require('./routes/review-routes');
app.use('/api', reviewRoutes);

const commentRoutes = require('./routes/comment-routes');
app.use('/api', commentRoutes);


app.use((req, res, next) => {
  res.sendFile(__dirname + "/public/index.html");
});

module.exports = app;