"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var Simulator_1 = require("./Simulator");
var tickLimit, entityLimit, initialInfected, hospitalCapacity, infectionRate, recoveringRate, timeToCure, socialDistancingRate, mobilityRate, confinedArea, areaOfInfluence, entitySize, maxNoChangeTicks;
var showInfluenceArea = false;
var showId = false;
var currSleep = 0;
var getFieldValues = function () {
    tickLimit = parseInt(document.getElementById("tickLimit").value);
    entityLimit = parseInt(document.getElementById("entityLimit").value);
    initialInfected = parseInt(document.getElementById("initialInfected").value);
    hospitalCapacity = parseInt(document.getElementById("hospitalCapacity").value);
    infectionRate = parseInt(document.getElementById("infectionRate").value);
    recoveringRate = parseInt(document.getElementById("recoveringRate").value);
    timeToCure = parseInt(document.getElementById("timeToCure").value);
    socialDistancingRate = parseInt(document.getElementById("socialDistancingRate").value);
    mobilityRate = parseInt(document.getElementById("mobilityRate").value);
    confinedArea = parseInt(document.getElementById("confinedArea").value);
    areaOfInfluence = parseInt(document.getElementById("areaOfInfluence").value);
    entitySize = parseInt(document.getElementById("entitySize").value);
    maxNoChangeTicks = parseInt(document.getElementById("maxNoChangeTicks").value);
    showId = document.getElementById("showId").checked;
    showInfluenceArea = document.getElementById("showInfluenceArea").checked;
};
// defaults
var setDefaults = function (data) {
    var defaultConfig = {
        tickLimit: '1000',
        entityLimit: '50',
        initialInfected: '5',
        hospitalCapacity: '10',
        infectionRate: '80',
        recoveringRate: '20',
        timeToCure: '100',
        socialDistancingRate: '50',
        mobilityRate: '75',
        confinedArea: '800',
        areaOfInfluence: '7',
        entitySize: '2',
        maxNoChangeTicks: '200',
        currSleep: '0',
        showId: false,
        showInfluenceArea: false
    };
    if (data) {
        defaultConfig = Object.assign({}, data);
    }
    document.getElementById("tickLimit").value = defaultConfig.tickLimit;
    document.getElementById("entityLimit").value = defaultConfig.entityLimit;
    document.getElementById("initialInfected").value = defaultConfig.initialInfected;
    document.getElementById("hospitalCapacity").value = defaultConfig.hospitalCapacity;
    document.getElementById("infectionRate").value = defaultConfig.infectionRate;
    document.getElementById("recoveringRate").value = defaultConfig.recoveringRate;
    document.getElementById("timeToCure").value = defaultConfig.timeToCure;
    document.getElementById("socialDistancingRate").value = defaultConfig.socialDistancingRate;
    document.getElementById("mobilityRate").value = defaultConfig.mobilityRate;
    document.getElementById("confinedArea").value = defaultConfig.confinedArea;
    document.getElementById("areaOfInfluence").value = defaultConfig.areaOfInfluence;
    document.getElementById("entitySize").value = defaultConfig.entitySize;
    document.getElementById("maxNoChangeTicks").value = defaultConfig.maxNoChangeTicks;
    document.getElementById("sleep").value = defaultConfig.currSleep;
    document.getElementById("currSleep").textContent = defaultConfig.currSleep;
    document.getElementById("showId").checked = defaultConfig.showId;
    document.getElementById("showInfluenceArea").checked = defaultConfig.showInfluenceArea;
    showId = document.getElementById("showId").checked;
    showInfluenceArea = document.getElementById("showInfluenceArea").checked;
    document.getElementById("showInfluenceArea").addEventListener('mouseup', function () {
        showInfluenceArea = !showInfluenceArea;
    });
    document.getElementById("showId").addEventListener('mouseup', function () {
        showId = !showId;
    });
    currSleep = parseInt(defaultConfig.currSleep);
    document.getElementById("sleep").addEventListener('mouseup', function () {
        currSleep = parseInt(document.getElementById("sleep").value);
        document.getElementById("currSleep").textContent = "" + currSleep;
    });
};
var reDrawEntities = function (ctx, covidSimulator) {
    drawCanvas(ctx);
    for (var _i = 0, _a = covidSimulator.entities; _i < _a.length; _i++) {
        var entity = _a[_i];
        drawPoint(entity, ctx);
    }
};
var drawEntitesFromLocalStorage = function (ctx, entities) {
    getFieldValues();
    drawCanvas(ctx);
    for (var _i = 0, entities_1 = entities; _i < entities_1.length; _i++) {
        var entity = entities_1[_i];
        ctx.beginPath();
        var status_1 = {
            isDead: entity.isDead,
            isInfected: entity.isInfected,
            isCured: entity.isCured,
            isSocialDistancing: entity.isSocialDistancing
        };
        ctx.fillStyle = getColor(status_1);
        ctx.arc(entity.position.x, entity.position.y, entitySize, 0, 2 * Math.PI);
        ctx.fill();
        if (showId) {
            ctx.font = "20px";
            ctx.fillText("" + entity.id, entity.position.x + 10, entity.position.y);
        }
        if (showInfluenceArea) {
            drawInfluenceArea(entity.position.x, entity.position.y, ctx);
        }
    }
};
var drawCanvas = function (ctx) {
    ctx.clearRect(0, 0, confinedArea, confinedArea);
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.fillRect(0, 0, confinedArea, confinedArea);
    ctx.stroke();
};
var drawPoint = function (entity, ctx) {
    ctx.beginPath();
    ctx.fillStyle = getColor(entity);
    ctx.arc(entity.position.getX(), entity.position.getY(), entitySize, 0, 2 * Math.PI);
    ctx.fill();
    if (showId) {
        ctx.font = "20px";
        ctx.fillText("" + entity.id, entity.position.getX() + entitySize + 1, entity.position.getY());
    }
    if (showInfluenceArea) {
        drawInfluenceArea(entity.position.getX(), entity.position.getY(), ctx);
    }
};
var drawInfluenceArea = function (x, y, ctx) {
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.arc(x, y, areaOfInfluence + entitySize, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
};
var getColor = function (_a) {
    var isDead = _a.isDead, isInfected = _a.isInfected, isCured = _a.isCured, isSocialDistancing = _a.isSocialDistancing;
    if (isDead) {
        return '#ded81c';
    }
    if (isInfected) {
        return '#ff3c00';
    }
    if (isCured) {
        return '#1c83de';
    }
    if (isSocialDistancing) {
        return '#22de1c';
    }
    return '#9e5cea';
};
var updateCounts = function (covidSimulator) {
    document.getElementById("numDead").textContent = "" + covidSimulator.deadCount;
    document.getElementById("numInfected").textContent = "" + covidSimulator.infectedCount;
    document.getElementById("numCured").textContent = "" + covidSimulator.curedCount;
};
var startPloter = function (data) {
    function touchZoomPlugin(opts) {
        function init(u, opts, data) {
            var plot = u.root.querySelector(".over");
            var rect, oxRange, oyRange, xVal, yVal;
            var fr = { x: 0, y: 0, dx: 0, dy: 0 };
            var to = { x: 0, y: 0, dx: 0, dy: 0 };
            function storePos(t, e) {
                var ts = e.touches;
                var t0 = ts[0];
                var t0x = t0.clientX - rect.left;
                var t0y = t0.clientY - rect.top;
                if (ts.length == 1) {
                    t.x = t0x;
                    t.y = t0y;
                    t.d = 0;
                }
                else {
                    var t1 = e.touches[1];
                    var t1x = t1.clientX - rect.left;
                    var t1y = t1.clientY - rect.top;
                    var xMin = Math.min(t0x, t1x);
                    var yMin = Math.min(t0y, t1y);
                    var xMax = Math.max(t0x, t1x);
                    var yMax = Math.max(t0y, t1y);
                    // midpts
                    t.y = (yMin + yMax) / 2;
                    t.x = (xMin + xMax) / 2;
                    t.dx = xMax - xMin;
                    t.dy = yMax - yMin;
                    // dist
                    t.d = Math.sqrt(t.dx * t.dx + t.dy * t.dy);
                }
            }
            var rafPending = false;
            function zoom() {
                rafPending = false;
                var left = to.x;
                var top = to.y;
                // non-uniform scaling
                //	let xFactor = fr.dx / to.dx;
                //	let yFactor = fr.dy / to.dy;
                // uniform x/y scaling
                var xFactor = fr.dx / to.dx;
                var yFactor = fr.dy / to.dy;
                var leftPct = left / rect.width;
                var btmPct = 1 - top / rect.height;
                var nxRange = oxRange * xFactor;
                var nxMin = xVal - leftPct * nxRange;
                var nxMax = nxMin + nxRange;
                var nyRange = oyRange * yFactor;
                var nyMin = yVal - btmPct * nyRange;
                var nyMax = nyMin + nyRange;
                u.batch(function () {
                    u.setScale("x", {
                        min: nxMin,
                        max: nxMax
                    });
                    u.setScale("y", {
                        min: nyMin,
                        max: nyMax
                    });
                });
            }
            function touchmove(e) {
                storePos(to, e);
                if (!rafPending) {
                    rafPending = true;
                    requestAnimationFrame(zoom);
                }
            }
            plot.addEventListener("touchstart", function (e) {
                rect = plot.getBoundingClientRect();
                storePos(fr, e);
                oxRange = u.scales.x.max - u.scales.x.min;
                oyRange = u.scales.y.max - u.scales.y.min;
                var left = fr.x;
                var top = fr.y;
                xVal = u.posToVal(left, "x");
                yVal = u.posToVal(top, "y");
                document.addEventListener("touchmove", touchmove, { passive: true });
            });
            plot.addEventListener("touchend", function (e) {
                document.removeEventListener("touchmove", touchmove);
            });
        }
        return {
            hooks: {
                init: init
            }
        };
    }
    var plots = document.getElementsByClassName('uplot');
    if (plots) {
        for (var i = 0; i < plots.length; i++) {
            plots.item(i).remove();
        }
    }
    var opts = {
        width: 1500,
        height: 600,
        title: "Area Fill",
        plugins: [
            touchZoomPlugin()
        ],
        scales: {
            x: {
                time: false,
                label: "Tick"
            }
        },
        series: [
            {},
            {
                stroke: "gray",
                fill: "rgba(222, 216, 28,0.1)",
                label: "Dead"
            },
            {
                stroke: "red",
                fill: "rgba(255, 60, 0,0.1)",
                label: "Infected"
            },
            {
                stroke: "blue",
                fill: "rgba(28, 131, 222,0.1)",
                label: "Cured"
            },
        ]
    };
    var u = new uPlot(opts, data, document.body);
    return u;
};
var getCanvas = function () {
    var c = document.getElementById("area");
    return c.getContext("2d");
};
var sleep = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, new Promise(function (r) { return setTimeout(r, currSleep); })];
}); }); };
var start = function () { return __awaiter(void 0, void 0, void 0, function () {
    var ctx, covidSimulator, tickIndex, deadCount, infectedCount, curedCount, plotter, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                document.getElementById("start").disabled = true;
                ctx = getCanvas();
                getFieldValues();
                window.localStorage.setItem('config', JSON.stringify({ tickLimit: tickLimit, entityLimit: entityLimit, initialInfected: initialInfected, hospitalCapacity: hospitalCapacity, infectionRate: infectionRate, recoveringRate: recoveringRate, timeToCure: timeToCure, socialDistancingRate: socialDistancingRate, mobilityRate: mobilityRate, confinedArea: confinedArea, areaOfInfluence: areaOfInfluence, currSleep: currSleep, entitySize: entitySize, maxNoChangeTicks: maxNoChangeTicks, showId: showId, showInfluenceArea: showInfluenceArea }));
                covidSimulator = new Simulator_1.Simulator(entityLimit, initialInfected, hospitalCapacity, infectionRate, recoveringRate, timeToCure, socialDistancingRate, mobilityRate, confinedArea, areaOfInfluence, entitySize);
                tickIndex = [];
                deadCount = [];
                infectedCount = [];
                curedCount = [];
                plotter = startPloter([tickIndex, deadCount, infectedCount, curedCount]);
                i = 0;
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < tickLimit)) return [3 /*break*/, 4];
                covidSimulator.tick();
                reDrawEntities(ctx, covidSimulator);
                updateCounts(covidSimulator);
                tickIndex.push(i + 1);
                deadCount.push(covidSimulator.deadCount);
                infectedCount.push(covidSimulator.infectedCount);
                curedCount.push(covidSimulator.curedCount);
                plotter.setData([tickIndex, deadCount, infectedCount, curedCount]);
                window.localStorage.setItem('counts', JSON.stringify([tickIndex, deadCount, infectedCount, curedCount]));
                window.localStorage.setItem('simulator', JSON.stringify(covidSimulator.entities));
                return [4 /*yield*/, sleep()];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
var restart = function () {
    getFieldValues();
    window.localStorage.setItem('config', JSON.stringify({ tickLimit: tickLimit, entityLimit: entityLimit, initialInfected: initialInfected, hospitalCapacity: hospitalCapacity, infectionRate: infectionRate, recoveringRate: recoveringRate, timeToCure: timeToCure, socialDistancingRate: socialDistancingRate, mobilityRate: mobilityRate, confinedArea: confinedArea, areaOfInfluence: areaOfInfluence, currSleep: currSleep, entitySize: entitySize, maxNoChangeTicks: maxNoChangeTicks, showId: showId, showInfluenceArea: showInfluenceArea }));
    var data = JSON.parse(window.localStorage.getItem('config'));
    data.execute = true;
    data.stoped = false;
    window.localStorage.setItem('config', JSON.stringify(data));
    window.location.reload(false);
};
var stop = function () {
    getFieldValues();
    window.localStorage.setItem('config', JSON.stringify({ tickLimit: tickLimit, entityLimit: entityLimit, initialInfected: initialInfected, hospitalCapacity: hospitalCapacity, infectionRate: infectionRate, recoveringRate: recoveringRate, timeToCure: timeToCure, socialDistancingRate: socialDistancingRate, mobilityRate: mobilityRate, confinedArea: confinedArea, areaOfInfluence: areaOfInfluence, currSleep: currSleep, entitySize: entitySize, maxNoChangeTicks: maxNoChangeTicks, showId: showId, showInfluenceArea: showInfluenceArea }));
    var data = JSON.parse(window.localStorage.getItem('config'));
    data.execute = false;
    data.stoped = true;
    window.localStorage.setItem('config', JSON.stringify(data));
    window.location.reload(false);
};
function run() {
    document.getElementById("start").addEventListener('mouseup', start);
    document.getElementById("restart").addEventListener('mouseup', restart);
    document.getElementById("stop").addEventListener('mouseup', stop);
    var data = JSON.parse(window.localStorage.getItem('config'));
    if (!data) {
        setDefaults();
    }
    else {
        setDefaults(data);
        data.execute ? start() : null;
        if (data.stoped) {
            var ctx = getCanvas();
            var entities = JSON.parse(window.localStorage.getItem('simulator'));
            drawEntitesFromLocalStorage(ctx, entities);
            startPloter(JSON.parse(window.localStorage.getItem('counts')));
        }
    }
}
window.onload = run;
