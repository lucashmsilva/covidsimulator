import { Vector } from './Vector';

export class Entity {
  id: number;
  isInfected: boolean;
  isCured: boolean;
  isDead: boolean;
  isSocialDistancing: boolean;
  isMobile: boolean;
  infectionDuration: number;
  moviment: Vector;
  position: Vector;
  acceleration: Vector;
  confinedArea: number;
  areaOfInfluence: number;
  entitySize: number;

  constructor(id :number,isInfected: boolean, isSocialDistancing: boolean, isMobile: boolean, confinedArea: number, areaOfInfluence: number, entitySize: number) {
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

    let randomMovimentX = Math.floor(Math.random() * (10 - 5)) + 1;
    let randomMovimentY = Math.floor(Math.random() * (10 - 5)) + 1;
    this.moviment = new Vector(randomMovimentX, randomMovimentY);

    let randomPositionX = Math.floor(Math.random() * (this.confinedArea - this.entitySize - 5)) + 1;
    let randomPositionY = Math.floor(Math.random() * (this.confinedArea - this.entitySize - 5)) + 1;
    this.position = new Vector(randomPositionX, randomPositionY);

    this.acceleration = new Vector(0,0);
  }

  updatePosition() {
    this.bounce();
    this.position.add(this.moviment);
    this.moviment.add(this.acceleration);

    this.acceleration.setX(0);
    this.acceleration.setY(0);
  }

  wrapArround() {
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
  }

  bounce() {
    if (this.position.getX() + this.moviment.getX() >= this.confinedArea - this.entitySize || this.position.getX() + this.moviment.getX() <= this.entitySize) {
      this.moviment.setX(-this.moviment.getX());
    }

    if (this.position.getY() + this.moviment.getY() >= this.confinedArea - this.entitySize || this.position.getY() + this.moviment.getY() <= this.entitySize) {
      this.moviment.setY(-this.moviment.getY());
    }
  }

  getDestrucedPosition() {
    return [this.position.getX, this.position.getY];
  }
}