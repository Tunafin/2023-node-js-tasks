import { Model, Schema, SchemaDefinition, SchemaDefinitionType, model } from 'mongoose';

require('./users.model'); // 必須載入，否則會找不到users

export interface IPost {
  user: Schema.Types.ObjectId;
  tags: string[];
  type: 'public' | 'private';
  content: string;
  image?: string;
  createdAt?: Date;
  likes?: number;
  comments?: number;
}

const definition: SchemaDefinition = {
  user: {
    type: Schema.Types.ObjectId,
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
  content: {
    type: String,
    required: [true, '貼文內容未填寫'],
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

/**
 * 由於Schema的結構複雜，建立新Schema若使用自動型別推斷會導致效能大幅降低，
 * 故此處直接指定型別為Schema並給定泛型參數<IPost>
 */
const postsSchema: Schema<IPost> = new Schema(definition, options);

export const PostsModel = model('posts', postsSchema);
