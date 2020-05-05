"use strict";
exports.__esModule = true;
var Vector = /** @class */ (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.prototype.add = function (b) {
        this.x += b.x;
        this.y += b.y;
    };
    Vector.prototype.scale = function (scale) {
        this.x *= scale;
        this.y *= scale;
    };
    Vector.prototype.distanceTo = function (b) {
        return Math.sqrt(Math.pow((this.x - b.x), 2) + Math.pow((this.y - b.y), 2));
    };
    Vector.prototype.limit = function (limit) {
        if (limit === void 0) { limit = 1; }
        if (this.getMagnitude() > limit) {
            this.normalize();
            this.scale(limit);
        }
    };
    Vector.prototype.normalize = function () {
        var magnitude = this.getMagnitude();
        this.scale(1 / magnitude);
    };
    Vector.prototype.getMagnitude = function () {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    };
    Vector.prototype.getX = function () {
        return this.x;
    };
    Vector.prototype.getY = function () {
        return this.y;
    };
    Vector.prototype.setX = function (x) {
        this.x = x;
    };
    Vector.prototype.setY = function (y) {
        this.y = y;
    };
    return Vector;
}());
exports.Vector = Vector;
