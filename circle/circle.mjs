let counter = 0;

class Circle {
  constructor({x = 0, y = 0, r = 1}) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.id = counter++;

    this.growing = true;
  }

  draw(ctx) {
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.stroke();
  }

  grow() {
    if (this.growing)
      this.r += 1;
  }

  edges(xMin, xMax, yMin, yMax) {
    return this.x + this.r >= xMax || this.x - this.r <= xMin || this.y + this.r >= yMax || this.y - this.r <= yMin;
  }

  contains(x, y) {
    const dist = Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2);
    return dist <= this.r + 2;
  }

  intersectsWithCircle(circle) {
    const dist = Math.sqrt((this.x - circle.x) ** 2 + (this.y - circle.y) ** 2);
    return dist < this.r + circle.r;
  }
}

export {Circle};