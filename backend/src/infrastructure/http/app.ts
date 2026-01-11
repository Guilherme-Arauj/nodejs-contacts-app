import dotenv from "dotenv";
dotenv.config();
import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app: Application = express();

// Set HTTP headers
// app.use(helmet());

// Middleware para permitir requisições de diferentes origens
app.use(cors({
  origin: "*",
  credentials: true
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

export default app;
