import app from "./app.js";
import config from "./config/config.js";
import connectDB from "./config/db.config.js";

const startServer = async () => {
  await connectDB();

  app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
  });
};

startServer();
