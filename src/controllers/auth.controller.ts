import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { loginUserSchema, userSchema } from '../utils/validator';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../config';
import { IUser } from '../interfaces/user.interface';

const generateAccessToken = (user: { _id: string; email: string }): string => {
  return jwt.sign(
    { userId: user._id, email: user.email },
    ACCESS_TOKEN_SECRET!,
    {
      expiresIn: '1h',
    }
  );
};

const generateRefreshToken = (user: { _id: string; email: string }): string => {
  return jwt.sign(
    { userId: user._id, email: user.email },
    REFRESH_TOKEN_SECRET!,
    {
      expiresIn: '7d',
    }
  );
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const validationResult = userSchema.validate(req.body);

    if (validationResult.error) {
      return res.status(400).json({ error: validationResult.error.message });
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const userObject: Omit<IUser, 'password'> = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    res.status(201).json({ message: 'Created User: ', userObject });
  } catch (error) {
    console.error('Error registering user:', (error as Error).message);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const validationResult = loginUserSchema.validate(req.body);

    if (validationResult.error) {
      return res.status(400).json({ error: validationResult.error.message });
    }

    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error('Error logging in:', (error as Error).message);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const refresh = (req: Request, res: Response) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.refreshToken)
      return res.status(401).json({ message: 'Unauthorized' });

    const refreshToken = cookies.refreshToken;

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);

    const user = decoded as { _id: string; email: string };

    const accessToken = generateAccessToken(user);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.json({ accessToken });
  } catch (error) {
    console.error('Error refreshing token:', (error as Error).message);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

export const logOut = async (req: Request, res: Response) => {
  try {
    res.clearCookie('accessToken', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.json({ message: 'User logged out' });
  } catch (error) {
    console.error('Error:', (error as Error).message);
    res.status(500).json({ error: (error as Error).message });
  }
};

