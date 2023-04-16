import express, { Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import handleErrorAsync from './handleErrorAsync';
import { handleAppError } from './appError';
import { IUser, UsersModel } from '../models/users.model';

export const isAuth = handleErrorAsync(async (req, res, next) => {
  // 確認 token 是否存在
  let token = '';
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return handleAppError(401, '你尚未登入！', next);
  }

  const secret = process.env.JWT_SECRET ?? '';

  // 驗證 token 正確性
  const decoded: JwtPayload = await new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, payload) => {
      if (err) {
        reject(err)
      } else {
        resolve(payload as JwtPayload)
      }
    })
  })

  const currentUser = await UsersModel.findById(decoded.id);

  // 透過此middleware取得tokon的userId，並添加在request上供後續使用
  req.body.currentUser = currentUser;
  next();
});

export const generateSendJWT = (user: IUser, statusCode: number, res: Response) => {

  const secret = process.env.JWT_SECRET ?? '';
  const expiresDay = process.env.JWT_EXPIRES_DAY;

  // 產生 JWT token
  // TODO 確認_id的型別來源
  const token = jwt.sign({ id: (user as any)._id }, secret, {
    expiresIn: expiresDay
  });
  user.password = '';
  res.status(statusCode).json({
    status: 'success',
    user: {
      token,
      name: user.name
    }
  });
}

module.exports = { isAuth, generateSendJWT }
