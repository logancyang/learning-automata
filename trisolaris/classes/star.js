const whiteStarSet = {
  core: [253, 253, 255],
  halo: [128, 168, 237]
}
const pinkStarSet = {
  core: [255, 255, 255],
  halo: [250, 222, 226]
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

function renderStar(star, showTrail) {
  star.show();
  if (showTrail) {
    // This is VERY IMPORTANT! Or the stroke will make the trail black and invisible
    noStroke();
    fill(...star.trailColor);
    for (let i = 0; i < star.trail.length; i++) {
      let pos = star.trail[i];
      ellipse(pos.x, pos.y, 1);
    }
  }
}

class Star {
  constructor(starParams) {
    const { x, y, mass, vx, vy, gConstant, colorSet } = starParams;
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.acc = createVector(0, 0);
    this.mass = mass;
    this.radius = this.mass * 24;
    this.gConstant = gConstant;
    this.colorSet = colorSet || whiteStarSet;
    this.trail = [];
    // For picking points in trail every n update() calls
    this.counter = 0;
    this.trailSamplingInterval = 5;
    this.trailColor = [...this.colorSet.halo, 150];
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acc.add(f)
  }

  update() {
    this.counter += 1;
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    // Maintain a queue of trail points
    if ((this.trail.length < TRAIL_LENGTH) && (this.counter % this.trailSamplingInterval == 0)) {
      this.trail.push(this.pos.copy());
    } else {
      while (this.trail.length >= TRAIL_LENGTH) {
        this.trail.shift();
      }
    }
    this.acc.mult(0);
  }

  show() {
    _drawStar(this.pos.x, this.pos.y, this.radius, this.colorSet);
  }

  getDistance(aStar) {
    let force = p5.Vector.sub(this.pos, aStar.pos);
    return force.mag();
  }

  /* Returns the gravitational force between this and aStar, direction aStar -> this */
  attract(aStar) {
    let force = p5.Vector.sub(this.pos, aStar.pos);
    let distance = force.mag();
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