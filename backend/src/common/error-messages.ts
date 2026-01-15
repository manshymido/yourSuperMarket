/**
 * Centralized error messages for consistent error handling
 */
export const ERROR_MESSAGES = {
  // Not Found
  USER_NOT_FOUND: 'User not found',
  PRODUCT_NOT_FOUND: 'Product not found',
  CATEGORY_NOT_FOUND: 'Category not found',
  ORDER_NOT_FOUND: 'Order not found',
  ADDRESS_NOT_FOUND: 'Address not found',
  CART_ITEM_NOT_FOUND: 'Cart item not found',
  PAYMENT_NOT_FOUND: 'Payment not found',
  DELIVERY_NOT_FOUND: 'Delivery not found',
  GOVERNORATE_NOT_FOUND: 'Governorate not found',

  // Already Exists
  EMAIL_ALREADY_EXISTS: 'User with this email already exists',
  PHONE_ALREADY_EXISTS: 'User with this phone already exists',
  EMAIL_ALREADY_IN_USE: 'Email already in use',
  REVIEW_ALREADY_EXISTS: 'You have already reviewed this product',

  // Validation
  EMAIL_OR_PHONE_REQUIRED: 'Either email or phone is required',
  INVALID_CREDENTIALS: 'Invalid credentials',
  ACCOUNT_INACTIVE: 'Account is inactive',
  USER_INACTIVE: 'User account is inactive',

  // Stock/Inventory
  INSUFFICIENT_STOCK: 'Insufficient stock',
  PRODUCT_NOT_AVAILABLE: 'Product is not available',
  CART_EMPTY: 'Cart is empty',

  // Ownership
  ADDRESS_NOT_BELONGS_TO_USER: 'Address does not belong to user',
  CART_ITEM_NOT_BELONGS_TO_USER: 'Cart item does not belong to user',
  CAN_ONLY_VIEW_OWN_ORDERS: 'You can only view your own orders',
  CAN_ONLY_UPDATE_OWN_ADDRESSES: 'You can only update your own addresses',
  CAN_ONLY_DELETE_OWN_ADDRESSES: 'You can only delete your own addresses',

  // Permissions
  ONLY_ADMINS_CAN_UPDATE_ORDER_STATUS:
    'Only admins can update order status',
  ONLY_PENDING_ORDERS_CAN_BE_CANCELLED:
    'Only pending orders can be cancelled',

  // Delivery
  DELIVERY_ALREADY_ASSIGNED: 'Delivery already assigned',
  DELIVERY_NOT_BELONGS_TO_DRIVER: 'Delivery does not belong to driver',

  // Payment
  INVALID_PAYMENT_METHOD: 'Invalid payment method',

  // Review
  CAN_ONLY_REVIEW_PURCHASED_PRODUCTS:
    'You can only review products you have purchased',

  // Reset Token
  INVALID_OR_EXPIRED_RESET_TOKEN: 'Invalid or expired reset token',
  RESET_TOKEN_ALREADY_USED: 'This reset token has already been used',
  RESET_TOKEN_EXPIRED: 'Reset token has expired. Please request a new one.',
} as const;
