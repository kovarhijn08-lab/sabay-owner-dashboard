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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMetricsDto = void 0;
var class_validator_1 = require("class-validator");
/**
 * DTO для обновления метрик доходности
 */
var UpdateMetricsDto = function () {
    var _a;
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
    return _a = /** @class */ (function () {
            function UpdateMetricsDto() {
                this.period = __runInitializers(this, _period_initializers, void 0); // Формат: 'YYYY-MM'
                this.monthlyIncome = (__runInitializers(this, _period_extraInitializers), __runInitializers(this, _monthlyIncome_initializers, void 0));
                this.yearlyIncome = (__runInitializers(this, _monthlyIncome_extraInitializers), __runInitializers(this, _yearlyIncome_initializers, void 0));
                this.occupancy = (__runInitializers(this, _yearlyIncome_extraInitializers), __runInitializers(this, _occupancy_initializers, void 0));
                this.adr = (__runInitializers(this, _occupancy_extraInitializers), __runInitializers(this, _adr_initializers, void 0));
                this.payoutAmount = (__runInitializers(this, _adr_extraInitializers), __runInitializers(this, _payoutAmount_initializers, void 0));
                this.payoutDate = (__runInitializers(this, _payoutAmount_extraInitializers), __runInitializers(this, _payoutDate_initializers, void 0));
                __runInitializers(this, _payoutDate_extraInitializers);
            }
            return UpdateMetricsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _period_decorators = [(0, class_validator_1.IsString)()];
            _monthlyIncome_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _yearlyIncome_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _occupancy_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _adr_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _payoutAmount_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _payoutDate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            __esDecorate(null, null, _period_decorators, { kind: "field", name: "period", static: false, private: false, access: { has: function (obj) { return "period" in obj; }, get: function (obj) { return obj.period; }, set: function (obj, value) { obj.period = value; } }, metadata: _metadata }, _period_initializers, _period_extraInitializers);
            __esDecorate(null, null, _monthlyIncome_decorators, { kind: "field", name: "monthlyIncome", static: false, private: false, access: { has: function (obj) { return "monthlyIncome" in obj; }, get: function (obj) { return obj.monthlyIncome; }, set: function (obj, value) { obj.monthlyIncome = value; } }, metadata: _metadata }, _monthlyIncome_initializers, _monthlyIncome_extraInitializers);
            __esDecorate(null, null, _yearlyIncome_decorators, { kind: "field", name: "yearlyIncome", static: false, private: false, access: { has: function (obj) { return "yearlyIncome" in obj; }, get: function (obj) { return obj.yearlyIncome; }, set: function (obj, value) { obj.yearlyIncome = value; } }, metadata: _metadata }, _yearlyIncome_initializers, _yearlyIncome_extraInitializers);
            __esDecorate(null, null, _occupancy_decorators, { kind: "field", name: "occupancy", static: false, private: false, access: { has: function (obj) { return "occupancy" in obj; }, get: function (obj) { return obj.occupancy; }, set: function (obj, value) { obj.occupancy = value; } }, metadata: _metadata }, _occupancy_initializers, _occupancy_extraInitializers);
            __esDecorate(null, null, _adr_decorators, { kind: "field", name: "adr", static: false, private: false, access: { has: function (obj) { return "adr" in obj; }, get: function (obj) { return obj.adr; }, set: function (obj, value) { obj.adr = value; } }, metadata: _metadata }, _adr_initializers, _adr_extraInitializers);
            __esDecorate(null, null, _payoutAmount_decorators, { kind: "field", name: "payoutAmount", static: false, private: false, access: { has: function (obj) { return "payoutAmount" in obj; }, get: function (obj) { return obj.payoutAmount; }, set: function (obj, value) { obj.payoutAmount = value; } }, metadata: _metadata }, _payoutAmount_initializers, _payoutAmount_extraInitializers);
            __esDecorate(null, null, _payoutDate_decorators, { kind: "field", name: "payoutDate", static: false, private: false, access: { has: function (obj) { return "payoutDate" in obj; }, get: function (obj) { return obj.payoutDate; }, set: function (obj, value) { obj.payoutDate = value; } }, metadata: _metadata }, _payoutDate_initializers, _payoutDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateMetricsDto = UpdateMetricsDto;
