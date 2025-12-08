"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerOnly = exports.ManagerOnly = exports.AdminOnly = exports.Roles = exports.ROLES_KEY = void 0;
var common_1 = require("@nestjs/common");
exports.ROLES_KEY = 'roles';
var Roles = function () {
    var roles = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        roles[_i] = arguments[_i];
    }
    return (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
};
exports.Roles = Roles;
var AdminOnly = function () { return (0, exports.Roles)('admin'); };
exports.AdminOnly = AdminOnly;
var ManagerOnly = function () { return (0, exports.Roles)('manager'); };
exports.ManagerOnly = ManagerOnly;
var OwnerOnly = function () { return (0, exports.Roles)('owner'); };
exports.OwnerOnly = OwnerOnly;
