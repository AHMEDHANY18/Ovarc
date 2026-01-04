import { Request, Response } from 'express';
import { uploadInventoryService } from '../../services/inventory/uploadInventory.service';
import { uploadInventoryDto } from '../../dtos/uploadInventory.dto';

export const uploadInventoryController = async (
  req: Request,
  res: Response
) => {
  try {
    const parsed = uploadInventoryDto.safeParse({ file: req.file });

    if (!parsed.success) {
      return res.status(400).json({
        message: 'Invalid request',
        errors: parsed.error.issues,
      });
    }

    // ⬅️ شغّل المعالجة
    const result = await uploadInventoryService(req.file!);

    return res.status(201).json({
      message: 'Inventory uploaded successfully',
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Failed to upload inventory',
    });
  }
};
