export class Vector {
  private x: number;
  private y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(b: Vector) {
    this.x += b.x;
    this.y += b.y;
  }

  scale(scale: number) {
    this.x *= scale;
    this.y *= scale;
  }

  distanceTo(b: Vector) {
    return Math.sqrt(Math.pow((this.x - b.x), 2) + Math.pow((this.y - b.y), 2));
  }
  
  limit(limit=1) {
    if(this.getMagnitude() > limit) {
      this.normalize();
      this.scale(limit);
    }
  }

  normalize() {
    let magnitude = this.getMagnitude();
    this.scale(1 / magnitude);
  }

  getMagnitude() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  setX(x) {
   this.x = x;
  }

  setY(y) {
    this.y = y;
  }
}