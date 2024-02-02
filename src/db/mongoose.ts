import mongoose, { Connection } from 'mongoose';

let connection: Connection | null = null;

export const connectToDatabase = async (uri: string): Promise<Connection> => {
  if (connection) {
    return connection;
  }

  try {
    connection = await mongoose.createConnection(uri).asPromise();

    console.log('Connected to MongoDB');
    return connection;
  } catch (error) {
    console.error('Error connecting to MongoDB:', (error as Error).message);
    throw error;
  }
};

export const closeDatabaseConnection = async (): Promise<void> => {
  if (connection) {
    await connection.close();
    console.log('Disconnected from MongoDB');
  }
};

