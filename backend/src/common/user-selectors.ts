import { Prisma } from '@prisma/client';

/**
 * Basic user fields: id, email, phone, firstName, lastName, role
 */
export const USER_BASIC_SELECT: Prisma.UserSelect = {
  id: true,
  email: true,
  phone: true,
  firstName: true,
  lastName: true,
  role: true,
};

/**
 * Public user fields: id, firstName, lastName (for reviews, comments, etc.)
 */
export const USER_PUBLIC_SELECT: Prisma.UserSelect = {
  id: true,
  firstName: true,
  lastName: true,
};

/**
 * Contact user fields: id, firstName, lastName, email, phone
 */
export const USER_CONTACT_SELECT: Prisma.UserSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
};

/**
 * User fields with active status: basic fields + isActive
 */
export const USER_WITH_ACTIVE_SELECT: Prisma.UserSelect = {
  ...USER_BASIC_SELECT,
  isActive: true,
};
