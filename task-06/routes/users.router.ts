import express from 'express';

import users from '../controllers/users';
import handleErrorAsync from '../services/handleErrorAsync';
import { isAuth } from '../services/auth';

const router = express.Router();

router.post('/sign_up', handleErrorAsync(users.signUp));
router.post('/sign_in', handleErrorAsync(users.signIn));
router.post('/update_password', isAuth, handleErrorAsync(users.updatePassword));
router.get('/profile', isAuth, handleErrorAsync(users.getProfile));
router.patch('/profile', isAuth, handleErrorAsync(users.patchProfile));

export default router;

// POST：{url}/users/sign_up：註冊
// POST：{url}/users/sign_in：登入
// POST：{url}/users/updatePassword: 重設密碼，需設計 isAuth middleware
// GET：{url}/users/profile: 取得個人資料，需設計 isAuth middleware
// PATCH：{url}/users/profile: 更新個人資料，需設計 isAuth middleware
