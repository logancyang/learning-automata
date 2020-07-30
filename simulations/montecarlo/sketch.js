let vals, norms;
let drawLoop = 0;
let done = false;
let maxIter = 2000;
let maxBinCount;
let moveAvgs;
let selected = 'gaussian';
let distFunc;
let distFuncCurve = [];
let maxyCoord = 0;
let darts;
let MARGIN = 1.25;

const WIDTH = 600;
const HEIGHT = 300;
const MULTIPLIER = 25;

const Y_LIMIT = 10;
const MIN_TRIALS = 500;
const MAX_TRIALS = 5000;


function square(x) {
  return x * x;
}

function pareto(x) {
  return Math.pow(x, -1);
}

function gaussian(x) {
  const u = 0.5;
  const s = 0.1;
  const z = (x - u)/s;
  return Math.exp(-z*z/2) / (Math.sqrt(2*PI) * s);
}

function uniform(x) {
  return 1;
}

// Calculate exponentially weighted moving average
// S_t = alpha*Y_t + (1-alpha)*S_(t-1)
function calcEWMA(values, alpha=0.1) {
  const movingAvgs = [values[0]];
  for (let i = 1; i < values.length; i++) {
    const s = alpha * values[i] + (1 - alpha) * movingAvgs[i-1];
    movingAvgs.push(s);
  }
  return movingAvgs;
}

function setDistFunc() {
  MARGIN = 1.25;
  selected = document.querySelector('input[name="dist"]:checked').value;
  if (selected === 'gaussian') {
    distFunc = gaussian;
  } else if (selected === 'square') {
    distFunc = square;
  } else if (selected === 'pareto') {
    distFunc = pareto;
  } else if (selected === 'uniform') {
    distFunc = uniform;
  }
}

function createDistFuncCurve() {
  // Fill global variables: distFuncCurve and maxyCoord
  for (let x = 0; x < WIDTH; x++) {
    const xCoord = map(x, 0, WIDTH, 0, 1);
    let yCoord = distFunc(xCoord);
    if (yCoord > Y_LIMIT) {
      MARGIN = 1;
      yCoord = Y_LIMIT;
    }
    distFuncCurve.push([xCoord, yCoord]);
    if (yCoord > maxyCoord) {
      maxyCoord = yCoord;
    }
  }
}

function resetCanvas() {
  done = false;
  drawLoop = 0;
  vals = Array(WIDTH).fill(0);
  norms = Array(WIDTH).fill(0);
  maxIter = slider.value();
  setDistFunc();
  // Reset distFuncCurve
  maxyCoord = 0;
  distFuncCurve = [];
  createDistFuncCurve();
  darts.reset(maxyCoord);
}


function setup() {
  canvas = createCanvas(WIDTH, HEIGHT*2);
  canvas.style('margin-top', '30px');
  canvas.style('margin-left', 'auto');
  canvas.style('margin-right', 'auto');
  canvas.style("outline", "blue 3px solid");
  canvas.parent("sketch-holder");

  slider = createSlider(MIN_TRIALS, MAX_TRIALS, maxIter, 100);
  slider.parent("sketch-slider");
  slider.style('width', '300px');

  sliderP = createP(slider.value());
  sliderP.parent("sketch-slider");

  setDistFunc();

  resetButton = createButton('Reset');
  resetButton.parent("sketch-reset");
  resetButton.size(120, 40);
  resetButton.style('margin', 'auto');
  resetButton.mousePressed(resetCanvas);

  vals = Array(WIDTH).fill(0);
  norms = Array(WIDTH).fill(0);

  createDistFuncCurve();

  darts = new Darts(height, maxyCoord);
}

function draw() {
  background(150, 191, 230);
  stroke(0);
  strokeWeight(8);
  line(0, HEIGHT, WIDTH, HEIGHT);

  sliderP.html(`Set # Iterations: ${slider.value()}`);

  // Draw the distFunc curve
  for (let x = 0; x < WIDTH; x++) {
    const yCoord = distFuncCurve[x][1];
    const y = map(yCoord, 0, maxyCoord * MARGIN, 0, HEIGHT);
    stroke('purple');
    strokeWeight(4);
    point(x, height-y);
  }

  if (!done) {
    const dart = darts.throwDart(distFunc);
    if (dart.hit) {
      sampleNumber = dart.x;
      bin = int(sampleNumber * WIDTH);
      vals[bin] += 1 * MULTIPLIER;

      let normalization = false;
      maxBinCount = 0;
      for (let x = 0; x < vals.length; x++) {
        if (vals[x] > HEIGHT) {
          normalization = true;
        }
        if (vals[x] > maxBinCount) maxBinCount = vals[x];
      }

      for (let x = 0; x < vals.length; x++) {
        if (normalization) norms[x] = vals[x] / maxBinCount * HEIGHT;
        else norms[x] = vals[x];
      }
    }

    drawLoop++;
  } else {
    // Done, draw moving average curve
    moveAvgs = calcEWMA(vals);
    // Normalize the EWMA (yellow) curve
    const maxElem = Math.max(...moveAvgs);
    for (let i = 0; i < moveAvgs.length; i++) {
      moveAvgs[i] = moveAvgs[i]/maxElem * HEIGHT * 0.6;
    }

    // Keep drawing vertical bar after done
    // And draw moving average line
    for (let x = 0; x < WIDTH; x++) {
      stroke('yellow');
      strokeWeight(6);
      point(x, HEIGHT-moveAvgs[x]);
    }
  }

  // Draw vertical bars
  for (let x = 0; x < WIDTH; x++) {
    stroke(0, 0, 255, 100);
    strokeWeight(4);
    line(x, HEIGHT, x, HEIGHT-norms[x]);
  }

  darts.show();

  textSize(16);
  noStroke();
  text(`Max Iteration:  ${maxIter}`, 30, 30);
  text(`Monte Carlo Iteration:  ${drawLoop}`, 30, 60);

  if (drawLoop >= maxIter) {
    done = true;
    text("Done!", 30, 90);
  }
}
