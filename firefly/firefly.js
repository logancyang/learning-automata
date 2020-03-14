class Firefly extends Particle {
  constructor(fireflyParams) {
    const {
      x, y, mass, vx, vy, colorSet, mousePos
    } = fireflyParams;
    let radius = Math.cbrt(mass) * 18;
    let particleParams = {
      x, y, radius, mass, vx, vy
    }
    super(particleParams);
    this.colorSet = colorSet || defaultColorSet;
    this.mousePos = mousePos;
  }

  randomFly() {
    // TODO: Apply force at short intervals
  }

  show() {
    // Draw the firefly and apply flickering
  }

  repel() {
    // Use this.mousePos.x this.mousePos.y to create a circle that repels the firefly
  }
}