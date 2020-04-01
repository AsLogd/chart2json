"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Success(value) {
    return {
        tag: "success",
        value
    };
}
exports.Success = Success;
function Failure(reason) {
    return {
        tag: "failure",
        reason
    };
}
exports.Failure = Failure;
