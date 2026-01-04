import { Request, Response } from 'express';
import { generateStoreReportService } from '../../services/store/download-repoer.service';

export const downloadStoreReportController = async (
  req: Request,
  res: Response
) => {
  const storeId = req.params.id;

  const { buffer, fileName } = await generateStoreReportService(storeId);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${fileName}"`
  );

  res.send(buffer);
};
