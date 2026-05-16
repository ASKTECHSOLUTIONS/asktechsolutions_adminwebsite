export const APP_NAME = 'AskTechSolutions';
export const APP_DESCRIPTION = 'Admin Control Panel';

export const ROUTES = {
  LOGIN: '/',
  DASHBOARD: '/dashboard',
  EMPLOYEES: '/employees',
  ATTENDANCE: '/attendance',
  LEAVES: '/leaves',
  CONTENT: '/content',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  CLIENTS: '/clients',
  PROJECTS: '/projects',
  INTERNSHIPS: '/internships',
  PAYMENTS: '/payments',
  MEETINGS: '/meetings',
  NOTIFICATIONS: '/notifications',
  ANALYTICS: '/analytics',
} as const;

export const TOAST_DURATION = 3000;

export const ANIMATION_DURATION = {
  FAST: 0.2,
  NORMAL: 0.3,
  SLOW: 0.5,
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;
