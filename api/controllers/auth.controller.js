import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password || username === '' || email === '' || password === '') {
    next(errorHandler(400, 'All fields are required'));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json('Signup successful');
  } catch (error) {
    next(error);
  }
}

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === '' || password === '') {
    next(errorHandler(400, 'All fields are required'));
  }
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      next(errorHandler(404, 'User not found'));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password); // valid the right password by isung bscryptjs compare sync
    if (!validPassword) {
      next(errorHandler(404, 'Invalid password'));
    }
    const token = jwt.sign({ id: validUser._id},process.env.JWT_SECRET); // can hieu hơn chỗ này, authenticate user để làm gì?
    res.status(200).cookie('access_token', token, { // cookie chỗ này đóng vai trò gì
      httpOnly: true}).json('Signin successul');
  } catch (error) {
    next(error);
  }
}
