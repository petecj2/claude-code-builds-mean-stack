const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '../.env' });

let db;
let client;

const connectDB = async () => {
  try {
    const connectionString = process.env.MONGODB_URI;
    
    if (!connectionString) {
      throw new Error('MongoDB connection string not found in environment variables');
    }

    client = new MongoClient(connectionString, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await client.connect();
    db = client.db('sample_mflix');
    
    console.log('Connected to MongoDB - sample_mflix database');
    
    // Test the connection
    await db.admin().ping();
    console.log('MongoDB connection verified');
    
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
};

const closeDB = async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
};

module.exports = {
  connectDB,
  getDB,
  closeDB
};