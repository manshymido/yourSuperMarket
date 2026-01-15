"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_WITH_ACTIVE_SELECT = exports.USER_CONTACT_SELECT = exports.USER_PUBLIC_SELECT = exports.USER_BASIC_SELECT = void 0;
exports.USER_BASIC_SELECT = {
    id: true,
    email: true,
    phone: true,
    firstName: true,
    lastName: true,
    role: true,
};
exports.USER_PUBLIC_SELECT = {
    id: true,
    firstName: true,
    lastName: true,
};
exports.USER_CONTACT_SELECT = {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
};
exports.USER_WITH_ACTIVE_SELECT = {
    ...exports.USER_BASIC_SELECT,
    isActive: true,
};
//# sourceMappingURL=user-selectors.js.map