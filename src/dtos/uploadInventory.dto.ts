import { z } from 'zod';

export const uploadInventoryDto = z.object({
  file: z.object({
    path: z.string(),
    mimetype: z.string().refine(
      (type) => type === 'text/csv' || type === 'application/vnd.ms-excel',
      { message: 'File must be a CSV' }
    ),
  }),
});

export type UploadInventoryDto = z.infer<typeof uploadInventoryDto>;
