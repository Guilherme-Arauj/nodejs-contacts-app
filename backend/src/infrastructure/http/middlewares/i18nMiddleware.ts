import { Request, Response, NextFunction } from 'express';
import { getTranslation } from '../../i18n/index.js';

export function i18nMiddleware(req: Request, res: Response, next: NextFunction) {
  const langHeader = req.headers['accept-language'];
  const lang = typeof langHeader === 'string' && langHeader.startsWith('pt') ? 'pt' : 'en';
  req.t = getTranslation(lang);
  next();
}