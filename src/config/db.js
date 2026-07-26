// This file is responsible for connecting our app to MongoDB using Mongoose.

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Mongoose 7+ no longer needs extra options like useNewUrlParser,
    // but we keep the call simple and clean.
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // If the database connection fails, there is no point running the app.
    process.exit(1);
  }
};

module.exports = connectDB;
