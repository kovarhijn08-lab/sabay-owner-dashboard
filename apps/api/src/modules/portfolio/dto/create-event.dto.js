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
exports.CreateEventDto = void 0;
var class_validator_1 = require("class-validator");
/**
 * DTO для создания события по объекту
 */
var CreateEventDto = function () {
    var _a;
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
    return _a = /** @class */ (function () {
            function CreateEventDto() {
                this.changeType = __runInitializers(this, _changeType_initializers, void 0);
                this.beforeValue = (__runInitializers(this, _changeType_extraInitializers), __runInitializers(this, _beforeValue_initializers, void 0));
                this.afterValue = (__runInitializers(this, _beforeValue_extraInitializers), __runInitializers(this, _afterValue_initializers, void 0));
                this.description = (__runInitializers(this, _afterValue_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                __runInitializers(this, _description_extraInitializers);
            }
            return CreateEventDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _changeType_decorators = [(0, class_validator_1.IsEnum)([
                    'construction_progress',
                    'construction_stage',
                    'completion_date',
                    'booking_added',
                    'expense_added',
                    'income_updated',
                    'valuation_updated',
                    'status_changed',
                ])];
            _beforeValue_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            _afterValue_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            _description_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _changeType_decorators, { kind: "field", name: "changeType", static: false, private: false, access: { has: function (obj) { return "changeType" in obj; }, get: function (obj) { return obj.changeType; }, set: function (obj, value) { obj.changeType = value; } }, metadata: _metadata }, _changeType_initializers, _changeType_extraInitializers);
            __esDecorate(null, null, _beforeValue_decorators, { kind: "field", name: "beforeValue", static: false, private: false, access: { has: function (obj) { return "beforeValue" in obj; }, get: function (obj) { return obj.beforeValue; }, set: function (obj, value) { obj.beforeValue = value; } }, metadata: _metadata }, _beforeValue_initializers, _beforeValue_extraInitializers);
            __esDecorate(null, null, _afterValue_decorators, { kind: "field", name: "afterValue", static: false, private: false, access: { has: function (obj) { return "afterValue" in obj; }, get: function (obj) { return obj.afterValue; }, set: function (obj, value) { obj.afterValue = value; } }, metadata: _metadata }, _afterValue_initializers, _afterValue_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateEventDto = CreateEventDto;
