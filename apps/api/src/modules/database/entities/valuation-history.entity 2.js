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
exports.ValuationHistory = void 0;
var typeorm_1 = require("typeorm");
var owner_property_entity_1 = require("./owner-property.entity");
/**
 * Сущность ValuationHistory - история стоимости объекта
 *
 * Что здесь хранится:
 * - Год оценки
 * - Стоимость на этот год
 * - Источник оценки (покупка, рыночная оценка и т.д.)
 */
var ValuationHistory = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('valuation_history')];
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
    var _year_decorators;
    var _year_initializers = [];
    var _year_extraInitializers = [];
    var _value_decorators;
    var _value_initializers = [];
    var _value_extraInitializers = [];
    var _source_decorators;
    var _source_initializers = [];
    var _source_extraInitializers = [];
    var _note_decorators;
    var _note_initializers = [];
    var _note_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var ValuationHistory = _classThis = /** @class */ (function () {
        function ValuationHistory_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            // Связь с объектом
            this.property = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _property_initializers, void 0));
            this.propertyId = (__runInitializers(this, _property_extraInitializers), __runInitializers(this, _propertyId_initializers, void 0));
            // Год оценки
            this.year = (__runInitializers(this, _propertyId_extraInitializers), __runInitializers(this, _year_initializers, void 0));
            // Стоимость на этот год (в долларах)
            this.value = (__runInitializers(this, _year_extraInitializers), __runInitializers(this, _value_initializers, void 0));
            // Источник оценки (например, 'purchase', 'market_estimate')
            this.source = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _source_initializers, void 0));
            // Примечание
            this.note = (__runInitializers(this, _source_extraInitializers), __runInitializers(this, _note_initializers, void 0));
            this.createdAt = (__runInitializers(this, _note_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
        return ValuationHistory_1;
    }());
    __setFunctionName(_classThis, "ValuationHistory");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _property_decorators = [(0, typeorm_1.ManyToOne)(function () { return owner_property_entity_1.OwnerProperty; }, function (property) { return property.valuationHistory; }, { nullable: false, onDelete: 'CASCADE' })];
        _propertyId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _year_decorators = [(0, typeorm_1.Column)({ type: 'integer' })];
        _value_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 })];
        _source_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 50, default: 'market_estimate' })];
        _note_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _createdAt_decorators = [(0, typeorm_1.Column)({ type: 'datetime', default: function () { return 'CURRENT_TIMESTAMP'; } })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _property_decorators, { kind: "field", name: "property", static: false, private: false, access: { has: function (obj) { return "property" in obj; }, get: function (obj) { return obj.property; }, set: function (obj, value) { obj.property = value; } }, metadata: _metadata }, _property_initializers, _property_extraInitializers);
        __esDecorate(null, null, _propertyId_decorators, { kind: "field", name: "propertyId", static: false, private: false, access: { has: function (obj) { return "propertyId" in obj; }, get: function (obj) { return obj.propertyId; }, set: function (obj, value) { obj.propertyId = value; } }, metadata: _metadata }, _propertyId_initializers, _propertyId_extraInitializers);
        __esDecorate(null, null, _year_decorators, { kind: "field", name: "year", static: false, private: false, access: { has: function (obj) { return "year" in obj; }, get: function (obj) { return obj.year; }, set: function (obj, value) { obj.year = value; } }, metadata: _metadata }, _year_initializers, _year_extraInitializers);
        __esDecorate(null, null, _value_decorators, { kind: "field", name: "value", static: false, private: false, access: { has: function (obj) { return "value" in obj; }, get: function (obj) { return obj.value; }, set: function (obj, value) { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
        __esDecorate(null, null, _source_decorators, { kind: "field", name: "source", static: false, private: false, access: { has: function (obj) { return "source" in obj; }, get: function (obj) { return obj.source; }, set: function (obj, value) { obj.source = value; } }, metadata: _metadata }, _source_initializers, _source_extraInitializers);
        __esDecorate(null, null, _note_decorators, { kind: "field", name: "note", static: false, private: false, access: { has: function (obj) { return "note" in obj; }, get: function (obj) { return obj.note; }, set: function (obj, value) { obj.note = value; } }, metadata: _metadata }, _note_initializers, _note_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ValuationHistory = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ValuationHistory = _classThis;
}();
exports.ValuationHistory = ValuationHistory;
