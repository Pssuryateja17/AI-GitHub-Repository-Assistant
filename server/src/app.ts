import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.middleware';
import routes from './routes';

export function createApp(): Application {
  const app = express();

  app.use(helmet());

  app.use(
  cors({
    origin: [
      "https://ai-github-repository-assistant.vercel.app",
      "http://localhost:5173",
      "http://127.0.0.1:5173"
    ],
    credentials: true,
  })
);

  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'));

  app.use('/api', routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}