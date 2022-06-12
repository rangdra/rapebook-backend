import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/userModel.js';

import createError from '../utils/createError.js';
import validation from '../utils/validation.js';

export const register = async (req, res, next) => {
  const { fullname, username, password } = req.body;

  try {
    let newUsername = username && username.replace(/ /g, '').toLowerCase();

    const error = validation(fullname, newUsername, password);
    if (error) return next(createError(400, error));

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const newUser = new User({
      ...req.body,
      username: newUsername,
      password: hashPassword,
    });

    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    }).populate('followers following', 'username fullname pic');

    if (!user) return next(createError(404, 'User tidak ditemukan!'));

    const checkPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!checkPassword) return next(createError(400, 'Password salah!'));

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    const { password, isAdmin, ...others } = user._doc;

    res.status(200).json({ ...others, token });
  } catch (error) {
    next(error);
  }
};
