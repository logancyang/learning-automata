class StarSystem {
  constructor() {
    this.stars = [];
  }

  addStar(star) {
    this.stars.push(star);
  }

  run(showTrail) {
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
      }

      this.stars[i].update();
      this.stars[i].show(showTrail);
    }
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
}