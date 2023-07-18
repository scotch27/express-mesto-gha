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
    validate: {
      validator(v) {
        const regex = URL_REGEXP;
        const str = v;
        console.log(regex);
        console.log(str);
        return regex.test(str);
      },
      message: 'Укажите ссылку на изображенин',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
