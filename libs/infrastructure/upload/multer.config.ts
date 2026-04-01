import { diskStorage } from 'multer';
import { extname, resolve } from 'path';
import { existsSync, mkdirSync } from 'fs';

const UPLOAD_DIR = resolve(process.cwd(), 'uploads', 'documents');
if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const multerConfig = {
  storage: diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueName}${extname(file.originalname)}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/\/(pdf|jpg|jpeg|png)$/)) {
      return cb(new Error('Only PDF and images allowed'), false);
    }
    cb(null, true);
  },
};
