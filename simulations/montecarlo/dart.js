class Dart {
  constructor(
    distFunc, maxyFuncValue, canvasHeight,
    panelWidth=WIDTH, panelHeight=HEIGHT,
    margin=MARGIN, maxX=1
  ) {
    this.x = random(maxX);
    let maxY = maxyFuncValue * (margin - 0.05);
    this.y = random(maxY);
    this.canvasHeight = canvasHeight;
    this.hit = this.monteCarloTrial(distFunc);
    this.displayPos = this.getDisplayPos(
      maxyFuncValue, panelWidth, panelHeight, margin
    );
  }

  monteCarloTrial(distFunc) {
    const targetY = distFunc(this.x);
    if (this.y < targetY) {
      return true;
    }
    return false
  }

  getDisplayPos(maxyFuncValue, panelWidth, panelHeight, margin) {
    const dartX = int(this.x * panelWidth);
    const dartYAdj = this.y/(maxyFuncValue * margin);
    const dartY = Math.floor(map(dartYAdj, 0, 1, 0, panelHeight));
    return [dartX, this.canvasHeight-dartY];
  }
}


class Darts {
  constructor(canvasHeight, maxyFuncValue) {
    this.darts = [];
    this.canvasHeight = canvasHeight;
    this.maxyFuncValue = maxyFuncValue;
  }

  throwDart(distFunc) {
    const dart = new Dart(
      distFunc, this.maxyFuncValue, this.canvasHeight
    );
    this.darts.push(dart);
    return dart;
  }

  reset() {
    this.darts = [];
  }

  show() {
    strokeWeight(4);
    for (let i = 0; i < this.darts.length; i++) {
      if (this.darts[i].hit) {
        stroke('blue');
      } else {
        stroke('red');
      }
      point(...this.darts[i].displayPos);
    }
  }
}
