const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/users');
const cards = require('./routes/cards');
const NotFoundError = require('./utils/errors/notFoundError');
const errorsHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');
// mongoose.connect('mongodb://localhost:27017/mestodb', {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
// });

app.use((req, res, next) => {
  req.user = {
    _id: '64b4023da9912b2f678102df', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

// подключаем мидлвары, роуты и всё остальное...
app.use('/', users);
app.use('/', cards);
app.use('*', () => {
  console.log('any adsress');
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});
app.use(errorsHandler);

app.listen(3000);
