import dotenv from "dotenv";
dotenv.config();
import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { i18nMiddleware } from "./middlewares/i18nMiddleware.js";
import { userRouter } from "./routes/routes.js";

const app: Application = express();

// Set HTTP headers
// app.use(helmet());

// Middleware para permitir requisições de diferentes origens
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

// // Limite de requests por IP
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000, // 1 hora
//   message: 'Too many requests from this IP, please try again in an hour'
// });

// Logs e body parser
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(i18nMiddleware);

// Rotas
app.use(userRouter);

export default app;
