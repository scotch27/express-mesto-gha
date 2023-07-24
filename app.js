const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const users = require('./routes/users');
const cards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./utils/errors/notFoundError');
const errorsHandler = require('./middlewares/errorHandler');
const auth = require('./middlewares/auth');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());

// подключаемся к серверу mongo
mongoose.connect(DB_URL);
// mongoose.connect('mongodb://localhost:27017/mestodb', {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
// });

// app.use((req, res, next) => {
//   req.user = {
//     _id: '64b4023da9912b2f678102df', // вставьте сюда _id созданного в предыдущем пункте пользователя
//   };

//   next();
// });

// подключаем мидлвары, роуты и всё остальное...
app.use(auth);
app.use('/', users);
app.use('/', cards);
app.post('/signin', login);
app.post('/signup', createUser);
app.use('*', () => {
  console.log('any adsress');
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});
app.use(errorsHandler);

app.listen(PORT);
