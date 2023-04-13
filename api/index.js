const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const messageRoute = require('./routes/messages');
const conversationRoute = require('./routes/conversations');

const cookieParser = require('cookie-parser');
const cors = require('cors');

// Rate Limit with express-rate-limit

const rateLimit = require('express-rate-limit');

dotenv.config();

mongoose.connect(process.env.MONGO_URL, () => {
  console.log('Connected To MongoDB');
});

//Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  next();
});
app.use(express.json());

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:4001',
      'https://www.socio-social.ml',
      'http://www.socio-social.ml',
      'https://socio-social.ml',
      'http://socio-social.ml'
    ],
  })
);

// Rate Limit Middleware

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too Many Requests from this IP',
});

app.use(cookieParser());

app.use(helmet());
app.use(morgan('common'));

app.use('/api/users', userRoute);
app.use('/api/auth', limiter, authRoute);
app.use('/api/posts', postRoute);
app.use('/api/conversations', conversationRoute);
app.use('/api/messages', messageRoute);

app.listen(8800, () => {
  console.log('Backend Server Is Running');
});
