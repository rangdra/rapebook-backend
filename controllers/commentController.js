import Comment from '../models/commentModel.js';
import Post from '../models/postModel.js';

import createError from '../utils/createError.js';

export const createComment = async (req, res, next) => {
  try {
    const newComment = new Comment({
      comment: req.body.comment,
      commentBy: req.user._id,
      post: req.params.postId,
    });

    await Post.findByIdAndUpdate(
      req.params.postId,
      { $push: { comments: newComment._id } },
      { new: true }
    );

    await newComment.save();

    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  const { commentId } = req.params;
  try {
    const comment = await Comment.findById(commentId).populate(
      'commentBy',
      '_id'
    );

    if (req.user._id.toString() === comment.commentBy._id.toString()) {
      await Comment.findByIdAndDelete(commentId);

      await Post.findByIdAndUpdate(
        comment.post,
        { $pull: { comments: commentId } },
        { new: true }
      );

      res.status(200).json({ message: 'Success delete comment!' });
    } else {
      return next(createError(403, 'You are not authorized'));
    }
  } catch (error) {
    next(error);
  }
};
