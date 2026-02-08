/**
 * Role definitions for SauceDemo test users
 * Each role has distinct behaviors and characteristics
 */

export enum UserRole {
  STANDARD = 'standard_user',
  LOCKED_OUT = 'locked_out_user',
  PROBLEM = 'problem_user',
  PERFORMANCE = 'performance_glitch_user',
  ERROR = 'error_user',
  VISUAL = 'visual_user',
}

export interface SauceDemoUser {
  username: string;
  password: string;
  role: UserRole;
  description: string;
  expectedBehavior: string;
}

export const SAUCE_DEMO_USERS: Record<UserRole, SauceDemoUser> = {
  [UserRole.STANDARD]: {
    username: process.env.SAUCE_STANDARD_USER || 'standard_user',
    password: process.env.SAUCE_PASSWORD || 'secret_sauce',
    role: UserRole.STANDARD,
    description: 'Standard user with full functionality',
    expectedBehavior:
      'User should be able to login, view products, add items to cart, checkout, and logout without any issues',
  },
  [UserRole.LOCKED_OUT]: {
    username: process.env.SAUCE_LOCKED_OUT_USER || 'locked_out_user',
    password: process.env.SAUCE_PASSWORD || 'secret_sauce',
    role: UserRole.LOCKED_OUT,
    description: 'Account locked due to too many login attempts',
    expectedBehavior:
      'Login should fail with "Sorry, this user has been locked out" error message',
  },
  [UserRole.PROBLEM]: {
    username: process.env.SAUCE_PROBLEM_USER || 'problem_user',
    password: process.env.SAUCE_PASSWORD || 'secret_sauce',
    role: UserRole.PROBLEM,
    description: 'User experiencing UI/functional issues',
    expectedBehavior:
      'User can login but experiences rendering issues, broken images, or missing elements on product pages',
  },
  [UserRole.PERFORMANCE]: {
    username: process.env.SAUCE_PERFORMANCE_GLITCH_USER || 'performance_glitch_user',
    password: process.env.SAUCE_PASSWORD || 'secret_sauce',
    role: UserRole.PERFORMANCE,
    description: 'User experiencing significant performance delays',
    expectedBehavior:
      'User can login and interact but experiences 3-second delays on each action',
  },
  [UserRole.ERROR]: {
    username: process.env.SAUCE_ERROR_USER || 'error_user',
    password: process.env.SAUCE_PASSWORD || 'secret_sauce',
    role: UserRole.ERROR,
    description: 'User experiencing error pages and failures',
    expectedBehavior:
      'User can login but experiences errors during checkout or on specific pages',
  },
  [UserRole.VISUAL]: {
    username: process.env.SAUCE_VISUAL_USER || 'visual_user',
    password: process.env.SAUCE_PASSWORD || 'secret_sauce',
    role: UserRole.VISUAL,
    description: 'User experiencing visual regression/styling issues',
    expectedBehavior:
      'User can login and navigate but sees visual inconsistencies, misaligned elements, or incorrect colors',
  },
};
