"use strict";
exports.__esModule = true;
var Entity_1 = require("./Entity");
var Vector_1 = require("./Vector");
var Simulator = /** @class */ (function () {
    function Simulator(entityLimit, initialInfected, hospitalCapacity, infectionRate, recoveringRate, timeToCure, socialDistancingRate, mobilityRate, confinedArea, areaOfInfluence, entitySize) {
        this.entityLimit = entityLimit;
        this.initialInfected = initialInfected;
        this.hospitalCapacity = hospitalCapacity;
        this.infectionRate = infectionRate;
        this.recoveringRate = recoveringRate;
        this.timeToCure = Math.floor(Math.random() * (timeToCure * 2 - timeToCure)) + 1;
        ;
        this.socialDistancingRate = socialDistancingRate;
        this.mobilityRate = mobilityRate;
        this.confinedArea = confinedArea;
        this.areaOfInfluence = areaOfInfluence;
        this.entitySize = entitySize;
        this.infectedCount = 0;
        this.hospitalizedCount = 0;
        this.curedCount = 0;
        this.deadCount = 0;
        this.startEntities();
    }
    Simulator.prototype.startEntities = function () {
        this.entities = new Array();
        var randomValue = 0;
        for (var i = 0; i < this.entityLimit; i++) {
            var infected = false;
            if (this.infectedCount < this.initialInfected) {
                infected = true;
                this.infectedCount++;
            }
            var mobility = false;
            randomValue = Math.floor(Math.random() * (100)) + 1;
            mobility = randomValue <= this.mobilityRate;
            var socialDistancing = false;
            randomValue = Math.floor(Math.random() * (100)) + 1;
            socialDistancing = randomValue <= this.socialDistancingRate;
            this.entities.push(new Entity_1.Entity(i, infected, socialDistancing, mobility, this.confinedArea, this.areaOfInfluence, this.entitySize));
        }
    };
    Simulator.prototype.tick = function () {
        for (var _i = 0, _a = this.entities; _i < _a.length; _i++) {
            var entity = _a[_i];
            // moviment updates
            if (entity.isMobile) {
                if (entity.isSocialDistancing) {
                    for (var _b = 0, _c = this.entities; _b < _c.length; _b++) {
                        var otherEntity = _c[_b];
                        if (entity.id === otherEntity.id) {
                            continue;
                        }
                        if ((entity.position.distanceTo(otherEntity.position)) <= ((this.areaOfInfluence + (this.entitySize * 2)) + 1)) {
                            var repulsion = new Vector_1.Vector(entity.position.getX() - otherEntity.position.getX(), entity.position.getY() - otherEntity.position.getY());
                            // repulsion.scale(0.025);
                            entity.acceleration.add(repulsion);
                        }
                    }
                }
                entity.updatePosition();
            }
            entity.moviment.limit(5);
            // infection updates
            if (entity.isInfected) {
                for (var _d = 0, _e = this.entities; _d < _e.length; _d++) {
                    var otherEntity = _e[_d];
                    if (entity.id === otherEntity.id) {
                        continue;
                    }
                    if (otherEntity.isDead || otherEntity.isCured || otherEntity.isInfected) {
                        continue;
                    }
                    if (entity.position.distanceTo(otherEntity.position) < ((this.areaOfInfluence + (this.entitySize * 2)) + 1)) {
                        var chance = Math.floor(Math.random() * (100)) + 1;
                        if (chance <= this.infectionRate) {
                            otherEntity.isInfected = true;
                            this.infectedCount++;
                        }
                    }
                }
                entity.infectionDuration++;
                if (entity.infectionDuration >= this.timeToCure) {
                    var chance = Math.floor(Math.random() * (100)) + 1;
                    if (chance <= this.recoveringRate) {
                        entity.isCured = true;
                        entity.isInfected = false;
                        this.infectedCount--;
                        this.curedCount++;
                    }
                    else {
                        entity.isDead = true;
                        entity.isInfected = false;
                        entity.isMobile = false;
                        this.infectedCount--;
                        this.deadCount++;
                    }
                }
            }
        }
    };
    return Simulator;
}());
exports.Simulator = Simulator;
