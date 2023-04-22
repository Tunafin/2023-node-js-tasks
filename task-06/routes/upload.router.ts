import express from 'express';

import { isAuth } from '../services/auth';
import handleErrorAsync from "../services/handleErrorAsync";
import upload from '../controllers/upload';
import checkImage from '../services/image';

const router = express.Router();

router.post('/file', /*isAuth,*/ checkImage, handleErrorAsync(upload.uploadFiles));

export default router;
