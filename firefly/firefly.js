const DEFAULTCOLORSET = [108, 240, 104];
const GLOWALPHA = 150;


class Firefly extends Particle {
  constructor(fireflyParams) {
    const {
      x, y, mass, radius, vx, vy, colorSet, offset, glow, mousePos, width, height
    } = fireflyParams;
    let particleParams = {
      x, y, radius, mass, vx, vy
    }
    super(particleParams);
    this.colorSet = colorSet || DEFAULTCOLORSET;
    this.mousePos = mousePos;
    // 1 offset is 1/500 of 2*PI
    this.offset = offset;
    this.width = width;
    this.height = height;
    this.glow = glow || false;
  }

  randomFly() {
    // TODO: Apply force at short intervals
    let randsin = Math.sin(this.offset/500 * 2*PI);
    const randX = random(-randsin, randsin);
    const randY = random(-randsin, randsin);
    const randForce = createVector(randX, randY);
    super.applyForce(randForce);
  }

  update() {
    super.update();
    if (this.pos.x < 0 || this.pos.x > this.width) {
      this.vel.x = -this.vel.x * 0.2;
    }
    if (this.pos.y < this.height/3 || this.pos.y > this.height) {
      this.vel.y = -this.vel.y * 0.2;
    }
  }

  show() {
    // Draw the firefly and apply glowing, which is changing alpha
    let currentAlpha = GLOWALPHA;
    if (this.glow) {
      currentAlpha = (Math.sin(this.offset/500 * 2*PI)+0.3) * GLOWALPHA;
    }

    fill(...this.colorSet, currentAlpha);
    noStroke();
    smooth();
    ellipse(this.pos.x, this.pos.y, this.radius);

    this.offset++;
  }

  repel() {
    // Use this.mousePos.x this.mousePos.y to create a circle that repels the firefly
  }
}


class FireflyGroup {
  constructor(groupParams) {
    const { numFlies, width, height } = groupParams;
    this.numFlies = numFlies;
    this.width = width;
    this.height = height;
    this.fireflies = [];
  }

  addFirefly() {
    const flyParams = {
      x: random(this.width),
      y: random(this.height/2, this.height),
      mass: 100,
      radius: random(1, 8),
      vx: 0,
      vy: 0,
      offset: int(random(1000)),
      width: this.width,
      height: this.height,
      glow: true
    };
    let firefly = new Firefly(flyParams);
    this.fireflies.push(firefly);
  }

  initGroup() {
    for (let i = 0; i < this.numFlies; i++) {
      this.addFirefly();
    }
    return this.fireflies;
  }

  resizeGroupWindow(width, height) {
    this.width = width;
    this.height = height;
    for (const firefly of this.fireflies) {
      firefly.width = width;
      firefly.height = height;
    }
  }

  run() {
    for (const firefly of this.fireflies) {
      firefly.randomFly();
      firefly.update();
      firefly.show();
      if (firefly.offset > 3000) {
        firefly.pos.x = random(this.width);
        firefly.pos.y = random(this.height/2, this.height);
        firefly.offset = int(random(1000));
      }
    }
  }
}
