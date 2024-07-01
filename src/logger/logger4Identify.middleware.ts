import { NextFunction } from 'express';

export function Logger4IdentifyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(`===REQUEST ARRIVED ${Date.now()} ===`);
  next();
}
