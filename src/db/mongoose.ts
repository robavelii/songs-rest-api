import mongoose from 'mongoose';
import { MONGO_URI } from '../config/index';

export const connectDb = async () => {
  try {
    await mongoose.connect(MONGO_URI as string);
  } catch (err) {
    console.log(err);
  }
};

