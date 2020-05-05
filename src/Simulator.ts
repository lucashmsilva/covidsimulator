import { Entity } from "./Entity";
import { Vector } from "./Vector";

export class Simulator {
  entityLimit: number;
  infectedCount: number;
  curedCount: number;
  deadCount: number;
  hospitalizedCount: number;
  initialInfected: number;
  hospitalCapacity: number;
  infectionRate: number;
  recoveringRate: number;
  timeToCure: number;
  socialDistancingRate: number
  mobilityRate: number;
  confinedArea: number;
  areaOfInfluence: number;
  entitySize: number;
  entities: Entity[];

  constructor(entityLimit: number, initialInfected: number, hospitalCapacity: number, infectionRate: number, recoveringRate: number, timeToCure: number, socialDistancingRate: number, mobilityRate: number, confinedArea: number, areaOfInfluence: number, entitySize: number) {
    this.entityLimit = entityLimit;
    this.initialInfected = initialInfected;
    this.hospitalCapacity = hospitalCapacity;
    this.infectionRate = infectionRate;
    this.recoveringRate = recoveringRate;
    this.timeToCure = Math.floor(Math.random() * (timeToCure*2 - timeToCure)) + 1;;
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

  private startEntities() {
    this.entities = new Array();
    let randomValue = 0;
    for (let i = 0; i < this.entityLimit; i++) {
      let infected = false;
      if (this.infectedCount < this.initialInfected) {
        infected = true;
        this.infectedCount++;
      }

      let mobility = false;
      randomValue = Math.floor(Math.random() * (100)) + 1;
      mobility = randomValue <= this.mobilityRate;

      let socialDistancing = false;
      randomValue = Math.floor(Math.random() * (100)) + 1;
      socialDistancing = randomValue <= this.socialDistancingRate;

      this.entities.push(new Entity(i, infected, socialDistancing, mobility, this.confinedArea, this.areaOfInfluence, this.entitySize));
    }
  }

  tick(){
    for (const entity of this.entities) {
      // moviment updates
      if (entity.isMobile) {
        if (entity.isSocialDistancing) {
          for (const otherEntity of this.entities) {
            if (entity.id === otherEntity.id) {
              continue;
            }
            if ((entity.position.distanceTo(otherEntity.position)) <= ((this.areaOfInfluence + (this.entitySize * 2)) + 1)) {
              let repulsion = new Vector(
                entity.position.getX() - otherEntity.position.getX(),
                entity.position.getY() - otherEntity.position.getY()
              );
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
        for (const otherEntity of this.entities) {
          if (entity.id === otherEntity.id) {
            continue;
          }
          if (otherEntity.isDead || otherEntity.isCured || otherEntity.isInfected) {
            continue;
          }

          if (entity.position.distanceTo(otherEntity.position) < ((this.areaOfInfluence + (this.entitySize * 2)) + 1)) {
            let chance = Math.floor(Math.random() * (100)) + 1;
            if (chance <= this.infectionRate) {
              otherEntity.isInfected = true;
              this.infectedCount++;
            }
          }
        }

        entity.infectionDuration++;
        if (entity.infectionDuration >= this.timeToCure) {
          let chance = Math.floor(Math.random() * (100)) + 1;
          if (chance <= this.recoveringRate) {
            entity.isCured = true;
            entity.isInfected = false;

            this.infectedCount--;
            this.curedCount++;
          } else {
            entity.isDead = true;
            entity.isInfected = false;
            entity.isMobile = false;

            this.infectedCount--;
            this.deadCount++;
          }
        }
      }
    }
  }
}