import dotenv from "dotenv";

dotenv.config();

export default {
  PORT: process.env.PORT || 3001,
  URL_MONGODB: process.env.URL_MONGODB || "mongodb://localhost:27017/finalbe2",
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
};
