import bcrypt from 'bcrypt';
import createHttpError from 'http-errors'; 
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js'; 
import { FIFTEEN_MINUTES, ONE_DAY, HTTP_STATUS } from '../constants/index.js'; 


const { JWT_SECRET } = process.env;

export const register = async (body) => {
  const { name, email, password } = body;

  const existingUser = await UsersCollection.findOne({ email });
  if (existingUser) {
    
    throw createHttpError(HTTP_STATUS.CONFLICT, 'Email already in use');
  }

  const newUser = await UsersCollection.create({ name, email, password });

  const payload = { id: newUser._id };

 
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });


  await SessionsCollection.create({
    userId: newUser._id,
    accessToken: accessToken,
    refreshToken: refreshToken,
   accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY * 7),
  });

 
  return {
    accessToken,
    refreshToken,
    user: newUser,   };
};

///////////////////////////////////////////////////////////////////////////////
export async function loginUser(email, password) {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid email or password');
  }
  const accessToken = crypto.randomBytes(32).toString('base64');
  const refreshToken = crypto.randomBytes(32).toString('base64');
  const accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES);
  const refreshTokenValidUntil = new Date(Date.now() + ONE_DAY * 7);

  const session = await SessionsCollection.create({
    userId: user._id,
    accessToken,
    accessTokenValidUntil,
    refreshToken,
    refreshTokenValidUntil,
  });

  return session;
}
///////////////////////////////////////////////////////////////////////////////

export const logout = async (accessToken) => {
 
  await SessionsCollection.deleteOne({ accessToken: accessToken });
};
