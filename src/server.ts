/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import songRoutes from './routes/song.routes';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middleware/error.middleware';
import { connectDb } from './db/mongoose';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import logger from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDb();

// app.use(cors())
app.use(express.json());
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

app.use('/api', limiter);
app.use('/api/', helmet());

//routes
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);

app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () =>
    console.log(`Server dancing on port: http://localhost:${PORT}`)
  );
});
mongoose.connection.on('error', (err) => {
  console.log(err);
  logger.error(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    'mongoErrLog.log'
  );
});

