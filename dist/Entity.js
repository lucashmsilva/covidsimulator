"use strict";
exports.__esModule = true;
var Vector_1 = require("./Vector");
var Entity = /** @class */ (function () {
    function Entity(id, isInfected, isSocialDistancing, isMobile, confinedArea, areaOfInfluence, entitySize) {
        this.id = id;
        this.isInfected = isInfected;
        this.isCured = false;
        this.isDead = false;
        this.isSocialDistancing = isSocialDistancing;
        this.isMobile = isMobile;
        this.confinedArea = confinedArea;
        this.areaOfInfluence = areaOfInfluence;
        this.entitySize = entitySize;
        this.infectionDuration = 0;
        var randomMovimentX = Math.floor(Math.random() * (10 - 5)) + 1;
        var randomMovimentY = Math.floor(Math.random() * (10 - 5)) + 1;
        this.moviment = new Vector_1.Vector(randomMovimentX, randomMovimentY);
        var randomPositionX = Math.floor(Math.random() * (this.confinedArea - this.entitySize - 5)) + 1;
        var randomPositionY = Math.floor(Math.random() * (this.confinedArea - this.entitySize - 5)) + 1;
        this.position = new Vector_1.Vector(randomPositionX, randomPositionY);
        this.acceleration = new Vector_1.Vector(0, 0);
    }
    Entity.prototype.updatePosition = function () {
        this.bounce();
        this.position.add(this.moviment);
        this.moviment.add(this.acceleration);
        this.acceleration.setX(0);
        this.acceleration.setY(0);
    };
    Entity.prototype.wrapArround = function () {
        if (this.position.getX() - this.entitySize > this.confinedArea) {
            this.position.setX(1 + this.entitySize);
        }
        if (this.position.getY() - this.entitySize > this.confinedArea) {
            this.position.setY(1 + this.entitySize);
        }
        if (this.position.getX() + this.entitySize < 0) {
            this.position.setX(this.confinedArea - 1 - this.entitySize);
        }
        if (this.position.getY() + this.entitySize < 0) {
            this.position.setY(this.confinedArea - 1 - this.entitySize);
        }
    };
    Entity.prototype.bounce = function () {
        if (this.position.getX() + this.moviment.getX() >= this.confinedArea - this.entitySize || this.position.getX() + this.moviment.getX() <= this.entitySize) {
            this.moviment.setX(-this.moviment.getX());
        }
        if (this.position.getY() + this.moviment.getY() >= this.confinedArea - this.entitySize || this.position.getY() + this.moviment.getY() <= this.entitySize) {
            this.moviment.setY(-this.moviment.getY());
        }
    };
    Entity.prototype.getDestrucedPosition = function () {
        return [this.position.getX, this.position.getY];
    };
    return Entity;
}());
exports.Entity = Entity;
