const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Remove deprecated options and add new recommended ones
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
      maxPoolSize: 10, // Maximum number of connections
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip IPv6
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Enhanced connection event listeners
    const connection = mongoose.connection;
    
    connection.on('connected', () => {
      console.log('Mongoose connected to DB');
    });

    connection.on('error', (err) => {
      console.error(`Mongoose connection error: ${err.message}`);
      // Consider implementing reconnect logic here
    });

    connection.on('disconnected', () => {
      console.warn('Mongoose disconnected from DB');
      // Optional: Implement reconnection logic
    });

    // Close connection on app termination
    const gracefulShutdown = async (signal) => {
      try {
        await connection.close();
        console.log(`Mongoose connection closed due to ${signal} termination`);
        process.exit(0);
      } catch (err) {
        console.error(`Error during shutdown: ${err.message}`);
        process.exit(1);
      }
    };

    // Handle different termination signals
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

    return connection;

  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    // Consider implementing retry logic here for production
    process.exit(1);
  }
};

module.exports = connectDB;