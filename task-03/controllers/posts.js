const handleSuccess = require('../services/handleSuccess');
const handleError = require('../services/handleError');
const PostsModel = require('../models/posts.model');

const posts = {
  async getPosts(req, res) {
    const allPosts = await PostsModel.find();
    handleSuccess(res, allPosts);
  },
  async createPost(req, res) {
    try {
      const { body } = req;

      if (body) {
        const newPost = await PostsModel.create({
          name: body.name,
          content: body.content,
          tags: body.tags,
          type: body.type,
        });
        handleSuccess(res, newPost);
      } else {
        handleError(res);
      }
    } catch (error) {
      handleError(res, error);
    }
  },
  async patchPost(req, res) {
    try {
      const { id } = req.params;
      const { body } = req;

      if (body) {
        const newPost = await PostsModel.findByIdAndUpdate(id, {
          $set: {
            name: body.name,
            content: body.content,
            tags: body.tags,
            type: body.type,
          }
        }, { new: true });
        handleSuccess(res, newPost);
      } else {
        handleError(res);
      }
    } catch (error) {
      handleError(res, error);
    }
  },
  async deletePost(req, res) {
    try {
      const { id } = req.params;
      await PostsModel.findByIdAndDelete(id);
      handleSuccess(res);
    } catch (error) {
      handleError(res, error);
    }
  },
  async deletePostAll(req, res) {
    await PostsModel.deleteMany({});
    handleSuccess(res);
  }
}

module.exports = posts;
