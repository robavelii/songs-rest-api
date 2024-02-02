import express from 'express';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
// import songRoutes from './routes/song-routes';
// import authRoutes from './routes/auth-routes';
import { errorHandler } from './middleware/error-middleware';
import { connectToDatabase, closeDatabaseConnection } from './db/mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const startServer = async () => {
  try {
    await connectToDatabase(process.env.MONGODB_URI || '');

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
    });

    app.use(limiter);
    app.use(helmet());

    //routes
    // app.use('/songs', song-routes);
    // app.use('/auth', auth-routes);
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Failed to start the server:', error.message);
  }
};

// Close the MongoDB connection when the app exits
process.on('SIGINT', async () => {
  await closeDatabaseConnection();
  process.exit(0);
});

startServer();

