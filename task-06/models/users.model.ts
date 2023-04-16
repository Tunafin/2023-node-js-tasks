import { Schema, SchemaDefinition, model } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  photo?: string;
  sex: Sex;
  password: string;
  createdAt: Date;
}

enum Sex {
  Male = 'male',
  Female = 'female'
}

const definition: SchemaDefinition<IUser> = {
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
  sex: {
    type: String,
    enum: Sex
  },
  password: {
    type: String,
    required: [true, '請輸入密碼'],
    minlength: 8,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false
  }
};

const options = { versionKey: false };

const usersSchema: Schema<IUser> = new Schema(definition, options);

export const UsersModel = model('users', usersSchema);
