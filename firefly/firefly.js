class Firefly extends Particle {
  constructor(fireflyParams) {
    const {
      x, y, mass, vx, vy, colorSet
    } = fireflyParams;
    let radius = Math.cbrt(mass) * 18;
    let particleParams = {
      x, y, radius, mass, vx, vy
    }
    super(particleParams);
    this.colorSet = colorSet || defaultColorSet;
  }

  randomFly() {
    // TODO: Apply force at short intervals
  }
}