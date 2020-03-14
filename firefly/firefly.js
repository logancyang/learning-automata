const defaultColorSet = {
  core: [108, 240, 104],
  halo: [108, 240, 104]
};
const maxGlowAlpha = 200;

class Firefly extends Particle {
  constructor(fireflyParams) {
    const {
      x, y, mass, vx, vy, colorSet, offset, mousePos
    } = fireflyParams;
    let radius = Math.cbrt(mass);
    let particleParams = {
      x, y, radius, mass, vx, vy
    }
    super(particleParams);
    this.colorSet = colorSet || defaultColorSet;
    this.mousePos = mousePos;
    this.t = offset;
  }

  randomFly() {
    // TODO: Apply force at short intervals
  }

  show() {
    // Draw the firefly and apply glowing, which is changing radius and alpha
    let r = this.radius;
    let x = this.pos.x;
    let y = this.pos.y;
    let currentAlpha = (Math.sin(this.t/500 * 2*PI)+0.3) * maxGlowAlpha;

    fill(...this.colorSet.core, currentAlpha);
    noStroke();
    smooth();
    ellipse(x, y, r);
    let glowRadius = 4 * r;
    // Light intensity decay is inverse squared of distance
    // Modify to cubed to have sharper decay
    for (let j = r; j < glowRadius; j++) {
      noFill();
      strokeWeight(1);
      stroke(...this.colorSet.halo, r * r / (j * j) * currentAlpha);
      ellipse(x, y, j);
    }

    this.t++;
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
      mass: random(5, 90),
      vx: 0,
      vy: 0,
      offset: random(500)
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

  showGroup() {
    for (const firefly of this.fireflies) {
      firefly.show();
    }
  }
}
