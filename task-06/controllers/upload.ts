import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { GetSignedUrlConfig } from '@google-cloud/storage';

import firebaseAdmin from '../services/firebase';
import { handleAppError } from '../services/appError';

const bucket = firebaseAdmin.storage().bucket();

const upload = {
  async uploadFiles(req: Request, res: Response, next: NextFunction) {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files?.length) {
      return handleAppError(400, "尚未上傳檔案", next);
    }
    // 取得上傳的檔案資訊列表裡面的第一個檔案
    const file = files[0];
    // 基於檔案的原始名稱建立一個 blob 物件
    const blob = bucket.file(`images/${uuidv4()}.${file.originalname.split('.').pop()}`);
    // 建立一個可以寫入 blob 的物件
    const blobStream = blob.createWriteStream()

    // 監聽上傳狀態，當上傳完成時，會觸發 finish 事件
    blobStream.on('finish', () => {
      // 設定檔案的存取權限
      const config: GetSignedUrlConfig = {
        action: 'read', // 權限
        expires: '12-31-2500', // 網址的有效期限
      };
      // 取得檔案的網址
      blob.getSignedUrl(config, (err, fileUrl) => {
        res.send({
          fileUrl
        });
      });
    });

    // 如果上傳過程中發生錯誤，會觸發 error 事件
    blobStream.on('error', (err) => {
      res.status(500).send('上傳失敗');
    });

    // 將檔案的 buffer 寫入 blobStream
    blobStream.end(file.buffer);


    // res.status(200).json({
    //     status:"success",
    //     imgUrl: response.data.link
    // })
  }
}

export default upload;

// 範例程式碼，參考用
// router.post('/', isAuth, upload, handleErrorAsync(async (req, res, next) => {
//   if (!req.files?.length) {
//     return next(handleAppError(400, "尚未上傳檔案", next));
//   }
//   const dimensions = sizeOf(req.files[0].buffer);
//   if (dimensions.width !== dimensions.height) {
//     return next(handleAppError(400, "圖片長寬不符合 1:1 尺寸。", next))
//   }
//   const client = new ImgurClient({
//     clientId: process.env.IMGUR_CLIENTID,
//     clientSecret: process.env.IMGUR_CLIENT_SECRET,
//     refreshToken: process.env.IMGUR_REFRESH_TOKEN,
//   });
//   const response = await client.upload({
//     image: req.files[0].buffer.toString('base64'),
//     type: 'base64',
//     album: process.env.IMGUR_ALBUM_ID
//   });
//   res.status(200).json({
//     status: "success",
//     imgUrl: response.data.link
//   })
// }));
