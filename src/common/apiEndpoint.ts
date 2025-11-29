export const API_ENDPOINT = {
  // authentication
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  REGISTER: 'api/auth/register',
  // project group task
  CREATE_PROJECT: '/api/task-group/create',
  GET_PROJECTS: '/api/task-group/get-list',
  UPDATE_PROJECT: '/api/task-group/update',
  DELETE_PROJECT: '/api/task-group/delete',
  GET_PROJECT_DETAIL: '/api/task-group/get-detail',
  // task
  CREATE_TASK: '/api/task/create',
  GET_TASKS: '/api/task/get-list',
  UPDATE_TASK: '/api/task/update',
  DELETE_TASK: '/api/task/remove',
  ASIGN_TASK: '/api/task/assign-task',
  UPDATE_PRIORITY: '/api/task/update-priority',
  UPDATE_STATUS: '/api/task/update-status',
  // USER
  GET_MEMBER_TASK: '/api/user/get-task-group-member-list',
  GET_ALL_USER: '/api/user/get-all',
  INVITE_USER: '/api/user/add-members',
  // Task
  GET_TASK_DETAIL: '/api/task/get-detail',
}
