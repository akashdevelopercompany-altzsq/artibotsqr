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
exports.UpdateQrDto = exports.QRStatus = void 0;
const class_validator_1 = require("class-validator");
var QRStatus;
(function (QRStatus) {
    QRStatus["ACTIVE"] = "ACTIVE";
    QRStatus["INACTIVE"] = "INACTIVE";
    QRStatus["EXPIRED"] = "EXPIRED";
    QRStatus["BLOCKED"] = "BLOCKED";
})(QRStatus || (exports.QRStatus = QRStatus = {}));
class UpdateQrDto {
    name;
    destinationUrl;
    status;
}
exports.UpdateQrDto = UpdateQrDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateQrDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsUrl)({ require_protocol: true, allow_underscores: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateQrDto.prototype, "destinationUrl", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(QRStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateQrDto.prototype, "status", void 0);
//# sourceMappingURL=update-qr.dto.js.map