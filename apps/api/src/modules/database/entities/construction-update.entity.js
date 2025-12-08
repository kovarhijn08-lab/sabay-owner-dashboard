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
exports.ConstructionUpdate = void 0;
var typeorm_1 = require("typeorm");
var owner_property_entity_1 = require("./owner-property.entity");
var user_entity_1 = require("./user.entity");
/**
 * Сущность ConstructionUpdate - обновление по стройке
 */
var ConstructionUpdate = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('construction_updates')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _property_decorators;
    var _property_initializers = [];
    var _property_extraInitializers = [];
    var _propertyId_decorators;
    var _propertyId_initializers = [];
    var _propertyId_extraInitializers = [];
    var _createdBy_decorators;
    var _createdBy_initializers = [];
    var _createdBy_extraInitializers = [];
    var _createdById_decorators;
    var _createdById_initializers = [];
    var _createdById_extraInitializers = [];
    var _stage_decorators;
    var _stage_initializers = [];
    var _stage_extraInitializers = [];
    var _progress_decorators;
    var _progress_initializers = [];
    var _progress_extraInitializers = [];
    var _factDate_decorators;
    var _factDate_initializers = [];
    var _factDate_extraInitializers = [];
    var _comment_decorators;
    var _comment_initializers = [];
    var _comment_extraInitializers = [];
    var _photos_decorators;
    var _photos_initializers = [];
    var _photos_extraInitializers = [];
    var _deletedAt_decorators;
    var _deletedAt_initializers = [];
    var _deletedAt_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var ConstructionUpdate = _classThis = /** @class */ (function () {
        function ConstructionUpdate_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.property = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _property_initializers, void 0));
            this.propertyId = (__runInitializers(this, _property_extraInitializers), __runInitializers(this, _propertyId_initializers, void 0));
            this.createdBy = (__runInitializers(this, _propertyId_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.createdById = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _createdById_initializers, void 0));
            this.stage = (__runInitializers(this, _createdById_extraInitializers), __runInitializers(this, _stage_initializers, void 0));
            this.progress = (__runInitializers(this, _stage_extraInitializers), __runInitializers(this, _progress_initializers, void 0));
            this.factDate = (__runInitializers(this, _progress_extraInitializers), __runInitializers(this, _factDate_initializers, void 0));
            this.comment = (__runInitializers(this, _factDate_extraInitializers), __runInitializers(this, _comment_initializers, void 0));
            this.photos = (__runInitializers(this, _comment_extraInitializers), __runInitializers(this, _photos_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _photos_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
        return ConstructionUpdate_1;
    }());
    __setFunctionName(_classThis, "ConstructionUpdate");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _property_decorators = [(0, typeorm_1.ManyToOne)(function () { return owner_property_entity_1.OwnerProperty; }, { nullable: false, onDelete: 'CASCADE' })];
        _propertyId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _createdBy_decorators = [(0, typeorm_1.ManyToOne)(function () { return user_entity_1.User; }, { nullable: true, onDelete: 'SET NULL' })];
        _createdById_decorators = [(0, typeorm_1.Column)({ type: 'uuid', nullable: true })];
        _stage_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true })];
        _progress_decorators = [(0, typeorm_1.Column)({ type: 'integer' })];
        _factDate_decorators = [(0, typeorm_1.Column)({ type: 'date' })];
        _comment_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _photos_decorators = [(0, typeorm_1.Column)({ type: 'simple-json', default: '[]' })];
        _deletedAt_decorators = [(0, typeorm_1.Column)({ type: 'datetime', nullable: true })];
        _createdAt_decorators = [(0, typeorm_1.Column)({ type: 'datetime', default: function () { return 'CURRENT_TIMESTAMP'; } })];
        _updatedAt_decorators = [(0, typeorm_1.Column)({ type: 'datetime', default: function () { return 'CURRENT_TIMESTAMP'; }, onUpdate: 'CURRENT_TIMESTAMP' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _property_decorators, { kind: "field", name: "property", static: false, private: false, access: { has: function (obj) { return "property" in obj; }, get: function (obj) { return obj.property; }, set: function (obj, value) { obj.property = value; } }, metadata: _metadata }, _property_initializers, _property_extraInitializers);
        __esDecorate(null, null, _propertyId_decorators, { kind: "field", name: "propertyId", static: false, private: false, access: { has: function (obj) { return "propertyId" in obj; }, get: function (obj) { return obj.propertyId; }, set: function (obj, value) { obj.propertyId = value; } }, metadata: _metadata }, _propertyId_initializers, _propertyId_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: function (obj) { return "createdBy" in obj; }, get: function (obj) { return obj.createdBy; }, set: function (obj, value) { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _createdById_decorators, { kind: "field", name: "createdById", static: false, private: false, access: { has: function (obj) { return "createdById" in obj; }, get: function (obj) { return obj.createdById; }, set: function (obj, value) { obj.createdById = value; } }, metadata: _metadata }, _createdById_initializers, _createdById_extraInitializers);
        __esDecorate(null, null, _stage_decorators, { kind: "field", name: "stage", static: false, private: false, access: { has: function (obj) { return "stage" in obj; }, get: function (obj) { return obj.stage; }, set: function (obj, value) { obj.stage = value; } }, metadata: _metadata }, _stage_initializers, _stage_extraInitializers);
        __esDecorate(null, null, _progress_decorators, { kind: "field", name: "progress", static: false, private: false, access: { has: function (obj) { return "progress" in obj; }, get: function (obj) { return obj.progress; }, set: function (obj, value) { obj.progress = value; } }, metadata: _metadata }, _progress_initializers, _progress_extraInitializers);
        __esDecorate(null, null, _factDate_decorators, { kind: "field", name: "factDate", static: false, private: false, access: { has: function (obj) { return "factDate" in obj; }, get: function (obj) { return obj.factDate; }, set: function (obj, value) { obj.factDate = value; } }, metadata: _metadata }, _factDate_initializers, _factDate_extraInitializers);
        __esDecorate(null, null, _comment_decorators, { kind: "field", name: "comment", static: false, private: false, access: { has: function (obj) { return "comment" in obj; }, get: function (obj) { return obj.comment; }, set: function (obj, value) { obj.comment = value; } }, metadata: _metadata }, _comment_initializers, _comment_extraInitializers);
        __esDecorate(null, null, _photos_decorators, { kind: "field", name: "photos", static: false, private: false, access: { has: function (obj) { return "photos" in obj; }, get: function (obj) { return obj.photos; }, set: function (obj, value) { obj.photos = value; } }, metadata: _metadata }, _photos_initializers, _photos_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: function (obj) { return "deletedAt" in obj; }, get: function (obj) { return obj.deletedAt; }, set: function (obj, value) { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConstructionUpdate = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConstructionUpdate = _classThis;
}();
exports.ConstructionUpdate = ConstructionUpdate;
