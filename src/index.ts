import { Simulator } from "./Simulator";
import { Entity } from "./Entity";

declare let uPlot: any;
let tickLimit, entityLimit, initialInfected, hospitalCapacity, infectionRate, recoveringRate, timeToCure, socialDistancingRate, mobilityRate, confinedArea, areaOfInfluence, entitySize, maxNoChangeTicks;
let showInfluenceArea = false;
let showId = false;
let currSleep = 0;


const getFieldValues = () => {
  tickLimit = parseInt((<HTMLInputElement>document.getElementById("tickLimit")).value);
  entityLimit = parseInt((<HTMLInputElement>document.getElementById("entityLimit")).value);
  initialInfected = parseInt((<HTMLInputElement>document.getElementById("initialInfected")).value);
  hospitalCapacity = parseInt((<HTMLInputElement>document.getElementById("hospitalCapacity")).value);
  infectionRate = parseInt((<HTMLInputElement>document.getElementById("infectionRate")).value);
  recoveringRate = parseInt((<HTMLInputElement>document.getElementById("recoveringRate")).value);
  timeToCure = parseInt((<HTMLInputElement>document.getElementById("timeToCure")).value);
  socialDistancingRate = parseInt((<HTMLInputElement>document.getElementById("socialDistancingRate")).value);
  mobilityRate = parseInt((<HTMLInputElement>document.getElementById("mobilityRate")).value);
  confinedArea = parseInt((<HTMLInputElement>document.getElementById("confinedArea")).value);
  areaOfInfluence = parseInt((<HTMLInputElement>document.getElementById("areaOfInfluence")).value);
  entitySize = parseInt((<HTMLInputElement>document.getElementById("entitySize")).value);
  maxNoChangeTicks = parseInt((<HTMLInputElement>document.getElementById("maxNoChangeTicks")).value);
  showId = (<HTMLInputElement>document.getElementById("showId")).checked;
  showInfluenceArea = (<HTMLInputElement>document.getElementById("showInfluenceArea")).checked;
}

// defaults
const setDefaults = (data?) => {
  let defaultConfig = {
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
    defaultConfig = Object.assign({},data);
  }

  (<HTMLInputElement> document.getElementById("tickLimit")).value = defaultConfig.tickLimit;
  (<HTMLInputElement> document.getElementById("entityLimit")).value = defaultConfig.entityLimit;
  (<HTMLInputElement> document.getElementById("initialInfected")).value = defaultConfig.initialInfected;
  (<HTMLInputElement> document.getElementById("hospitalCapacity")).value = defaultConfig.hospitalCapacity;
  (<HTMLInputElement> document.getElementById("infectionRate")).value = defaultConfig.infectionRate;
  (<HTMLInputElement> document.getElementById("recoveringRate")).value = defaultConfig.recoveringRate;
  (<HTMLInputElement> document.getElementById("timeToCure")).value = defaultConfig.timeToCure;
  (<HTMLInputElement> document.getElementById("socialDistancingRate")).value = defaultConfig.socialDistancingRate;
  (<HTMLInputElement> document.getElementById("mobilityRate")).value = defaultConfig.mobilityRate;
  (<HTMLInputElement> document.getElementById("confinedArea")).value = defaultConfig.confinedArea;
  (<HTMLInputElement> document.getElementById("areaOfInfluence")).value = defaultConfig.areaOfInfluence;
  (<HTMLInputElement> document.getElementById("entitySize")).value = defaultConfig.entitySize;
  (<HTMLInputElement>document.getElementById("maxNoChangeTicks")).value = defaultConfig.maxNoChangeTicks;
  (<HTMLInputElement>document.getElementById("sleep")).value = defaultConfig.currSleep;
  (<HTMLElement>document.getElementById("currSleep")).textContent = defaultConfig.currSleep;
  (<HTMLInputElement>document.getElementById("showId")).checked = defaultConfig.showId;
  (<HTMLInputElement>document.getElementById("showInfluenceArea")).checked = defaultConfig.showInfluenceArea;

  showId = (<HTMLInputElement>document.getElementById("showId")).checked;
  showInfluenceArea = (<HTMLInputElement>document.getElementById("showInfluenceArea")).checked;
  
  (<HTMLInputElement>document.getElementById("showInfluenceArea")).addEventListener('mouseup', () => {
    showInfluenceArea = !showInfluenceArea;
  });
  
  (<HTMLInputElement>document.getElementById("showId")).addEventListener('mouseup', () => {
    showId = !showId;
  });

  currSleep = parseInt(defaultConfig.currSleep);
  (<HTMLInputElement>document.getElementById("sleep")).addEventListener('mouseup', () => {
    currSleep = parseInt((<HTMLInputElement>document.getElementById("sleep")).value);
    (<HTMLElement>document.getElementById("currSleep")).textContent = `${currSleep}`;
  });
}


const reDrawEntities = (ctx: CanvasRenderingContext2D, covidSimulator: Simulator) => {
  drawCanvas(ctx);
  for (const entity of covidSimulator.entities) {
    drawPoint(entity, ctx);
  }
}

const drawEntitesFromLocalStorage =  (ctx: CanvasRenderingContext2D, entities) => {
  getFieldValues();
  drawCanvas(ctx);
  for(let entity of entities) {
    ctx.beginPath();
    let status = {
      isDead: entity.isDead,
      isInfected: entity.isInfected,
      isCured: entity.isCured,
      isSocialDistancing: entity.isSocialDistancing
    };

    ctx.fillStyle = getColor(status);

    ctx.arc(entity.position.x, entity.position.y, entitySize, 0, 2 * Math.PI);
    ctx.fill();

    if (showId) {
      ctx.font = "20px";
      ctx.fillText(`${entity.id}`, entity.position.x + 10, entity.position.y);
    }

    if (showInfluenceArea) {
      drawInfluenceArea(entity.position.x, entity.position.y, ctx);
    }
  }
}

const drawCanvas = (ctx: CanvasRenderingContext2D) => {
  ctx.clearRect(0, 0, confinedArea, confinedArea);
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.fillRect(0, 0, confinedArea, confinedArea);
  ctx.stroke();
}

const drawPoint = (entity: Entity, ctx: CanvasRenderingContext2D) => {
  ctx.beginPath();
  ctx.fillStyle = getColor(entity);
 
  ctx.arc(entity.position.getX(), entity.position.getY(), entitySize, 0, 2 * Math.PI);
  ctx.fill();

  if (showId) {
    ctx.font = "20px";
    ctx.fillText(`${entity.id}`, entity.position.getX() + entitySize+1, entity.position.getY());
  }

  if (showInfluenceArea) {
    drawInfluenceArea(entity.position.getX(), entity.position.getY(), ctx);
  }
}

const drawInfluenceArea = (x: number, y: number, ctx: CanvasRenderingContext2D) => {
  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.beginPath();
  ctx.fillStyle = 'white';
  ctx.arc(x, y, areaOfInfluence + entitySize, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore()
}

const getColor = ({ isDead, isInfected, isCured, isSocialDistancing }) => {
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
}

const updateCounts = (covidSimulator: Simulator) => {
  (<HTMLSpanElement>document.getElementById("numDead")).textContent = `${covidSimulator.deadCount}`;
  (<HTMLSpanElement>document.getElementById("numInfected")).textContent = `${covidSimulator.infectedCount}`;
  (<HTMLSpanElement>document.getElementById("numCured")).textContent = `${covidSimulator.curedCount}`;
}

const startPloter = (data) => {
  function touchZoomPlugin(opts?) {
    function init(u, opts, data) {
      let plot = u.root.querySelector(".over");
      let rect, oxRange, oyRange, xVal, yVal;
      let fr = { x: 0, y: 0, dx: 0, dy: 0 };
      let to = { x: 0, y: 0, dx: 0, dy: 0 };

      function storePos(t, e) {
        let ts = e.touches;

        let t0 = ts[0];
        let t0x = t0.clientX - rect.left;
        let t0y = t0.clientY - rect.top;

        if (ts.length == 1) {
          t.x = t0x;
          t.y = t0y;
          t.d = 0;
        }
        else {
          let t1 = e.touches[1];
          let t1x = t1.clientX - rect.left;
          let t1y = t1.clientY - rect.top;

          let xMin = Math.min(t0x, t1x);
          let yMin = Math.min(t0y, t1y);
          let xMax = Math.max(t0x, t1x);
          let yMax = Math.max(t0y, t1y);

          // midpts
          t.y = (yMin + yMax) / 2;
          t.x = (xMin + xMax) / 2;

          t.dx = xMax - xMin;
          t.dy = yMax - yMin;

          // dist
          t.d = Math.sqrt(t.dx * t.dx + t.dy * t.dy);
        }
      }

      let rafPending = false;

      function zoom() {
        rafPending = false;

        let left = to.x;
        let top = to.y;

        // non-uniform scaling
        //	let xFactor = fr.dx / to.dx;
        //	let yFactor = fr.dy / to.dy;

        // uniform x/y scaling
        let xFactor = fr.dx / to.dx;
        let yFactor = fr.dy / to.dy;

        let leftPct = left / rect.width;
        let btmPct = 1 - top / rect.height;

        let nxRange = oxRange * xFactor;
        let nxMin = xVal - leftPct * nxRange;
        let nxMax = nxMin + nxRange;

        let nyRange = oyRange * yFactor;
        let nyMin = yVal - btmPct * nyRange;
        let nyMax = nyMin + nyRange;

        u.batch(() => {
          u.setScale("x", {
            min: nxMin,
            max: nxMax,
          });

          u.setScale("y", {
            min: nyMin,
            max: nyMax,
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

        let left = fr.x;
        let top = fr.y;

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
        init
      }
    };
  }
  let plots = document.getElementsByClassName('uplot');
  if (plots) {
    for (let i=0; i< plots.length; i++) {
      plots.item(i).remove();
    }
  }
  const opts = {
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
      },
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
    ],
  };
  let u = new uPlot(opts, data, document.body);
  return u;
}

const getCanvas = () => {
  let c = <HTMLCanvasElement>document.getElementById("area");
  return c.getContext("2d");
}

const sleep = async () => new Promise(r => setTimeout(r, currSleep));

const start = async () => {
  (<HTMLButtonElement>document.getElementById("start")).disabled = true;

  let ctx = getCanvas();

  getFieldValues();

  window.localStorage.setItem('config', JSON.stringify({ tickLimit, entityLimit, initialInfected, hospitalCapacity, infectionRate, recoveringRate, timeToCure, socialDistancingRate, mobilityRate, confinedArea, areaOfInfluence, currSleep, entitySize, maxNoChangeTicks, showId, showInfluenceArea}));

  let covidSimulator = new Simulator(
    entityLimit,
    initialInfected,
    hospitalCapacity,
    infectionRate,
    recoveringRate,
    timeToCure,
    socialDistancingRate,
    mobilityRate,
    confinedArea,
    areaOfInfluence,
    entitySize
  );

  let tickIndex = [];
  let deadCount = [];
  let infectedCount = [];
  let curedCount = [];
  let plotter = startPloter([tickIndex, deadCount, infectedCount, curedCount]);
  let i=0;
  for (i = 0; i < tickLimit; i++) {
    covidSimulator.tick();
    reDrawEntities(ctx, covidSimulator);
    updateCounts(covidSimulator);
    
    tickIndex.push(i+1);
    deadCount.push(covidSimulator.deadCount);
    infectedCount.push(covidSimulator.infectedCount);
    curedCount.push(covidSimulator.curedCount);

    plotter.setData([tickIndex, deadCount, infectedCount, curedCount]);

    window.localStorage.setItem('counts', JSON.stringify([tickIndex, deadCount, infectedCount, curedCount]));
    window.localStorage.setItem('simulator', JSON.stringify(covidSimulator.entities));

    await sleep();
  }
}

const restart = () => {
  getFieldValues();
  window.localStorage.setItem('config', JSON.stringify({ tickLimit, entityLimit, initialInfected, hospitalCapacity, infectionRate, recoveringRate, timeToCure, socialDistancingRate, mobilityRate, confinedArea, areaOfInfluence, currSleep, entitySize, maxNoChangeTicks, showId, showInfluenceArea }));
  const data = JSON.parse(window.localStorage.getItem('config'));
  data.execute = true;
  data.stoped = false;
  window.localStorage.setItem('config', JSON.stringify(data));
  window.location.reload(false);
}

const stop = () => {
  getFieldValues();
  window.localStorage.setItem('config', JSON.stringify({ tickLimit, entityLimit, initialInfected, hospitalCapacity, infectionRate, recoveringRate, timeToCure, socialDistancingRate, mobilityRate, confinedArea, areaOfInfluence, currSleep, entitySize, maxNoChangeTicks, showId, showInfluenceArea }));
  const data = JSON.parse(window.localStorage.getItem('config'));
  data.execute = false;
  data.stoped = true;
  window.localStorage.setItem('config', JSON.stringify(data));
  window.location.reload(false);
}

function run () {
  document.getElementById("start").addEventListener('mouseup', start);
  document.getElementById("restart").addEventListener('mouseup', restart);
  document.getElementById("stop").addEventListener('mouseup', stop);
  
  let data = JSON.parse(window.localStorage.getItem('config'));
  if (!data) {
    setDefaults();
  } else {
    setDefaults(data);
    data.execute ? start() : null;
    if (data.stoped) {
      let ctx = getCanvas();
      let entities = <Simulator>JSON.parse(window.localStorage.getItem('simulator'));
      drawEntitesFromLocalStorage(ctx, entities);
      startPloter(JSON.parse(window.localStorage.getItem('counts')));
    }
  }
}

window.onload = run;
