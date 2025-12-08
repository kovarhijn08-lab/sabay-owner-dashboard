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
exports.PropertyMetrics = void 0;
var typeorm_1 = require("typeorm");
var owner_property_entity_1 = require("./owner-property.entity");
/**
 * Сущность PropertyMetrics - метрики доходности объекта за период
 *
 * Что здесь хранится:
 * - Доход за месяц и год
 * - Занятость
 * - ADR (Average Daily Rate)
 * - Выплаты клиенту
 */
var PropertyMetrics = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('property_metrics')];
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
    var _period_decorators;
    var _period_initializers = [];
    var _period_extraInitializers = [];
    var _monthlyIncome_decorators;
    var _monthlyIncome_initializers = [];
    var _monthlyIncome_extraInitializers = [];
    var _yearlyIncome_decorators;
    var _yearlyIncome_initializers = [];
    var _yearlyIncome_extraInitializers = [];
    var _occupancy_decorators;
    var _occupancy_initializers = [];
    var _occupancy_extraInitializers = [];
    var _adr_decorators;
    var _adr_initializers = [];
    var _adr_extraInitializers = [];
    var _payoutAmount_decorators;
    var _payoutAmount_initializers = [];
    var _payoutAmount_extraInitializers = [];
    var _payoutDate_decorators;
    var _payoutDate_initializers = [];
    var _payoutDate_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var PropertyMetrics = _classThis = /** @class */ (function () {
        function PropertyMetrics_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            // Связь с объектом
            this.property = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _property_initializers, void 0));
            this.propertyId = (__runInitializers(this, _property_extraInitializers), __runInitializers(this, _propertyId_initializers, void 0));
            // Период (год-месяц, например '2025-01')
            this.period = (__runInitializers(this, _propertyId_extraInitializers), __runInitializers(this, _period_initializers, void 0));
            // Доход за месяц (в долларах)
            this.monthlyIncome = (__runInitializers(this, _period_extraInitializers), __runInitializers(this, _monthlyIncome_initializers, void 0));
            // Доход за год (в долларах, накопительный)
            this.yearlyIncome = (__runInitializers(this, _monthlyIncome_extraInitializers), __runInitializers(this, _yearlyIncome_initializers, void 0));
            // Занятость (0-100)
            this.occupancy = (__runInitializers(this, _yearlyIncome_extraInitializers), __runInitializers(this, _occupancy_initializers, void 0));
            // ADR (Average Daily Rate) в долларах
            this.adr = (__runInitializers(this, _occupancy_extraInitializers), __runInitializers(this, _adr_initializers, void 0));
            // Выплачено клиенту за период (в долларах)
            this.payoutAmount = (__runInitializers(this, _adr_extraInitializers), __runInitializers(this, _payoutAmount_initializers, void 0));
            // Дата выплаты
            this.payoutDate = (__runInitializers(this, _payoutAmount_extraInitializers), __runInitializers(this, _payoutDate_initializers, void 0));
            this.createdAt = (__runInitializers(this, _payoutDate_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
        return PropertyMetrics_1;
    }());
    __setFunctionName(_classThis, "PropertyMetrics");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _property_decorators = [(0, typeorm_1.ManyToOne)(function () { return owner_property_entity_1.OwnerProperty; }, function (property) { return property.metrics; }, { nullable: false, onDelete: 'CASCADE' })];
        _propertyId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _period_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 7 })];
        _monthlyIncome_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 })];
        _yearlyIncome_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 })];
        _occupancy_decorators = [(0, typeorm_1.Column)({ type: 'integer', default: 0 })];
        _adr_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true })];
        _payoutAmount_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 })];
        _payoutDate_decorators = [(0, typeorm_1.Column)({ type: 'date', nullable: true })];
        _createdAt_decorators = [(0, typeorm_1.Column)({ type: 'datetime', default: function () { return 'CURRENT_TIMESTAMP'; } })];
        _updatedAt_decorators = [(0, typeorm_1.Column)({ type: 'datetime', default: function () { return 'CURRENT_TIMESTAMP'; }, onUpdate: 'CURRENT_TIMESTAMP' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _property_decorators, { kind: "field", name: "property", static: false, private: false, access: { has: function (obj) { return "property" in obj; }, get: function (obj) { return obj.property; }, set: function (obj, value) { obj.property = value; } }, metadata: _metadata }, _property_initializers, _property_extraInitializers);
        __esDecorate(null, null, _propertyId_decorators, { kind: "field", name: "propertyId", static: false, private: false, access: { has: function (obj) { return "propertyId" in obj; }, get: function (obj) { return obj.propertyId; }, set: function (obj, value) { obj.propertyId = value; } }, metadata: _metadata }, _propertyId_initializers, _propertyId_extraInitializers);
        __esDecorate(null, null, _period_decorators, { kind: "field", name: "period", static: false, private: false, access: { has: function (obj) { return "period" in obj; }, get: function (obj) { return obj.period; }, set: function (obj, value) { obj.period = value; } }, metadata: _metadata }, _period_initializers, _period_extraInitializers);
        __esDecorate(null, null, _monthlyIncome_decorators, { kind: "field", name: "monthlyIncome", static: false, private: false, access: { has: function (obj) { return "monthlyIncome" in obj; }, get: function (obj) { return obj.monthlyIncome; }, set: function (obj, value) { obj.monthlyIncome = value; } }, metadata: _metadata }, _monthlyIncome_initializers, _monthlyIncome_extraInitializers);
        __esDecorate(null, null, _yearlyIncome_decorators, { kind: "field", name: "yearlyIncome", static: false, private: false, access: { has: function (obj) { return "yearlyIncome" in obj; }, get: function (obj) { return obj.yearlyIncome; }, set: function (obj, value) { obj.yearlyIncome = value; } }, metadata: _metadata }, _yearlyIncome_initializers, _yearlyIncome_extraInitializers);
        __esDecorate(null, null, _occupancy_decorators, { kind: "field", name: "occupancy", static: false, private: false, access: { has: function (obj) { return "occupancy" in obj; }, get: function (obj) { return obj.occupancy; }, set: function (obj, value) { obj.occupancy = value; } }, metadata: _metadata }, _occupancy_initializers, _occupancy_extraInitializers);
        __esDecorate(null, null, _adr_decorators, { kind: "field", name: "adr", static: false, private: false, access: { has: function (obj) { return "adr" in obj; }, get: function (obj) { return obj.adr; }, set: function (obj, value) { obj.adr = value; } }, metadata: _metadata }, _adr_initializers, _adr_extraInitializers);
        __esDecorate(null, null, _payoutAmount_decorators, { kind: "field", name: "payoutAmount", static: false, private: false, access: { has: function (obj) { return "payoutAmount" in obj; }, get: function (obj) { return obj.payoutAmount; }, set: function (obj, value) { obj.payoutAmount = value; } }, metadata: _metadata }, _payoutAmount_initializers, _payoutAmount_extraInitializers);
        __esDecorate(null, null, _payoutDate_decorators, { kind: "field", name: "payoutDate", static: false, private: false, access: { has: function (obj) { return "payoutDate" in obj; }, get: function (obj) { return obj.payoutDate; }, set: function (obj, value) { obj.payoutDate = value; } }, metadata: _metadata }, _payoutDate_initializers, _payoutDate_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PropertyMetrics = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PropertyMetrics = _classThis;
}();
exports.PropertyMetrics = PropertyMetrics;
