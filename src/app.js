import express from "express";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config/config.js";
import userRouter from "./routes/user.router.js";
import sessionRouter from "./routes/session.router.js";
import cartRouter from "./routes/cart.router.js";
import productRouter from "./routes/products.router.js";
import ticketRouter from "./routes/tickets.router.js";
import { initializePassport } from "./passport/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import logger, { httpLoggerMiddleware } from "./utils/logger.js";

const app = express();

app.use(httpLoggerMiddleware);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(config.COOKIE_SECRET));

app.use(
  session({
    secret: config.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000, // 1 hora
      httpOnly: true,
    },
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/sessions", sessionRouter);
app.use("/api/users", userRouter);
app.use("/api/carts", cartRouter);
app.use("/api/products", productRouter);
app.use("/api/tickets", ticketRouter);

app.use(errorHandler);

export default app;
