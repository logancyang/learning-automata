class StarSystem {
  constructor() {
    this.stars = [];
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
}