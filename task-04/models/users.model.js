const mongoose = require('mongoose');

const definition = {
  name: {
    type: String,
    required: [true, '請輸入您的名字']
  },
  email: {
    type: String,
    required: [true, '請輸入您的 Email'],
    unique: true,
    lowercase: true,
    select: false
  },
  photo: String,
};

const options = { versionKey: false };

const usersSchema = new mongoose.Schema(definition, options);

module.exports = mongoose.model('users', usersSchema);
