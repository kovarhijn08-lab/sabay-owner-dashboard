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
exports.PropertyEvent = void 0;
var typeorm_1 = require("typeorm");
var owner_property_entity_1 = require("./owner-property.entity");
/**
 * Сущность PropertyEvent - событие/изменение по объекту
 *
 * Что здесь хранится:
 * - Тип изменения (прогресс стройки, изменение дохода, изменение стоимости и т.д.)
 * - Значения до и после изменения
 * - Дата события
 */
var PropertyEvent = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('property_events')];
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
    var _changeType_decorators;
    var _changeType_initializers = [];
    var _changeType_extraInitializers = [];
    var _beforeValue_decorators;
    var _beforeValue_initializers = [];
    var _beforeValue_extraInitializers = [];
    var _afterValue_decorators;
    var _afterValue_initializers = [];
    var _afterValue_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var PropertyEvent = _classThis = /** @class */ (function () {
        function PropertyEvent_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            // Связь с объектом
            this.property = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _property_initializers, void 0));
            this.propertyId = (__runInitializers(this, _property_extraInitializers), __runInitializers(this, _propertyId_initializers, void 0));
            // Тип изменения
            this.changeType = (__runInitializers(this, _propertyId_extraInitializers), __runInitializers(this, _changeType_initializers, void 0));
            // Значение до изменения (JSON)
            this.beforeValue = (__runInitializers(this, _changeType_extraInitializers), __runInitializers(this, _beforeValue_initializers, void 0));
            // Значение после изменения (JSON)
            this.afterValue = (__runInitializers(this, _beforeValue_extraInitializers), __runInitializers(this, _afterValue_initializers, void 0));
            // Описание изменения (для отображения в ленте)
            this.description = (__runInitializers(this, _afterValue_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.createdAt = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
        return PropertyEvent_1;
    }());
    __setFunctionName(_classThis, "PropertyEvent");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _property_decorators = [(0, typeorm_1.ManyToOne)(function () { return owner_property_entity_1.OwnerProperty; }, function (property) { return property.events; }, { nullable: false, onDelete: 'CASCADE' })];
        _propertyId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _changeType_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 50 })];
        _beforeValue_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', nullable: true })];
        _afterValue_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', nullable: true })];
        _description_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _createdAt_decorators = [(0, typeorm_1.Column)({ type: 'datetime', default: function () { return 'CURRENT_TIMESTAMP'; } })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _property_decorators, { kind: "field", name: "property", static: false, private: false, access: { has: function (obj) { return "property" in obj; }, get: function (obj) { return obj.property; }, set: function (obj, value) { obj.property = value; } }, metadata: _metadata }, _property_initializers, _property_extraInitializers);
        __esDecorate(null, null, _propertyId_decorators, { kind: "field", name: "propertyId", static: false, private: false, access: { has: function (obj) { return "propertyId" in obj; }, get: function (obj) { return obj.propertyId; }, set: function (obj, value) { obj.propertyId = value; } }, metadata: _metadata }, _propertyId_initializers, _propertyId_extraInitializers);
        __esDecorate(null, null, _changeType_decorators, { kind: "field", name: "changeType", static: false, private: false, access: { has: function (obj) { return "changeType" in obj; }, get: function (obj) { return obj.changeType; }, set: function (obj, value) { obj.changeType = value; } }, metadata: _metadata }, _changeType_initializers, _changeType_extraInitializers);
        __esDecorate(null, null, _beforeValue_decorators, { kind: "field", name: "beforeValue", static: false, private: false, access: { has: function (obj) { return "beforeValue" in obj; }, get: function (obj) { return obj.beforeValue; }, set: function (obj, value) { obj.beforeValue = value; } }, metadata: _metadata }, _beforeValue_initializers, _beforeValue_extraInitializers);
        __esDecorate(null, null, _afterValue_decorators, { kind: "field", name: "afterValue", static: false, private: false, access: { has: function (obj) { return "afterValue" in obj; }, get: function (obj) { return obj.afterValue; }, set: function (obj, value) { obj.afterValue = value; } }, metadata: _metadata }, _afterValue_initializers, _afterValue_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PropertyEvent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PropertyEvent = _classThis;
}();
exports.PropertyEvent = PropertyEvent;
