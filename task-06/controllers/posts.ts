import { NextFunction, Request, Response } from 'express';

import handleSuccess from '../services/handleSuccess';
import { handleAppError } from '../services/appError';
import { IPost, PostsModel } from '../models/posts.model';

const posts = {
  async getPosts(req: Request, res: Response, next: NextFunction) {
    const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt";
    const q = req.query.q !== undefined ? { "content": new RegExp(req.query.q.toString()) } : {};
    const allPosts: IPost[] = await PostsModel.find(q).populate({
      path: 'user',
      select: 'name photo'
    }).sort(timeSort);
    handleSuccess(res, allPosts);
  },
  async createPost(req: Request, res: Response, next: NextFunction) {
    const { body } = req;
    if (body) {
      const newPost: IPost = await PostsModel.create({
        user: body.user,
        content: body.content,
        tags: body.tags,
        type: body.type,
      });
      handleSuccess(res, newPost);
    } else {
      handleAppError(400, 'Request格式錯誤', next);
    }
  },
  async patchPost(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { body } = req;
    if (body) {
      const updatedPost: IPost | null = await PostsModel.findByIdAndUpdate(id, {
        $set: {
          name: body.name,
          content: body.content,
          tags: body.tags,
          type: body.type,
        }
      }, { new: true });
      if (updatedPost) {
        handleSuccess(res, updatedPost);
      } else {
        handleAppError(400, 'Request格式錯誤', next);
      }
    } else {
      handleAppError(400, 'Request格式錯誤', next);
    }
  },
  async deletePost(req: Request, res: Response) {
    const { id } = req.params;
    await PostsModel.findByIdAndDelete(id);
    handleSuccess(res);
  },
  async deletePostAll(req: Request, res: Response) {
    await PostsModel.deleteMany({});
    handleSuccess(res);
  }
}

export default posts;
