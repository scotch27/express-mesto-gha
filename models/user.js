const mongoose = require('mongoose');
const { URL_REGEXP } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return URL_REGEXP;
      },
      message: (value) => `${value} Укажите коректный адрес URL.`,
    },
  },
});

module.exports = mongoose.model('user', userSchema);
