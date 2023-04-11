import { Schema, SchemaDefinition, SchemaDefinitionType, model } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  photo?: string;
}

const definition: SchemaDefinition<SchemaDefinitionType<IUser>> = {
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

const usersSchema: Schema<IUser> = new Schema(definition, options);

export const UsersModel = model('users', usersSchema);
