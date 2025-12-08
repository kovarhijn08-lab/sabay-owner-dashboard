"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
/**
 * AdminController - контроллер для административных операций
 */
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var roles_guard_1 = require("../auth/guards/roles.guard");
var roles_decorator_1 = require("../auth/decorators/roles.decorator");
var AdminController = function () {
    var _classDecorators = [(0, common_1.Controller)('admin'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, roles_decorator_1.AdminOnly)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _findAllUsers_decorators;
    var _findUserById_decorators;
    var _createUser_decorators;
    var _updateUser_decorators;
    var _deleteUser_decorators;
    var _findAllDictionaries_decorators;
    var _findDictionaryById_decorators;
    var _createDictionary_decorators;
    var _updateDictionary_decorators;
    var _deleteDictionary_decorators;
    var _findAllSLASettings_decorators;
    var _findSLASettingsByType_decorators;
    var _updateSLASettings_decorators;
    var _findAllProperties_decorators;
    var _assignManager_decorators;
    var _findAllEvents_decorators;
    var _findAllProjects_decorators;
    var _findProjectById_decorators;
    var _updateProjectDefaultManager_decorators;
    var _findAllUnits_decorators;
    var _findUnitById_decorators;
    var _assignManagerToUnit_decorators;
    var AdminController = _classThis = /** @class */ (function () {
        function AdminController_1(adminService) {
            this.adminService = (__runInitializers(this, _instanceExtraInitializers), adminService);
        }
        // ========== Управление пользователями ==========
        AdminController_1.prototype.findAllUsers = function (role, isActive) {
            return this.adminService.findAllUsers(role, isActive === 'true' ? true : isActive === 'false' ? false : undefined);
        };
        AdminController_1.prototype.findUserById = function (id) {
            return this.adminService.findUserById(id);
        };
        AdminController_1.prototype.createUser = function (createDto) {
            return this.adminService.createUser(createDto);
        };
        AdminController_1.prototype.updateUser = function (id, updateDto) {
            return this.adminService.updateUser(id, updateDto);
        };
        AdminController_1.prototype.deleteUser = function (id) {
            return this.adminService.deleteUser(id);
        };
        // ========== Управление справочниками ==========
        AdminController_1.prototype.findAllDictionaries = function (type) {
            return this.adminService.findAllDictionaries(type);
        };
        AdminController_1.prototype.findDictionaryById = function (id) {
            return this.adminService.findDictionaryById(id);
        };
        AdminController_1.prototype.createDictionary = function (createDto) {
            return this.adminService.createDictionary(createDto);
        };
        AdminController_1.prototype.updateDictionary = function (id, updateDto) {
            return this.adminService.updateDictionary(id, updateDto);
        };
        AdminController_1.prototype.deleteDictionary = function (id) {
            return this.adminService.deleteDictionary(id);
        };
        // ========== Управление SLA настройками ==========
        AdminController_1.prototype.findAllSLASettings = function () {
            return this.adminService.findAllSLASettings();
        };
        AdminController_1.prototype.findSLASettingsByType = function (type) {
            return this.adminService.findSLASettingsByType(type);
        };
        AdminController_1.prototype.updateSLASettings = function (type, updateDto) {
            return this.adminService.updateSLASettings(type, updateDto);
        };
        // ========== Управление объектами и назначение менеджеров ==========
        AdminController_1.prototype.findAllProperties = function (managerId, ownerId, status) {
            return this.adminService.findAllProperties(managerId, ownerId, status);
        };
        AdminController_1.prototype.assignManager = function (propertyId, assignDto) {
            return this.adminService.assignManager(propertyId, assignDto);
        };
        // ========== Просмотр логов действий ==========
        AdminController_1.prototype.findAllEvents = function (userId, propertyId, changeType, limit) {
            return this.adminService.findAllEvents(userId, propertyId, changeType, limit ? parseInt(limit, 10) : 100);
        };
        // ========== Управление проектами ==========
        AdminController_1.prototype.findAllProjects = function () {
            return this.adminService.findAllProjects();
        };
        AdminController_1.prototype.findProjectById = function (id) {
            return this.adminService.findProjectById(id);
        };
        AdminController_1.prototype.updateProjectDefaultManager = function (projectId, managerId) {
            return this.adminService.updateProjectDefaultManager(projectId, managerId);
        };
        // ========== Управление юнитами ==========
        AdminController_1.prototype.findAllUnits = function (projectId, managerId) {
            return this.adminService.findAllUnits(projectId, managerId);
        };
        AdminController_1.prototype.findUnitById = function (id) {
            return this.adminService.findUnitById(id);
        };
        AdminController_1.prototype.assignManagerToUnit = function (unitId, managerId) {
            return this.adminService.assignManagerToUnit(unitId, managerId);
        };
        return AdminController_1;
    }());
    __setFunctionName(_classThis, "AdminController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _findAllUsers_decorators = [(0, common_1.Get)('users')];
        _findUserById_decorators = [(0, common_1.Get)('users/:id')];
        _createUser_decorators = [(0, common_1.Post)('users')];
        _updateUser_decorators = [(0, common_1.Patch)('users/:id')];
        _deleteUser_decorators = [(0, common_1.Delete)('users/:id')];
        _findAllDictionaries_decorators = [(0, common_1.Get)('dictionaries')];
        _findDictionaryById_decorators = [(0, common_1.Get)('dictionaries/:id')];
        _createDictionary_decorators = [(0, common_1.Post)('dictionaries')];
        _updateDictionary_decorators = [(0, common_1.Patch)('dictionaries/:id')];
        _deleteDictionary_decorators = [(0, common_1.Delete)('dictionaries/:id')];
        _findAllSLASettings_decorators = [(0, common_1.Get)('sla')];
        _findSLASettingsByType_decorators = [(0, common_1.Get)('sla/:type')];
        _updateSLASettings_decorators = [(0, common_1.Patch)('sla/:type')];
        _findAllProperties_decorators = [(0, common_1.Get)('properties')];
        _assignManager_decorators = [(0, common_1.Patch)('properties/:id/assign')];
        _findAllEvents_decorators = [(0, common_1.Get)('logs')];
        _findAllProjects_decorators = [(0, common_1.Get)('projects')];
        _findProjectById_decorators = [(0, common_1.Get)('projects/:id')];
        _updateProjectDefaultManager_decorators = [(0, common_1.Patch)('projects/:id/default-manager')];
        _findAllUnits_decorators = [(0, common_1.Get)('units')];
        _findUnitById_decorators = [(0, common_1.Get)('units/:id')];
        _assignManagerToUnit_decorators = [(0, common_1.Patch)('units/:id/assign-manager')];
        __esDecorate(_classThis, null, _findAllUsers_decorators, { kind: "method", name: "findAllUsers", static: false, private: false, access: { has: function (obj) { return "findAllUsers" in obj; }, get: function (obj) { return obj.findAllUsers; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findUserById_decorators, { kind: "method", name: "findUserById", static: false, private: false, access: { has: function (obj) { return "findUserById" in obj; }, get: function (obj) { return obj.findUserById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createUser_decorators, { kind: "method", name: "createUser", static: false, private: false, access: { has: function (obj) { return "createUser" in obj; }, get: function (obj) { return obj.createUser; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateUser_decorators, { kind: "method", name: "updateUser", static: false, private: false, access: { has: function (obj) { return "updateUser" in obj; }, get: function (obj) { return obj.updateUser; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteUser_decorators, { kind: "method", name: "deleteUser", static: false, private: false, access: { has: function (obj) { return "deleteUser" in obj; }, get: function (obj) { return obj.deleteUser; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAllDictionaries_decorators, { kind: "method", name: "findAllDictionaries", static: false, private: false, access: { has: function (obj) { return "findAllDictionaries" in obj; }, get: function (obj) { return obj.findAllDictionaries; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findDictionaryById_decorators, { kind: "method", name: "findDictionaryById", static: false, private: false, access: { has: function (obj) { return "findDictionaryById" in obj; }, get: function (obj) { return obj.findDictionaryById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createDictionary_decorators, { kind: "method", name: "createDictionary", static: false, private: false, access: { has: function (obj) { return "createDictionary" in obj; }, get: function (obj) { return obj.createDictionary; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateDictionary_decorators, { kind: "method", name: "updateDictionary", static: false, private: false, access: { has: function (obj) { return "updateDictionary" in obj; }, get: function (obj) { return obj.updateDictionary; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteDictionary_decorators, { kind: "method", name: "deleteDictionary", static: false, private: false, access: { has: function (obj) { return "deleteDictionary" in obj; }, get: function (obj) { return obj.deleteDictionary; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAllSLASettings_decorators, { kind: "method", name: "findAllSLASettings", static: false, private: false, access: { has: function (obj) { return "findAllSLASettings" in obj; }, get: function (obj) { return obj.findAllSLASettings; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findSLASettingsByType_decorators, { kind: "method", name: "findSLASettingsByType", static: false, private: false, access: { has: function (obj) { return "findSLASettingsByType" in obj; }, get: function (obj) { return obj.findSLASettingsByType; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateSLASettings_decorators, { kind: "method", name: "updateSLASettings", static: false, private: false, access: { has: function (obj) { return "updateSLASettings" in obj; }, get: function (obj) { return obj.updateSLASettings; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAllProperties_decorators, { kind: "method", name: "findAllProperties", static: false, private: false, access: { has: function (obj) { return "findAllProperties" in obj; }, get: function (obj) { return obj.findAllProperties; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _assignManager_decorators, { kind: "method", name: "assignManager", static: false, private: false, access: { has: function (obj) { return "assignManager" in obj; }, get: function (obj) { return obj.assignManager; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAllEvents_decorators, { kind: "method", name: "findAllEvents", static: false, private: false, access: { has: function (obj) { return "findAllEvents" in obj; }, get: function (obj) { return obj.findAllEvents; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAllProjects_decorators, { kind: "method", name: "findAllProjects", static: false, private: false, access: { has: function (obj) { return "findAllProjects" in obj; }, get: function (obj) { return obj.findAllProjects; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findProjectById_decorators, { kind: "method", name: "findProjectById", static: false, private: false, access: { has: function (obj) { return "findProjectById" in obj; }, get: function (obj) { return obj.findProjectById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateProjectDefaultManager_decorators, { kind: "method", name: "updateProjectDefaultManager", static: false, private: false, access: { has: function (obj) { return "updateProjectDefaultManager" in obj; }, get: function (obj) { return obj.updateProjectDefaultManager; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAllUnits_decorators, { kind: "method", name: "findAllUnits", static: false, private: false, access: { has: function (obj) { return "findAllUnits" in obj; }, get: function (obj) { return obj.findAllUnits; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findUnitById_decorators, { kind: "method", name: "findUnitById", static: false, private: false, access: { has: function (obj) { return "findUnitById" in obj; }, get: function (obj) { return obj.findUnitById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _assignManagerToUnit_decorators, { kind: "method", name: "assignManagerToUnit", static: false, private: false, access: { has: function (obj) { return "assignManagerToUnit" in obj; }, get: function (obj) { return obj.assignManagerToUnit; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminController = _classThis;
}();
exports.AdminController = AdminController;
