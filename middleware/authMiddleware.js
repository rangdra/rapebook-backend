import jwt from 'jsonwebtoken';

import User from '../models/userModel.js';

import createError from '../utils/createError.js';

export const verifyToken = (req, res, next) => {
  let token;
  if (
    !req.headers.authorization &&
    !req.headers.authorization.startsWith('Bearer')
  )
    return next(createError(401, 'You are not authenticated'));

  token = req.headers.authorization.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return next(createError(403, 'Token is not valid'));

    req.user = await User.findById(decoded.id)
      .select('-password -isAdmin')
      .populate({
        path: 'savedPosts',
        populate: { path: 'postedBy', select: '_id username fullname pic' },
      })
      .populate('followers following', 'username fullname pic email');
    next();
  });
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user._id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, 'You are not authorized'));
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, 'You are not authorized'));
    }
  });
};
