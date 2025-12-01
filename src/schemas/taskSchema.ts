import { z } from 'zod'

// 1. Schema cho API tạo task
export const CreateTaskSchema = z.object({
  description: z.string().min(1, 'Mô tả không được để trống'),
  priority: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4)], {
    message: 'Priority phải từ 0-4',
  }),
  taskType: z.number().int().positive(),
  groupId: z.number().int().positive(),

  assignee: z.object({
    id: z.number().int().positive('Assignee ID bắt buộc'),
    name: z.string().optional(),
  }),

  // Optional fields
  status: z.number().int().optional(),
  checkList: z.string().optional(),
  imageUrls: z.array(z.string().url()).default([]),
  startTime: z.number().optional(),
  estimateTime: z.number().optional(),
  doneTime: z.number().optional(),
})
