"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.Follow = void 0;
var sequelize_typescript_1 = require("sequelize-typescript");
var User_1 = require("./User");
var Follow = function () {
    var _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'follows',
            timestamps: true,
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = sequelize_typescript_1.Model;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _followerId_decorators;
    var _followerId_initializers = [];
    var _followerId_extraInitializers = [];
    var _followingId_decorators;
    var _followingId_initializers = [];
    var _followingId_extraInitializers = [];
    var _follower_decorators;
    var _follower_initializers = [];
    var _follower_extraInitializers = [];
    var _following_decorators;
    var _following_initializers = [];
    var _following_extraInitializers = [];
    var Follow = _classThis = /** @class */ (function (_super) {
        __extends(Follow_1, _super);
        function Follow_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.id = __runInitializers(_this, _id_initializers, void 0);
            _this.followerId = (__runInitializers(_this, _id_extraInitializers), __runInitializers(_this, _followerId_initializers, void 0));
            _this.followingId = (__runInitializers(_this, _followerId_extraInitializers), __runInitializers(_this, _followingId_initializers, void 0));
            _this.follower = (__runInitializers(_this, _followingId_extraInitializers), __runInitializers(_this, _follower_initializers, void 0));
            _this.following = (__runInitializers(_this, _follower_extraInitializers), __runInitializers(_this, _following_initializers, void 0));
            __runInitializers(_this, _following_extraInitializers);
            return _this;
        }
        return Follow_1;
    }(_classSuper));
    __setFunctionName(_classThis, "Follow");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _followerId_decorators = [(0, sequelize_typescript_1.ForeignKey)(function () { return User_1.User; }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _followingId_decorators = [(0, sequelize_typescript_1.ForeignKey)(function () { return User_1.User; }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _follower_decorators = [(0, sequelize_typescript_1.BelongsTo)(function () { return User_1.User; }, 'followerId')];
        _following_decorators = [(0, sequelize_typescript_1.BelongsTo)(function () { return User_1.User; }, 'followingId')];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _followerId_decorators, { kind: "field", name: "followerId", static: false, private: false, access: { has: function (obj) { return "followerId" in obj; }, get: function (obj) { return obj.followerId; }, set: function (obj, value) { obj.followerId = value; } }, metadata: _metadata }, _followerId_initializers, _followerId_extraInitializers);
        __esDecorate(null, null, _followingId_decorators, { kind: "field", name: "followingId", static: false, private: false, access: { has: function (obj) { return "followingId" in obj; }, get: function (obj) { return obj.followingId; }, set: function (obj, value) { obj.followingId = value; } }, metadata: _metadata }, _followingId_initializers, _followingId_extraInitializers);
        __esDecorate(null, null, _follower_decorators, { kind: "field", name: "follower", static: false, private: false, access: { has: function (obj) { return "follower" in obj; }, get: function (obj) { return obj.follower; }, set: function (obj, value) { obj.follower = value; } }, metadata: _metadata }, _follower_initializers, _follower_extraInitializers);
        __esDecorate(null, null, _following_decorators, { kind: "field", name: "following", static: false, private: false, access: { has: function (obj) { return "following" in obj; }, get: function (obj) { return obj.following; }, set: function (obj, value) { obj.following = value; } }, metadata: _metadata }, _following_initializers, _following_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Follow = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Follow = _classThis;
}();
exports.Follow = Follow;
