import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import validator from 'validator';

import handleSuccess from '../services/handleSuccess';
import { handleAppError } from '../services/appError';
import { generateSendJWT } from '../services/auth';
import { UsersModel } from '../models/users.model';

const users = {
  async signUp(req: Request, res: Response, next: NextFunction) {
    let { email, password, confirmPassword, name, sex } = req.body;
    // 內容不可為空
    if (!email || !password || !confirmPassword || !name) {
      return next(handleAppError(400, "欄位未填寫正確！", next));
    }
    // 密碼正確
    if (password !== confirmPassword) {
      return next(handleAppError(400, "密碼不一致！", next));
    }
    // 密碼 8 碼以上
    if (!validator.isLength(password, { min: 8 })) {
      return next(handleAppError(400, "密碼字數低於 8 碼", next));
    }
    // 是否為 Email
    if (!validator.isEmail(email)) {
      return next(handleAppError(400, "Email 格式不正確", next));
    }

    // 加密密碼
    password = await bcrypt.hash(req.body.password, 12);
    const newUser = await UsersModel.create({
      email,
      password,
      name,
      sex
    });
    generateSendJWT(newUser, 201, res);
  },

  async signIn(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(handleAppError(400, '帳號密碼不可為空', next));
    }
    const user = await UsersModel.findOne({ email }).select('+password');
    if (!user) {
      return next(handleAppError(400, '查無此帳號', next));
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return next(handleAppError(400, '您的密碼不正確', next));
    }
    generateSendJWT(user, 200, res);
  },

  async updatePassword(req: Request, res: Response, next: NextFunction) {
    const { password, confirmPassword } = req.body;

    if (!password) {
      return next(handleAppError(400, "未輸入密碼！", next));
    }

    if (password !== confirmPassword) {
      return next(handleAppError(400, "密碼不一致！", next));
    }
    const newPassword = await bcrypt.hash(password, 12);

    const user = await UsersModel.findByIdAndUpdate(req.body.currentUser.id, {
      password: newPassword
    });

    if (!user) {
      return next(handleAppError(400, "查無此帳號", next));
    }

    handleSuccess(res, user);

    // 先不產生新token。ru; 之後有空再研究如何清除舊token
    // generateSendJWT(user, 200, res)
  },

  async getProfile(req: Request, res: Response, next: NextFunction) {
    handleSuccess(res, req.body.currentUser);
  },

  async patchProfile(req: Request, res: Response, next: NextFunction) {
    const { body } = req;

    const user = await UsersModel.findByIdAndUpdate(body.currentUser.id, {
      name: body.name,
      // email: body.email,
      // photo?: undefined,
    }, { new: true });

    if (!user) {
      return next(handleAppError(400, "查無此帳號", next));
    }

    handleSuccess(res, user);
  },
}


export default users;
