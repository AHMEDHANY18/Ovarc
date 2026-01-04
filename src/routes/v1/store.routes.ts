import { Router } from 'express';
import { downloadStoreReportController } from '../../controllers/store/download-report.controller';

const router = Router();

router.get('/:id/download-report', downloadStoreReportController);

export default router;
