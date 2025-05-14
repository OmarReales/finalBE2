import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.URL_MONGODB);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
