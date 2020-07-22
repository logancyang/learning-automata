class Particle {
  constructor(x, y, r, opts) {
    const options = {
      ...opts,
      friction: 0.8,
      restitution: 0.5
    };
    if (options.randomOffset) {
      x += random(-4, 4);
    }
    this.hue = random(360);
    this.body = Bodies.circle(x, y, r, options);
    this.r = r;
    this.color = options.color || [this.hue, 255, 255];
    World.add(world, this.body);
  }

  isOffScreen() {
    const x = this.body.position.x;
    const y = this.body.position.y;
    return (x < -50 || x > PLINKO_WIDTH + 50);
  }

  show() {
    const pos = this.body.position;
    const angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    rectMode(CENTER);
    strokeWeight(1);
    noStroke();
    fill(...this.color);
    ellipse(0, 0, this.r * 2);
    pop();
  }
}

class Boundary {
  constructor(x, y, w, h, a) {
    const options = {
      friction: 0.8,
      restitution: 0,
      angle: a,
      isStatic: true
    };
    this.body = Bodies.rectangle(x, y, w, h, options);
    this.w = w;
    this.h = h;
    World.add(world, this.body);
  }

  show() {
    const pos = this.body.position;
    const angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    rectMode(CENTER);
    strokeWeight(1);
    noStroke();
    fill(0, 0, 40);
    rect(0, 0, this.w, this.h);
    pop();
  }
}
