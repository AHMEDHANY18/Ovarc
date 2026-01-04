import { Router } from 'express';
import { uploadInventoryController } from '../../controllers/inventory/upload.inventory.controller';
import { upload } from '../../utilities/storage/storage';

const router = Router();

router.post('/upload', upload.single('file'), uploadInventoryController);

export default router;
