const whiteStarSet = {
  core: [253, 253, 255],
  halo: [128, 168, 237]
}
const pinkStarSet = {
  core: [255, 255, 255],
  halo: [250, 222, 226]
}

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
    stroke(...colorSet.halo, 255.0 * r*r*r/(j*j*j));
    ellipse(x, y, j);
  }
}

class Star {
  constructor(starParams) {
    const {x, y, mass, vx, vy, colorSet} = starParams;
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.acc = createVector(0, 0);
    this.mass = mass;
    this.radius = this.mass * 24;
    this.colorSet = colorSet || whiteStarSet;
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acc.add(f)
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  show() {
    _drawStar(this.pos.x, this.pos.y, this.radius, this.colorSet)
  }

  /* Returns the gravitational force between this and aStar, direction aStar -> this */
  attract(aStar) {
    let force = p5.Vector.sub(this.pos, aStar.pos);
    let distance = force.mag();
    // Limiting the distance to eliminate "extreme" results for very close or very far objects
    distance = constrain(distance, 0.5, 10.0);
    // Get direction unit vector
    force.normalize();
    // Calculate gravitional force magnitude
    let strength = (g * this.mass * aStar.mass) / (distance * distance);
    force.mult(strength);
    return force;
  }

  contains(px, py) {
    let d = dist(px, py, this.x, this.y);
    return d < this.r;
  }
}