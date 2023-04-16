import { NextFunction, Request, Response } from 'express';

type Func = (req: Request, res: Response, next: NextFunction) => Promise<void>;

/**
 * 包裝目標非同步函式，使其可以處理非預期或未自定義的錯誤
 */
function handleErrorAsync(func: Func): Func {
  return (req: Request, res: Response, next: NextFunction) => {
    return func(req, res, next).catch((error: Error) => next(error));
  };
};

export default handleErrorAsync;
