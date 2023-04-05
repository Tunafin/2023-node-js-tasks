const mongoose = require('mongoose');
const postsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '貼文姓名未填寫']
  },
  tags: [
    {
      type: String,
      required: [true, '貼文標籤未填寫']
    }
  ],
  type: {
    type: String,
    enum: ['public', 'private'],
    required: [true, '貼文類型未填寫']
  },
  image: {
    type: String,
    default: ""
  },
  createAt: {
    type: Date,
    default: Date.now,
    select: false
  },
  content: {
    type: String,
    required: [true, '貼文內容未填寫'],
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: {
    type: Number,
    default: 0
  },
});

const posts = mongoose.model(
  'posts',
  postsSchema
);

module.exports = posts;
