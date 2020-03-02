class StarSystem {
  constructor(epoch, spaceWidth, spaceHeight) {
    this.stars = [];
    // Fake gravitational constant
    this.gConstant = 0.02;
    this.epoch = epoch;
    this.observedCollapse = 0;
    this.spaceWidth = spaceWidth;
    this.spaceHeight = spaceHeight;
  }

  addStar(star) {
    this.stars.push(star);
  }

  run() {
    // const attractions = {};
    // Since the attraction is mutual, each edge adds two forces
    // star i <-> j, and j > i
    if (this.stars.length < 2) {
      return;
    }
    for (let i = 0; i < this.stars.length; i++) {
      for (let j = i+1; j < this.stars.length; j++) {
        // Mutual attraction
        let force = this.stars[j].attract(this.stars[i]);
        this.stars[i].applyForce(force);
        this.stars[j].applyForce(force.mult(-1));
        // attractions[`${i}, ${j}`] = force.mag();
      }

      this.stars[i].update();
      this.stars[i].show();
    }
    // return attractions;
  }

  getDistances() {
    const distances = {};
    for (let i = 0; i < this.stars.length; i++) {
      for (let j = i+1; j < this.stars.length; j++) {
        let dist = this.stars[i].getDistance(this.stars[j]);
        let distKey = `${i}, ${j}`;
        distances[distKey] = dist;
      }
    }
    return distances;
  }

  /*
    Equation for center of mass:
      vecsum( m_i * r_i ) / totalMass
    where r_i is the position vector
  */
  getCenterOfMass() {
    const totalMass = this.stars.map(star => star.mass).reduce((prev, next) => prev + next);
    let acc = createVector(0, 0);
    for (const star of this.stars) {
      let mr = p5.Vector.mult(star.pos, star.mass);
      acc.add(mr);
    }
    return acc.div(totalMass);
  }

  // Hardcoded, can only handle starIndex 0 -> 3
  initStars(starIndex, angle) {
    const starMasses = [0.4, 0.2, 0.1, 0.001];
    const starVys = [0.2, -0.2, -0.1, 0.4];
    // Position offset from center of canvas
    const starOffsets = [-300, 285, 315, -330];
    const starColorSets = [pinkStarSet, whiteStarSet, whiteStarSet, blueStarSet];
    let trailThickness, name;
    if (starIndex === 3) {
      trailThickness = 2;
      name = 'trisolaris';
    }

    // Rotate velocity and position by random angle [-PI, PI]
    const offsetVector = createVector(starOffsets[starIndex], 0);
    const velocity = createVector(0, starVys[starIndex]);
    offsetVector.rotate(angle);
    velocity.rotate(angle);

    return {
      x: this.spaceWidth*0.5+offsetVector.x,
      y: this.spaceHeight*0.5+offsetVector.y,
      mass: starMasses[starIndex],
      vx: velocity.x,
      vy: velocity.y,
      gConstant: this.gConstant,
      colorSet: starColorSets[starIndex],
      trailThickness,
      name
    };
  }

  resetSystem(spaceWidth, spaceHeight) {
    this.stars = [];
    this.spaceWidth = spaceWidth;
    this.spaceHeight = spaceHeight;
    this.epoch += 1;
    const randAngle = random(-PI/2, PI/2);
    const star0 = new Star(this.initStars(0, randAngle));
    this.addStar(star0);

    const star1 = new Star(this.initStars(1, randAngle));
    this.addStar(star1);

    const star2 = new Star(this.initStars(2, randAngle));
    this.addStar(star2);

    const trisolaris = new Star(this.initStars(3, randAngle));
    this.addStar(trisolaris);
  }

  outOfBoundaries(spaceWidth, spaceHeight) {
    for (const star of this.stars) {
      let pos = star.pos;
      if (pos.x < 0 || pos.x > spaceWidth || pos.y < 0 || pos.y > spaceHeight) {
        this.observedCollapse += 1;
        return true;
      }
    }
    return false;
  }
}