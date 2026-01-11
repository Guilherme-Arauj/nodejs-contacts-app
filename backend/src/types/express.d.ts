import { Session } from 'express-session';

declare global {
  namespace Express {
    interface Request {
      session: Session & Partial<Session.SessionData>;
      user?: import("../domain/entities/User").User;  
      t: (key: string, options?: Record<string, any>) => string;
    }
  }
}

export {};