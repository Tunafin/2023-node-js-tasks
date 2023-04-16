import { Response } from 'express';

function handleSuccess(res: Response, data?: any): void {
  res.status(200).send({
    status: true,
    data,
  }).end();
}

export default handleSuccess;
