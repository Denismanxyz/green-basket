const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer;
let connectionPromise;

const getMongoUri = async () => {
  if (!memoryServer) {
    memoryServer = await MongoMemoryServer.create();
  }
  return memoryServer.getUri();
};

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    const configuredUri = process.env.MONGO_URI;

    if (!configuredUri) {
      const fallbackUri = await getMongoUri();
      const conn = await mongoose.connect(fallbackUri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000
      });
      console.log(`MongoDB connected (fallback): ${conn.connection.host}`);
      return conn;
    }

    try {
      const conn = await mongoose.connect(configuredUri, {
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000
      });
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      throw new Error(`Failed to connect to configured MongoDB: ${error.message}`);
    }
  })();

  return connectionPromise;
};

module.exports = connectDB;
