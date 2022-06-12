import mongoose from 'mongoose';

import User from '../models/userModel.js';

import createError from '../utils/createError.js';

export const getUsers = async (req, res, next) => {
  const keyword = req.query.username
    ? {
        username: {
          $regex: req.query.username,
          $options: 'i',
        },
      }
    : {};
  try {
    const users = await User.find({ ...keyword }).select(
      '_id fullname username pic'
    );

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password -isAdmin -savedPosts')
      .populate('followers following', 'username fullname pic');

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUserLogin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -isAdmin')
      .populate({
        path: 'savedPosts',
        populate: { path: 'postedBy', select: '_id username fullname pic' },
      })
      .populate({
        path: 'savedPosts',
        populate: {
          path: 'comments',
          select: '_id comment commentBy',
          populate: {
            path: 'commentBy',
            select: '_id fullname username pic',
          },
        },
      })
      .populate('followers following', 'username fullname pic');

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    // const { password, ...others } = req.body;
    // if (!password) return next(createError(400, 'Password wajib diisi!'));
    // const user = await User.findById(req.user._id);
    // const checkPassword = await bcrypt.compare(password, user.password);
    // if (!checkPassword) return next(createError(400, 'Password salah!'));

    const userUpdated = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    });
    res.status(200).json(userUpdated);
  } catch (error) {
    next(error);
  }
};
export const followUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    const isFollow = user.followers.some(
      (follow) => follow.toString() === req.user._id.toString()
    );

    if (isFollow) {
      await User.findByIdAndUpdate(
        id,
        { $pull: { followers: req.user._id } },
        { new: true }
      );

      await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { following: id } },
        { new: true }
      );

      res.status(200).json({
        message: `Success unfollow ${id}`,
      });
    } else {
      await User.findByIdAndUpdate(
        id,
        { $push: { followers: req.user._id } },
        { new: true }
      );

      await User.findByIdAndUpdate(
        req.user._id,
        { $push: { following: id } },
        { new: true }
      );

      res.status(200).json({
        message: `Success follow ${id}`,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const unfollowUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    await User.findByIdAndUpdate(
      id,
      { $pull: { followers: req.user._id } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { following: id } },
      { new: true }
    );

    res.status(200).json({
      message: `Success unfollow ${id}`,
    });
  } catch (error) {
    next(error);
  }
};

export const savePost = async (req, res, next) => {
  const { postId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(postId))
    return next(createError(404, 'PostId tidak valid!'));

  try {
    const user = await User.findById(req.user._id);
    const isSave = user.savedPosts.some(
      (post) => post.toString() === postId.toString()
    );
    if (isSave) {
      await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { savedPosts: postId } },
        { new: true }
      );

      res.status(200).json({ message: 'Success unsave post!' });
    } else {
      await User.findByIdAndUpdate(
        req.user._id,
        { $push: { savedPosts: postId } },
        { new: true }
      );

      res.status(200).json({ message: 'Success save post!' });
    }
  } catch (error) {
    next(error);
  }
};
