const mongoose = require('mongoose');
require('./users.model');

const definition = {
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "users", // 對應 mongoose.model('users', usersSchema) 的 'users'
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
  createdAt: {
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
};

const options = { versionKey: false /** ,collection: 'posts' */ };

const postsSchema = new mongoose.Schema(definition, options);

/** 
 * mongoose.model的第一個參數會被自動轉換，需特別注意。
 * 例: MyCollection => mycollections
 * 
 * 若不想被轉換，可在new mongoose.Schema(definition, options)的options中設定collection名稱
 */
module.exports = mongoose.model('posts', postsSchema);
