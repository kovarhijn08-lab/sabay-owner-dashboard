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
exports.UpdateSLASettingsDto = void 0;
var class_validator_1 = require("class-validator");
var UpdateSLASettingsDto = function () {
    var _a;
    var _mode_decorators;
    var _mode_initializers = [];
    var _mode_extraInitializers = [];
    var _windowStartDay_decorators;
    var _windowStartDay_initializers = [];
    var _windowStartDay_extraInitializers = [];
    var _windowEndDay_decorators;
    var _windowEndDay_initializers = [];
    var _windowEndDay_extraInitializers = [];
    var _thresholdDays_decorators;
    var _thresholdDays_initializers = [];
    var _thresholdDays_extraInitializers = [];
    var _config_decorators;
    var _config_initializers = [];
    var _config_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateSLASettingsDto() {
                this.mode = __runInitializers(this, _mode_initializers, void 0);
                this.windowStartDay = (__runInitializers(this, _mode_extraInitializers), __runInitializers(this, _windowStartDay_initializers, void 0));
                this.windowEndDay = (__runInitializers(this, _windowStartDay_extraInitializers), __runInitializers(this, _windowEndDay_initializers, void 0));
                this.thresholdDays = (__runInitializers(this, _windowEndDay_extraInitializers), __runInitializers(this, _thresholdDays_initializers, void 0));
                this.config = (__runInitializers(this, _thresholdDays_extraInitializers), __runInitializers(this, _config_initializers, void 0));
                __runInitializers(this, _config_extraInitializers);
            }
            return UpdateSLASettingsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _mode_decorators = [(0, class_validator_1.IsEnum)(['monthly_window', 'days_threshold']), (0, class_validator_1.IsOptional)()];
            _windowStartDay_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _windowEndDay_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _thresholdDays_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _config_decorators = [(0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _mode_decorators, { kind: "field", name: "mode", static: false, private: false, access: { has: function (obj) { return "mode" in obj; }, get: function (obj) { return obj.mode; }, set: function (obj, value) { obj.mode = value; } }, metadata: _metadata }, _mode_initializers, _mode_extraInitializers);
            __esDecorate(null, null, _windowStartDay_decorators, { kind: "field", name: "windowStartDay", static: false, private: false, access: { has: function (obj) { return "windowStartDay" in obj; }, get: function (obj) { return obj.windowStartDay; }, set: function (obj, value) { obj.windowStartDay = value; } }, metadata: _metadata }, _windowStartDay_initializers, _windowStartDay_extraInitializers);
            __esDecorate(null, null, _windowEndDay_decorators, { kind: "field", name: "windowEndDay", static: false, private: false, access: { has: function (obj) { return "windowEndDay" in obj; }, get: function (obj) { return obj.windowEndDay; }, set: function (obj, value) { obj.windowEndDay = value; } }, metadata: _metadata }, _windowEndDay_initializers, _windowEndDay_extraInitializers);
            __esDecorate(null, null, _thresholdDays_decorators, { kind: "field", name: "thresholdDays", static: false, private: false, access: { has: function (obj) { return "thresholdDays" in obj; }, get: function (obj) { return obj.thresholdDays; }, set: function (obj, value) { obj.thresholdDays = value; } }, metadata: _metadata }, _thresholdDays_initializers, _thresholdDays_extraInitializers);
            __esDecorate(null, null, _config_decorators, { kind: "field", name: "config", static: false, private: false, access: { has: function (obj) { return "config" in obj; }, get: function (obj) { return obj.config; }, set: function (obj, value) { obj.config = value; } }, metadata: _metadata }, _config_initializers, _config_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateSLASettingsDto = UpdateSLASettingsDto;
