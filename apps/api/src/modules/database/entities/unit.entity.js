"use strict";
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unit = void 0;
var typeorm_1 = require("typeorm");
var project_entity_1 = require("./project.entity");
var owner_property_entity_1 = require("./owner-property.entity");
/**
 * Сущность Unit - юнит (квартира/вилла) в проекте
 *
 * Что здесь хранится:
 * - Все данные юнита из распарсенного проекта (номер, корпус, этаж, площадь и т.п.)
 * - Связь с Project
 * - Связь с OwnerProperty (один юнит может иметь несколько владельцев во времени)
 */
var Unit = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('units')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _project_decorators;
    var _project_initializers = [];
    var _project_extraInitializers = [];
    var _projectId_decorators;
    var _projectId_initializers = [];
    var _projectId_extraInitializers = [];
    var _unitNumber_decorators;
    var _unitNumber_initializers = [];
    var _unitNumber_extraInitializers = [];
    var _building_decorators;
    var _building_initializers = [];
    var _building_extraInitializers = [];
    var _floor_decorators;
    var _floor_initializers = [];
    var _floor_extraInitializers = [];
    var _area_decorators;
    var _area_initializers = [];
    var _area_extraInitializers = [];
    var _rooms_decorators;
    var _rooms_initializers = [];
    var _rooms_extraInitializers = [];
    var _specs_decorators;
    var _specs_initializers = [];
    var _specs_extraInitializers = [];
    var _managerId_decorators;
    var _managerId_initializers = [];
    var _managerId_extraInitializers = [];
    var _deletedAt_decorators;
    var _deletedAt_initializers = [];
    var _deletedAt_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var _ownerProperties_decorators;
    var _ownerProperties_initializers = [];
    var _ownerProperties_extraInitializers = [];
    var Unit = _classThis = /** @class */ (function () {
        function Unit_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            // Связь с проектом (может быть null для standalone объектов)
            this.project = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _project_initializers, void 0));
            this.projectId = (__runInitializers(this, _project_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            // === Данные юнита ===
            // Номер юнита (например, "A-101", "Villa 5")
            this.unitNumber = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _unitNumber_initializers, void 0));
            // Корпус/здание (если применимо)
            this.building = (__runInitializers(this, _unitNumber_extraInitializers), __runInitializers(this, _building_initializers, void 0));
            // Этаж
            this.floor = (__runInitializers(this, _building_extraInitializers), __runInitializers(this, _floor_initializers, void 0));
            // Площадь (в м²)
            this.area = (__runInitializers(this, _floor_extraInitializers), __runInitializers(this, _area_initializers, void 0));
            // Количество комнат
            this.rooms = (__runInitializers(this, _area_extraInitializers), __runInitializers(this, _rooms_initializers, void 0));
            // Дополнительные характеристики (JSON)
            this.specs = (__runInitializers(this, _rooms_extraInitializers), __runInitializers(this, _specs_initializers, void 0));
            // === Менеджер ===
            // ID менеджера, ответственного за этот юнит
            this.managerId = (__runInitializers(this, _specs_extraInitializers), __runInitializers(this, _managerId_initializers, void 0));
            // === Soft-delete ===
            this.deletedAt = (__runInitializers(this, _managerId_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            // === Служебные поля ===
            this.createdAt = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            // === Связи ===
            // Один юнит может иметь несколько OwnerProperty во времени
            this.ownerProperties = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _ownerProperties_initializers, void 0));
            __runInitializers(this, _ownerProperties_extraInitializers);
        }
        return Unit_1;
    }());
    __setFunctionName(_classThis, "Unit");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _project_decorators = [(0, typeorm_1.ManyToOne)(function () { return project_entity_1.Project; }, { nullable: true, onDelete: 'SET NULL' })];
        _projectId_decorators = [(0, typeorm_1.Column)({ type: 'uuid', nullable: true })];
        _unitNumber_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 100 })];
        _building_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true })];
        _floor_decorators = [(0, typeorm_1.Column)({ type: 'integer', nullable: true })];
        _area_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true })];
        _rooms_decorators = [(0, typeorm_1.Column)({ type: 'integer', nullable: true })];
        _specs_decorators = [(0, typeorm_1.Column)({ type: 'simple-json', nullable: true })];
        _managerId_decorators = [(0, typeorm_1.Column)({ type: 'uuid', nullable: true })];
        _deletedAt_decorators = [(0, typeorm_1.Column)({ type: 'datetime', nullable: true })];
        _createdAt_decorators = [(0, typeorm_1.Column)({ type: 'datetime', default: function () { return 'CURRENT_TIMESTAMP'; } })];
        _updatedAt_decorators = [(0, typeorm_1.Column)({ type: 'datetime', default: function () { return 'CURRENT_TIMESTAMP'; }, onUpdate: 'CURRENT_TIMESTAMP' })];
        _ownerProperties_decorators = [(0, typeorm_1.OneToMany)(function () { return owner_property_entity_1.OwnerProperty; }, function (property) { return property.unit; })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _project_decorators, { kind: "field", name: "project", static: false, private: false, access: { has: function (obj) { return "project" in obj; }, get: function (obj) { return obj.project; }, set: function (obj, value) { obj.project = value; } }, metadata: _metadata }, _project_initializers, _project_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: function (obj) { return "projectId" in obj; }, get: function (obj) { return obj.projectId; }, set: function (obj, value) { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _unitNumber_decorators, { kind: "field", name: "unitNumber", static: false, private: false, access: { has: function (obj) { return "unitNumber" in obj; }, get: function (obj) { return obj.unitNumber; }, set: function (obj, value) { obj.unitNumber = value; } }, metadata: _metadata }, _unitNumber_initializers, _unitNumber_extraInitializers);
        __esDecorate(null, null, _building_decorators, { kind: "field", name: "building", static: false, private: false, access: { has: function (obj) { return "building" in obj; }, get: function (obj) { return obj.building; }, set: function (obj, value) { obj.building = value; } }, metadata: _metadata }, _building_initializers, _building_extraInitializers);
        __esDecorate(null, null, _floor_decorators, { kind: "field", name: "floor", static: false, private: false, access: { has: function (obj) { return "floor" in obj; }, get: function (obj) { return obj.floor; }, set: function (obj, value) { obj.floor = value; } }, metadata: _metadata }, _floor_initializers, _floor_extraInitializers);
        __esDecorate(null, null, _area_decorators, { kind: "field", name: "area", static: false, private: false, access: { has: function (obj) { return "area" in obj; }, get: function (obj) { return obj.area; }, set: function (obj, value) { obj.area = value; } }, metadata: _metadata }, _area_initializers, _area_extraInitializers);
        __esDecorate(null, null, _rooms_decorators, { kind: "field", name: "rooms", static: false, private: false, access: { has: function (obj) { return "rooms" in obj; }, get: function (obj) { return obj.rooms; }, set: function (obj, value) { obj.rooms = value; } }, metadata: _metadata }, _rooms_initializers, _rooms_extraInitializers);
        __esDecorate(null, null, _specs_decorators, { kind: "field", name: "specs", static: false, private: false, access: { has: function (obj) { return "specs" in obj; }, get: function (obj) { return obj.specs; }, set: function (obj, value) { obj.specs = value; } }, metadata: _metadata }, _specs_initializers, _specs_extraInitializers);
        __esDecorate(null, null, _managerId_decorators, { kind: "field", name: "managerId", static: false, private: false, access: { has: function (obj) { return "managerId" in obj; }, get: function (obj) { return obj.managerId; }, set: function (obj, value) { obj.managerId = value; } }, metadata: _metadata }, _managerId_initializers, _managerId_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: function (obj) { return "deletedAt" in obj; }, get: function (obj) { return obj.deletedAt; }, set: function (obj, value) { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _ownerProperties_decorators, { kind: "field", name: "ownerProperties", static: false, private: false, access: { has: function (obj) { return "ownerProperties" in obj; }, get: function (obj) { return obj.ownerProperties; }, set: function (obj, value) { obj.ownerProperties = value; } }, metadata: _metadata }, _ownerProperties_initializers, _ownerProperties_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Unit = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Unit = _classThis;
}();
exports.Unit = Unit;
