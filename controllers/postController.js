import mongoose from 'mongoose';

import Post from '../models/postModel.js';

import createError from '../utils/createError.js';

export const createPost = async (req, res, next) => {
  try {
    const newPost = new Post({
      ...req.body,
      postedBy: req.user.id,
    });

    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('postedBy', '_id fullname username pic')
      .populate({
        path: 'comments',
        select: '_id comment commentBy',
        populate: {
          path: 'commentBy',
          select: '_id fullname username pic',
        },
      });

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('postedBy', '_id fullname username pic')
      .populate({
        path: 'comments',
        select: '_id comment commentBy',
        populate: {
          path: 'commentBy',
          select: '_id fullname username pic',
        },
      });
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const getMyPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ postedBy: req.user._id })
      .sort({
        createdAt: -1,
      })
      .populate('postedBy', '_id fullname username pic')
      .populate({
        path: 'comments',
        select: '_id comment commentBy',
        populate: {
          path: 'commentBy',
          select: '_id fullname username pic',
        },
      });

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const getTopPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ likes: -1, comments: -1 }).limit(5);

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return next(createError(404, 'Id tidak valid!'));

  try {
    const post = await Post.findById(id).populate('postedBy', 'username');
    if (req.user.username === post.postedBy.username) {
      const post = await Post.findByIdAndUpdate(id, req.body, { new: true });

      res.status(200).json(post);
    } else {
      next(createError(403, 'You are not authorized'));
    }
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return next(createError(404, 'Id tidak valid!'));

  try {
    const post = await Post.findById(id).populate('postedBy', 'username');
    if (req.user.username === post.postedBy.username) {
      await Post.findByIdAndDelete(id);

      res.status(200).json({ message: 'Success delete post!' });
    } else {
      next(createError(403, 'You are not authorized'));
    }
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return next(createError(404, 'Id tidak valid!'));

  try {
    const post = await Post.findById(id);
    const isLike = post.likes.some(
      (like) => like.toString() === req.user._id.toString()
    );
    if (isLike) {
      await Post.findByIdAndUpdate(
        id,
        { $pull: { likes: req.user._id } },
        { new: true }
      );

      res.status(200).json({ message: 'Success unlike post!' });
    } else {
      await Post.findByIdAndUpdate(
        id,
        { $push: { likes: req.user._id } },
        { new: true }
      );

      res.status(200).json({ message: 'Success like post!' });
    }
  } catch (error) {
    next(error);
  }
};
