import { createQueryKeys } from '@/constants/queryKey'

export const projectsAssignmentsKey = createQueryKeys<string>('projects-assignments')
export const tasksAssignmentsKey = createQueryKeys<string>('tasks-assignments')
export const usersAssignmentsKey = createQueryKeys<string>('users-assignments')
