const mongoose = require('mongoose');
const { URL_REGEXP } = require('../utils/constants');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        const regex = URL_REGEXP;
        const str = v;
        return regex.test(str);
      },
      message: 'Укажите ссылку на изображенин',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
},
{
  versionKey: false,
},
);

module.exports = mongoose.model('card', cardSchema);
