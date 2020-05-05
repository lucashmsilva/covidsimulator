"use strict";
exports.__esModule = true;
var Simulator_1 = require("./Simulator");
var maxTicks = 10000;
var maxNoChangeTicks;
var lastCounts = [-1, -1, -1];
var noChangeCount = 0;
var peakInfected = {
    count: 0,
    tick: 0
};
var configs = [{
        entityLimit: 1024,
        initialInfected: 5,
        hospitalCapacity: 200,
        infectionRate: 30,
        recoveringRate: 50,
        timeToCure: 400,
        socialDistancingRate: 60,
        mobilityRate: 60,
        confinedArea: 800,
        areaOfInfluence: 5,
        entitySize: 1
    }, {
        entityLimit: 1024,
        initialInfected: 5,
        hospitalCapacity: 200,
        infectionRate: 30,
        recoveringRate: 50,
        timeToCure: 400,
        socialDistancingRate: 20,
        mobilityRate: 60,
        confinedArea: 800,
        areaOfInfluence: 5,
        entitySize: 1
    }];
configs.forEach(function (config, index) {
    console.log("********************* CONFIG " + index + " *********************");
    for (var i = 0; i < 5; i++) {
        var simulator = new Simulator_1.Simulator(config.entityLimit, config.initialInfected, config.hospitalCapacity, config.infectionRate, config.recoveringRate, config.timeToCure, config.socialDistancingRate, config.mobilityRate, config.confinedArea, config.areaOfInfluence, config.entitySize);
        lastCounts = [-1, -1, -1];
        noChangeCount = 0;
        peakInfected.count = 0;
        peakInfected.count = 0;
        console.log("========= RUN " + i + " =========");
        console.log("start " + new Date);
        for (var j = 0; j < maxTicks; j++) {
            simulator.tick();
            if (simulator.curedCount === lastCounts[0] &&
                simulator.deadCount === lastCounts[1] &&
                simulator.infectedCount === lastCounts[2]) {
                noChangeCount++;
            }
            else {
                lastCounts[0] = simulator.curedCount;
                lastCounts[1] = simulator.deadCount;
                lastCounts[2] = simulator.infectedCount;
            }
            if (simulator.infectedCount > peakInfected.count) {
                peakInfected.count = simulator.infectedCount;
                peakInfected.tick = j;
            }
            if (noChangeCount === maxNoChangeTicks)
                break;
        }
        console.log("finish " + new Date);
        console.log("DEAD " + simulator.curedCount);
        console.log("CURED " + simulator.deadCount);
        console.log("PEAK INFECTED " + peakInfected.count + " AT " + peakInfected.tick);
        console.log("INFECTED " + simulator.infectedCount);
        console.log("============================");
    }
    console.log();
    console.log();
});
