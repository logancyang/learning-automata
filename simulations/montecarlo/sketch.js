let vals, norms;
let drawLoop = 0;
let done = false;
let maxIter = 800;
let maxBinCount;
let moveAvgs;
let selected = 'gaussian';
let distFunc;
let misses = [];
let hits = [];
let distFuncCurve = [];
let maxyCoord = 0;

const WIDTH = 600;
const HEIGHT = 300;
const MULTIPLIER = 25;
const MARGIN = 1.25;
const MIN_TRIALS = 500;
const MAX_TRIALS = 5000;

// function mousePressed() {
//   loop();
// }

// function mouseReleased() {
//   noLoop();
// }

function square(x) {
  return x * x;
}

function gaussian(x) {
  const u = 0.5;
  const s = 0.1;
  const z = (x - u)/s;
  return Math.exp(-z*z/2) / (Math.sqrt(2*PI) * s);
}

function monteCarloTrial(func, maxX=1, maxY=1) {
  const sampleX = random(maxX);
  const sampleY = random(maxY);
  const targetY = func(sampleX);
  if (sampleY < targetY) {
    return [sampleX, sampleY, true];
  }
  return [sampleX, sampleY, false];
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
  if (selected === 'gaussian') {
    distFunc = gaussian;
  } else if (selected === 'square') {
    distFunc = square;
  }
}

function resetCanvas() {
  done = false;
  drawLoop = 0;
  vals = Array(WIDTH).fill(0);
  norms = Array(WIDTH).fill(0);
  maxIter = slider.value();
  setDistFunc();
  misses = [];
  hits = [];
  distFuncCurve = [];
  maxyCoord = 0;
  // Create distFunc curve
  for (let x = 0; x < WIDTH; x++) {
    const xCoord = map(x, 0, WIDTH, 0, 1);
    const yCoord = distFunc(xCoord);
    distFuncCurve.push([xCoord, yCoord]);
    if (yCoord > maxyCoord) {
      maxyCoord = yCoord;
    }
  }
}


function setup() {
  canvas = createCanvas(WIDTH, HEIGHT*2);
  canvas.style('margin-top', '30px');
  canvas.style('margin-left', 'auto');
  canvas.style('margin-right', 'auto');
  canvas.style("outline", "black 3px solid");
  canvas.parent("sketch-holder");

  slider = createSlider(MIN_TRIALS, MAX_TRIALS, maxIter, 100);
  slider.parent("sketch-slider");
  slider.style('width', '300px');
  // slider.style('horizontal-align', 'middle');

  sliderP = createP(slider.value());
  sliderP.parent("sketch-slider");
  // sliderP.style('align', 'middle');

  setDistFunc();

  resetButton = createButton('Reset');
  resetButton.parent("sketch-reset");
  resetButton.size(120, 40);
  resetButton.style('margin', 'auto');
  resetButton.mousePressed(resetCanvas);

  vals = Array(WIDTH).fill(0);
  norms = Array(WIDTH).fill(0);

  // Create distFunc curve
  for (let x = 0; x < WIDTH; x++) {
    const xCoord = map(x, 0, WIDTH, 0, 1);
    const yCoord = distFunc(xCoord);
    distFuncCurve.push([xCoord, yCoord]);
    if (yCoord > maxyCoord) {
      maxyCoord = yCoord;
    }
  }
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
    // Draw a sample between (0, 1)
    const [sampleX, sampleY, hit] = monteCarloTrial(
      distFunc, 1, maxyCoord * (MARGIN - 0.05)
    );
    // Draw dart
    const dartX = int(sampleX * WIDTH);
    const dartYAdj = sampleY/(maxyCoord * MARGIN);
    const dartY = map(dartYAdj, 0, 1, 0, HEIGHT);
    if (!hit) {
      misses.push([dartX, dartY]);
    } else {
      hits.push([dartX, dartY]);
      sampleNumber = sampleX;
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

  for (let i = 0; i < misses.length; i++) {
    const [missX, missY] = misses[i];
    stroke('red');
    strokeWeight(4);
    point(missX, height-missY);
  }

  for (let i = 0; i < hits.length; i++) {
    const [hitX, hitY] = hits[i];
    stroke('blue');
    strokeWeight(4);
    point(hitX, height-hitY);
  }

  textSize(16);
  noStroke();
  text(`Max Iteration:  ${maxIter}`, 30, 30);
  text(`Monte Carlo Iteration:  ${drawLoop}`, 30, 60);

  if (drawLoop >= maxIter) {
    done = true;
    text("Done!", 30, 90);
  }
}
