export const TASK_PRIORITY = {
  UNKNOWN: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  HIGHEST: 4,
}

export type TASK_PRIORITY_TYPE = keyof typeof TASK_PRIORITY

export const TASK_STATUS = {
  CREATED: 1,
  VISIBLE: 2,
  PENDING: 4,
  IN_PROGRESS: 8,
  COMPLETED: 9,
}

export type TASK_STATUS_TYPE = keyof typeof TASK_STATUS
