import { Request, Response, NextFunction } from 'express';

export const validate = (_schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    next();
  };
};