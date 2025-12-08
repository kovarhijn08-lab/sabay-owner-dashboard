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
exports.MarketBenchmark = void 0;
var typeorm_1 = require("typeorm");
/**
 * Сущность MarketBenchmark - рыночные показатели по районам
 *
 * Что здесь хранится:
 * - Средний ADR по району
 * - Средняя занятость по району
 * - Средняя доходность по району
 */
var MarketBenchmark = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('market_benchmarks')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _region_decorators;
    var _region_initializers = [];
    var _region_extraInitializers = [];
    var _adrAvg_decorators;
    var _adrAvg_initializers = [];
    var _adrAvg_extraInitializers = [];
    var _occupancyAvg_decorators;
    var _occupancyAvg_initializers = [];
    var _occupancyAvg_extraInitializers = [];
    var _yieldAvg_decorators;
    var _yieldAvg_initializers = [];
    var _yieldAvg_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var MarketBenchmark = _classThis = /** @class */ (function () {
        function MarketBenchmark_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            // Район на Пхукете
            this.region = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _region_initializers, void 0));
            // Средний ADR (Average Daily Rate) в долларах
            this.adrAvg = (__runInitializers(this, _region_extraInitializers), __runInitializers(this, _adrAvg_initializers, void 0));
            // Средняя занятость (0-100)
            this.occupancyAvg = (__runInitializers(this, _adrAvg_extraInitializers), __runInitializers(this, _occupancyAvg_initializers, void 0));
            // Средняя доходность (%)
            this.yieldAvg = (__runInitializers(this, _occupancyAvg_extraInitializers), __runInitializers(this, _yieldAvg_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _yieldAvg_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
        return MarketBenchmark_1;
    }());
    __setFunctionName(_classThis, "MarketBenchmark");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _region_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true })];
        _adrAvg_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 })];
        _occupancyAvg_decorators = [(0, typeorm_1.Column)({ type: 'integer' })];
        _yieldAvg_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 })];
        _updatedAt_decorators = [(0, typeorm_1.Column)({ type: 'datetime', default: function () { return 'CURRENT_TIMESTAMP'; } })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _region_decorators, { kind: "field", name: "region", static: false, private: false, access: { has: function (obj) { return "region" in obj; }, get: function (obj) { return obj.region; }, set: function (obj, value) { obj.region = value; } }, metadata: _metadata }, _region_initializers, _region_extraInitializers);
        __esDecorate(null, null, _adrAvg_decorators, { kind: "field", name: "adrAvg", static: false, private: false, access: { has: function (obj) { return "adrAvg" in obj; }, get: function (obj) { return obj.adrAvg; }, set: function (obj, value) { obj.adrAvg = value; } }, metadata: _metadata }, _adrAvg_initializers, _adrAvg_extraInitializers);
        __esDecorate(null, null, _occupancyAvg_decorators, { kind: "field", name: "occupancyAvg", static: false, private: false, access: { has: function (obj) { return "occupancyAvg" in obj; }, get: function (obj) { return obj.occupancyAvg; }, set: function (obj, value) { obj.occupancyAvg = value; } }, metadata: _metadata }, _occupancyAvg_initializers, _occupancyAvg_extraInitializers);
        __esDecorate(null, null, _yieldAvg_decorators, { kind: "field", name: "yieldAvg", static: false, private: false, access: { has: function (obj) { return "yieldAvg" in obj; }, get: function (obj) { return obj.yieldAvg; }, set: function (obj, value) { obj.yieldAvg = value; } }, metadata: _metadata }, _yieldAvg_initializers, _yieldAvg_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MarketBenchmark = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MarketBenchmark = _classThis;
}();
exports.MarketBenchmark = MarketBenchmark;
