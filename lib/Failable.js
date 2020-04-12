"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Success(value) {
    return {
        ok: true,
        value
    };
}
exports.Success = Success;
function Failure(reason) {
    return {
        ok: false,
        reason
    };
}
exports.Failure = Failure;
