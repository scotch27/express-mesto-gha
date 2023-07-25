const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { celebrate, Joi, errors } = require('celebrate');
const users = require('./routes/users');
const cards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./utils/errors/notFoundError');
const errorsHandler = require('./middlewares/errorHandler');
const auth = require('./middlewares/auth');
const { URL_REGEXP } = require('./utils/constants');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());

// подключаемся к серверу mongo
mongoose.connect(DB_URL);

// подключаем мидлвары, роуты и всё остальное...
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    avatar: Joi.string().regex(URL_REGEXP),
  }),
}), createUser);

app.use(auth);
app.use('/', users);
app.use('/', cards);
app.use('*', () => {
  console.log('any adsress');
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});
app.use(errors());
app.use(errorsHandler);

app.listen(PORT);
