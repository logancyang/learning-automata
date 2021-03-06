const whiteStarSet = {
  core: [253, 253, 255],
  halo: [128, 168, 237]
}
const pinkStarSet = {
  core: [255, 255, 255],
  halo: [250, 222, 226]
}
const blueStarSet = {
  core: [0, 225, 255],
  halo: [0, 225, 255]
}


const TRAIL_LENGTH = 300;

function _drawStar(x, y, r, colorSet) {
  fill(...colorSet.core);
  noStroke();
  smooth();
  ellipse(x, y, r);
  let glowRadius = 4 * r;
  // Light intensity decay is inverse squared of distance
  // Modify to cubed to have sharper decay
  for (let j = r; j < glowRadius; j++) {
    noFill();
    strokeWeight(1);
    stroke(...colorSet.halo, 255.0 * r * r * r / (j * j * j));
    ellipse(x, y, j);
  }
}

class Star extends Particle {
  constructor(starParams) {
    const {
      x, y, mass, vx, vy, gConstant, colorSet, trailThickness, name
    } = starParams;
    let radius = Math.cbrt(mass) * 18;
    let particleParams = {
      x, y, radius, mass, vx, vy
    }
    super(particleParams);

    this.gConstant = gConstant;
    this.colorSet = colorSet || whiteStarSet;
    this.trail = [];
    // For picking points in trail every n update() calls
    this.counter = 0;
    this.trailSamplingInterval = 5;
    this.trailColor = [...this.colorSet.halo, 100];
    this.trailThickness = trailThickness || 3;
    this.name = name;
  }

  update() {
    super.update();
    this.counter += 1;
    // Maintain a queue of trail points
    if ((this.trail.length < TRAIL_LENGTH) && (this.counter % this.trailSamplingInterval == 0)) {
      this.trail.push(this.pos.copy());
    } else {
      while (this.trail.length >= TRAIL_LENGTH) {
        this.trail.shift();
      }
    }
  }

  show() {
    if (this.name) {
      textSize(18);
      textFont(fontRegular);
      noStroke();
      fill(0, 225, 255);
      smooth();
      text(`${this.name}`, this.pos.x + 25, this.pos.y);
    }

    // This is VERY IMPORTANT! Or the stroke will make the trail black and invisible
    noStroke();
    fill(...this.trailColor);
    for (let i = 0; i < this.trail.length; i++) {
      let pos = this.trail[i];
      ellipse(pos.x, pos.y, this.trailThickness);
    }
    // Draw star last, so it is on top of the trail
    _drawStar(this.pos.x, this.pos.y, this.radius, this.colorSet);
  }

  getDistance(aStar) {
    let force = p5.Vector.sub(this.pos, aStar.pos);
    return force.mag() / 100;
  }

  /* Returns the gravitational force between this and aStar, direction aStar -> this */
  attract(aStar) {
    let force = p5.Vector.sub(this.pos, aStar.pos);
    let distance = force.mag() / 100;
    // Limiting the distance to eliminate "extreme" results for very close or very far objects
    distance = constrain(distance, 2.0, 10.0);
    // Get direction unit vector
    force.normalize();
    // Calculate gravitional force magnitude
    let strength = (this.gConstant * this.mass * aStar.mass) / (distance * distance);
    force.mult(strength);
    return force;
  }

  contains(px, py) {
    let d = dist(px, py, this.x, this.y);
    return d < this.r;
  }
}