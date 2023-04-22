import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

// services
import { AppError } from './services/appError';
import { resErrorDev, resErrorProd } from './services/handleResError';

// router
import usersRouter from './routes/users.router';
import postsRouter from './routes/posts.router';
import uploadRouter from './routes/upload.router';

const app = express();

require('./connections');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/upload', uploadRouter)


app.use(function (req, res, next) {
  res.status(404).json({
    status: "false",
    message: "您的路由不存在"
  })
})

// 補捉程式錯誤
process.on('uncaughtException', err => {
  console.error('Uncaughted Exception!')
  console.error(err);
  process.exit(1);
});

// 補捉未處理的 catch
process.on('unhandledRejection', (error: Error, promise) => {
  console.error('未捕捉到的 rejection，原因：', error.message);
});

// 處理所有的next(error)
app.use(function (oriErr: AppError | Error, req: Request, res: Response, next: NextFunction) {
  let err = new AppError(oriErr.message);
  Object.assign(err, oriErr)

  // dev
  if (process.env.NODE_ENV === 'dev') {
    return resErrorDev(err, res);
  }
  // production
  else {
    if (err.name === 'ValidationError') {
      err.message = "資料欄位未填寫正確，請重新輸入！"
      err.isOperational = true;
    }
    return resErrorProd(err, res);
  }
})

module.exports = app;
// export default app;
