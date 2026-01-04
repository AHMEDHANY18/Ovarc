import { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ message: 'CSV file is too large' });
    }
    return res.status(400).json({ message: err.message });
  }

  console.error(err);
  return res.status(500).json({ message: 'Failed to upload inventory' });
}
