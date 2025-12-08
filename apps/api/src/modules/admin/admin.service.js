"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
/**
 * AdminService - сервис для административных операций
 */
var common_1 = require("@nestjs/common");
var bcrypt = require("bcrypt");
var AdminService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AdminService = _classThis = /** @class */ (function () {
        function AdminService_1(userRepository, propertyRepository, dictionaryRepository, slaRepository, eventRepository, projectRepository, unitRepository, managementCompanyRepository) {
            this.userRepository = userRepository;
            this.propertyRepository = propertyRepository;
            this.dictionaryRepository = dictionaryRepository;
            this.slaRepository = slaRepository;
            this.eventRepository = eventRepository;
            this.projectRepository = projectRepository;
            this.unitRepository = unitRepository;
            this.managementCompanyRepository = managementCompanyRepository;
        }
        // ========== Управление пользователями ==========
        AdminService_1.prototype.findAllUsers = function (role, isActive) {
            return __awaiter(this, void 0, void 0, function () {
                var where;
                return __generator(this, function (_a) {
                    where = {};
                    if (role)
                        where.role = role;
                    if (isActive !== undefined)
                        where.isActive = isActive;
                    return [2 /*return*/, this.userRepository.find({
                            where: where,
                            order: { createdAt: 'DESC' },
                        })];
                });
            });
        };
        AdminService_1.prototype.findUserById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.userRepository.findOne({ where: { id: id } })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                throw new common_1.NotFoundException("\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0441 ID ".concat(id, " \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D"));
                            }
                            return [2 /*return*/, user];
                    }
                });
            });
        };
        AdminService_1.prototype.createUser = function (createDto) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, passwordHash, user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.userRepository.findOne({ where: { login: createDto.login } })];
                        case 1:
                            existing = _a.sent();
                            if (existing) {
                                throw new common_1.BadRequestException('Пользователь с таким логином уже существует');
                            }
                            return [4 /*yield*/, bcrypt.hash(createDto.password, 10)];
                        case 2:
                            passwordHash = _a.sent();
                            user = this.userRepository.create(__assign(__assign({}, createDto), { passwordHash: passwordHash }));
                            return [2 /*return*/, this.userRepository.save(user)];
                    }
                });
            });
        };
        AdminService_1.prototype.updateUser = function (id, updateDto) {
            return __awaiter(this, void 0, void 0, function () {
                var user, existing, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.findUserById(id)];
                        case 1:
                            user = _b.sent();
                            if (!(updateDto.login && updateDto.login !== user.login)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.userRepository.findOne({ where: { login: updateDto.login } })];
                        case 2:
                            existing = _b.sent();
                            if (existing) {
                                throw new common_1.BadRequestException('Пользователь с таким логином уже существует');
                            }
                            _b.label = 3;
                        case 3:
                            if (!updateDto.password) return [3 /*break*/, 5];
                            _a = updateDto;
                            return [4 /*yield*/, bcrypt.hash(updateDto.password, 10)];
                        case 4:
                            _a.password = (_b.sent());
                            _b.label = 5;
                        case 5:
                            Object.assign(user, updateDto);
                            return [2 /*return*/, this.userRepository.save(user)];
                    }
                });
            });
        };
        AdminService_1.prototype.deleteUser = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findUserById(id)];
                        case 1:
                            user = _a.sent();
                            user.isActive = false;
                            return [2 /*return*/, this.userRepository.save(user)];
                    }
                });
            });
        };
        // ========== Управление справочниками ==========
        AdminService_1.prototype.findAllDictionaries = function (type) {
            return __awaiter(this, void 0, void 0, function () {
                var where;
                return __generator(this, function (_a) {
                    where = {};
                    if (type)
                        where.type = type;
                    return [2 /*return*/, this.dictionaryRepository.find({
                            where: where,
                            order: { sortOrder: 'ASC', label: 'ASC' },
                        })];
                });
            });
        };
        AdminService_1.prototype.findDictionaryById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var dict;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.dictionaryRepository.findOne({ where: { id: id } })];
                        case 1:
                            dict = _a.sent();
                            if (!dict) {
                                throw new common_1.NotFoundException("\u0417\u0430\u043F\u0438\u0441\u044C \u0441\u043F\u0440\u0430\u0432\u043E\u0447\u043D\u0438\u043A\u0430 \u0441 ID ".concat(id, " \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430"));
                            }
                            return [2 /*return*/, dict];
                    }
                });
            });
        };
        AdminService_1.prototype.createDictionary = function (createDto) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, dict;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.dictionaryRepository.findOne({
                                where: { type: createDto.type, key: createDto.key },
                            })];
                        case 1:
                            existing = _a.sent();
                            if (existing) {
                                throw new common_1.BadRequestException("\u0417\u0430\u043F\u0438\u0441\u044C \u0441 \u043A\u043B\u044E\u0447\u043E\u043C \"".concat(createDto.key, "\" \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442 \u0432 \u0441\u043F\u0440\u0430\u0432\u043E\u0447\u043D\u0438\u043A\u0435 \"").concat(createDto.type, "\""));
                            }
                            dict = this.dictionaryRepository.create(__assign(__assign({}, createDto), { metadata: createDto.metadata || {}, isActive: createDto.isActive !== undefined ? createDto.isActive : true }));
                            return [2 /*return*/, this.dictionaryRepository.save(dict)];
                    }
                });
            });
        };
        AdminService_1.prototype.updateDictionary = function (id, updateDto) {
            return __awaiter(this, void 0, void 0, function () {
                var dict;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findDictionaryById(id)];
                        case 1:
                            dict = _a.sent();
                            Object.assign(dict, updateDto);
                            return [2 /*return*/, this.dictionaryRepository.save(dict)];
                    }
                });
            });
        };
        AdminService_1.prototype.deleteDictionary = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var dict;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findDictionaryById(id)];
                        case 1:
                            dict = _a.sent();
                            dict.isActive = false;
                            return [2 /*return*/, this.dictionaryRepository.save(dict)];
                    }
                });
            });
        };
        // ========== Управление SLA настройками ==========
        AdminService_1.prototype.findAllSLASettings = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.slaRepository.find({ order: { type: 'ASC' } })];
                });
            });
        };
        AdminService_1.prototype.findSLASettingsByType = function (type) {
            return __awaiter(this, void 0, void 0, function () {
                var settings;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.slaRepository.findOne({ where: { type: type } })];
                        case 1:
                            settings = _a.sent();
                            if (!!settings) return [3 /*break*/, 3];
                            settings = this.slaRepository.create({
                                type: type,
                                mode: type === 'construction_update' ? 'monthly_window' : 'days_threshold',
                                windowStartDay: type === 'construction_update' ? 1 : null,
                                windowEndDay: type === 'construction_update' ? 5 : null,
                                thresholdDays: type === 'rental_update' ? 30 : null,
                                isActive: true,
                            });
                            return [4 /*yield*/, this.slaRepository.save(settings)];
                        case 2:
                            settings = _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/, settings];
                    }
                });
            });
        };
        AdminService_1.prototype.updateSLASettings = function (type, updateDto) {
            return __awaiter(this, void 0, void 0, function () {
                var settings;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, this.slaRepository.findOne({ where: { type: type } })];
                        case 1:
                            settings = _d.sent();
                            if (!settings) {
                                settings = this.slaRepository.create({
                                    type: type,
                                    mode: updateDto.mode || (type === 'construction_update' ? 'monthly_window' : 'days_threshold'),
                                    windowStartDay: (_a = updateDto.windowStartDay) !== null && _a !== void 0 ? _a : null,
                                    windowEndDay: (_b = updateDto.windowEndDay) !== null && _b !== void 0 ? _b : null,
                                    thresholdDays: (_c = updateDto.thresholdDays) !== null && _c !== void 0 ? _c : null,
                                    isActive: true,
                                });
                            }
                            else {
                                Object.assign(settings, updateDto);
                            }
                            return [2 /*return*/, this.slaRepository.save(settings)];
                    }
                });
            });
        };
        // ========== Управление объектами и назначение менеджеров ==========
        AdminService_1.prototype.findAllProperties = function (managerId, ownerId, status) {
            return __awaiter(this, void 0, void 0, function () {
                var where;
                return __generator(this, function (_a) {
                    where = {};
                    if (managerId)
                        where.managerId = managerId;
                    if (ownerId)
                        where.ownerId = ownerId;
                    if (status)
                        where.status = status;
                    return [2 /*return*/, this.propertyRepository.find({
                            where: where,
                            relations: ['owner', 'manager', 'unit', 'managementCompany'],
                            order: { createdAt: 'DESC' },
                        })];
                });
            });
        };
        AdminService_1.prototype.assignManager = function (propertyId, assignDto) {
            return __awaiter(this, void 0, void 0, function () {
                var property, manager, owner, company;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.propertyRepository.findOne({
                                where: { id: propertyId },
                                relations: ['owner', 'manager'],
                            })];
                        case 1:
                            property = _a.sent();
                            if (!property) {
                                throw new common_1.NotFoundException("\u041E\u0431\u044A\u0435\u043A\u0442 \u0441 ID ".concat(propertyId, " \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D"));
                            }
                            if (!(assignDto.managerId !== undefined)) return [3 /*break*/, 4];
                            if (!assignDto.managerId) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.userRepository.findOne({ where: { id: assignDto.managerId } })];
                        case 2:
                            manager = _a.sent();
                            if (!manager || manager.role !== 'manager') {
                                throw new common_1.BadRequestException('Указанный пользователь не является менеджером');
                            }
                            _a.label = 3;
                        case 3:
                            property.managerId = assignDto.managerId;
                            _a.label = 4;
                        case 4:
                            if (!(assignDto.ownerId !== undefined)) return [3 /*break*/, 7];
                            if (!assignDto.ownerId) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.userRepository.findOne({ where: { id: assignDto.ownerId } })];
                        case 5:
                            owner = _a.sent();
                            if (!owner) {
                                throw new common_1.BadRequestException('Пользователь не найден');
                            }
                            if (owner.role !== 'owner' && owner.role !== 'investor') {
                                throw new common_1.BadRequestException('Указанный пользователь не является владельцем. Роль должна быть "owner"');
                            }
                            _a.label = 6;
                        case 6:
                            property.ownerId = assignDto.ownerId;
                            _a.label = 7;
                        case 7:
                            if (!(assignDto.managementCompanyId !== undefined)) return [3 /*break*/, 10];
                            if (!assignDto.managementCompanyId) return [3 /*break*/, 9];
                            return [4 /*yield*/, this.managementCompanyRepository.findOne({ where: { id: assignDto.managementCompanyId } })];
                        case 8:
                            company = _a.sent();
                            if (!company) {
                                throw new common_1.BadRequestException('Управляющая компания не найдена');
                            }
                            _a.label = 9;
                        case 9:
                            property.managementCompanyId = assignDto.managementCompanyId;
                            _a.label = 10;
                        case 10: return [2 /*return*/, this.propertyRepository.save(property)];
                    }
                });
            });
        };
        // ========== Просмотр логов действий ==========
        AdminService_1.prototype.findAllEvents = function (userId_1, propertyId_1, changeType_1) {
            return __awaiter(this, arguments, void 0, function (userId, propertyId, changeType, limit) {
                var where;
                if (limit === void 0) { limit = 100; }
                return __generator(this, function (_a) {
                    where = {};
                    if (userId)
                        where.createdById = userId;
                    if (propertyId)
                        where.propertyId = propertyId;
                    if (changeType)
                        where.changeType = changeType;
                    return [2 /*return*/, this.eventRepository.find({
                            where: where,
                            relations: ['property'],
                            order: { createdAt: 'DESC' },
                            take: limit,
                        })];
                });
            });
        };
        // ========== Управление проектами ==========
        AdminService_1.prototype.findAllProjects = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.projectRepository.find({
                            where: { deletedAt: null },
                            relations: [],
                            order: { name: 'ASC' },
                        })];
                });
            });
        };
        AdminService_1.prototype.findProjectById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var project;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.projectRepository.findOne({ where: { id: id } })];
                        case 1:
                            project = _a.sent();
                            if (!project) {
                                throw new common_1.NotFoundException("\u041F\u0440\u043E\u0435\u043A\u0442 \u0441 ID ".concat(id, " \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D"));
                            }
                            return [2 /*return*/, project];
                    }
                });
            });
        };
        AdminService_1.prototype.updateProjectDefaultManager = function (projectId, managerId) {
            return __awaiter(this, void 0, void 0, function () {
                var project, manager;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findProjectById(projectId)];
                        case 1:
                            project = _a.sent();
                            if (!managerId) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.userRepository.findOne({ where: { id: managerId } })];
                        case 2:
                            manager = _a.sent();
                            if (!manager || manager.role !== 'manager') {
                                throw new common_1.BadRequestException('Указанный пользователь не является менеджером');
                            }
                            _a.label = 3;
                        case 3:
                            project.defaultManagerId = managerId;
                            return [2 /*return*/, this.projectRepository.save(project)];
                    }
                });
            });
        };
        // ========== Управление юнитами ==========
        AdminService_1.prototype.findAllUnits = function (projectId, managerId) {
            return __awaiter(this, void 0, void 0, function () {
                var where;
                return __generator(this, function (_a) {
                    where = { deletedAt: null };
                    if (projectId)
                        where.projectId = projectId;
                    if (managerId)
                        where.managerId = managerId;
                    return [2 /*return*/, this.unitRepository.find({
                            where: where,
                            relations: ['project'],
                            order: { unitNumber: 'ASC' },
                        })];
                });
            });
        };
        AdminService_1.prototype.findUnitById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var unit;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.unitRepository.findOne({
                                where: { id: id },
                                relations: ['project'],
                            })];
                        case 1:
                            unit = _a.sent();
                            if (!unit) {
                                throw new common_1.NotFoundException("\u042E\u043D\u0438\u0442 \u0441 ID ".concat(id, " \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D"));
                            }
                            return [2 /*return*/, unit];
                    }
                });
            });
        };
        AdminService_1.prototype.assignManagerToUnit = function (unitId, managerId) {
            return __awaiter(this, void 0, void 0, function () {
                var unit, manager;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findUnitById(unitId)];
                        case 1:
                            unit = _a.sent();
                            if (!managerId) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.userRepository.findOne({ where: { id: managerId } })];
                        case 2:
                            manager = _a.sent();
                            if (!manager || manager.role !== 'manager') {
                                throw new common_1.BadRequestException('Указанный пользователь не является менеджером');
                            }
                            _a.label = 3;
                        case 3:
                            unit.managerId = managerId;
                            return [2 /*return*/, this.unitRepository.save(unit)];
                    }
                });
            });
        };
        return AdminService_1;
    }());
    __setFunctionName(_classThis, "AdminService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminService = _classThis;
}();
exports.AdminService = AdminService;
