"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stream = exports.StreamStatus = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
var StreamStatus;
(function (StreamStatus) {
    StreamStatus["PENDING"] = "pending";
    StreamStatus["LIVE"] = "live";
    StreamStatus["ENDED"] = "ended";
    StreamStatus["BANNED"] = "banned";
})(StreamStatus || (exports.StreamStatus = StreamStatus = {}));
let Stream = class Stream {
    constructor() {
        this.isLive = false;
        this.viewerCount = 0;
        this.status = StreamStatus.PENDING;
    }
};
exports.Stream = Stream;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Stream.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Stream.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Stream.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Stream.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Stream.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Stream.prototype, "isLive", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Stream.prototype, "viewerCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Stream.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { nullable: true }),
    __metadata("design:type", Array)
], Stream.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Stream.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Stream.prototype, "endedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: StreamStatus,
        default: StreamStatus.PENDING
    }),
    __metadata("design:type", String)
], Stream.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, user => user.streams),
    __metadata("design:type", User_1.User)
], Stream.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Stream.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Stream.prototype, "updatedAt", void 0);
exports.Stream = Stream = __decorate([
    (0, typeorm_1.Entity)()
], Stream);
//# sourceMappingURL=Stream.js.map