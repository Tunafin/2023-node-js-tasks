import { NextFunction } from 'express';

class AppError extends Error {
  statusCode = 500;
  isOperational = true;

  constructor(message: string) {
    super(message);
  }
}

/**
 * 處理可預期的自定義錯誤
 *
 * @param {number} statusCode HTTP狀態碼
 * @param {string} message: 錯誤訊息
 * @param {NextFunction} next
 */
function handleAppError(statusCode: number, message: string, next: NextFunction) {
  const appError = new AppError(message);
  appError.statusCode = statusCode;
  appError.isOperational = true;
  next(appError);
}

export { AppError, handleAppError }
