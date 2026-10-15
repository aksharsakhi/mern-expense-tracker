const mongoose = require('mongoose');

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://localhost:27017/expense_tracker_mern';
  const localUri = 'mongodb://localhost:27017/expense_tracker_mern';

  try {
    const conn = await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 5000 });
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.warn(`⚠️ Primary MongoDB connection failed: ${error.message}`);
    console.log(`🔄 Attempting fallback to local MongoDB instance...`);
    try {
      const fallbackConn = await mongoose.connect(localUri);
      console.log(`✅ Fallback Local MongoDB Connected: ${fallbackConn.connection.host}/${fallbackConn.connection.name}`);
    } catch (fallbackError) {
      console.error(`❌ MongoDB Fatal Connection Error: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
