import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../config/index';
import userModel from '../models/user.model';
import { RequestWithUser } from '../interfaces/auth.interface';

export const authenticate = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Token not provided' });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = jwt.verify(token, ACCESS_TOKEN_SECRET as string);
    if (!decoded) return res.status(403).json({ message: 'Forbidden' });

    const userId = decoded.userId as string;

    const findUser = await userModel.findById(userId);

    if (!findUser) {
      return res.status(401).json({ error: 'Unauthorized - User not found' });
    }

    req.user = findUser;
    next();
  } catch (error) {
    console.error('error: ', error);
    res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

