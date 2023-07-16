const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/users');
// const cards = require('./routes/cards');

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

// подключаем мидлвары, роуты и всё остальное...
app.use('/', users);
// app.use('/', cards);
app.use('/', (req, res) => {
  res.status(404).send({
    message: 'Запрашиваемый ресурс не найден',
  });
});

app.listen(3000);
