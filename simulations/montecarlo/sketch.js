let vals, norms;
let drawLoop = 0;
let done = false;
let maxIter = 1000;
let maxBinCount;
let moveAvgs;

const WIDTH = 600;
const HEIGHT = 400;
const MULTIPLIER = 20;


function monteCarlo() {
  let foundOne = false;
  let iter = 0;
  let r1, r2;
  while (!foundOne && iter < 10000) {
    r1 = random(1);
    r2 = random(1);
    // target function: y = x^2
    target_y = r1 * r1;
    if (r2 < target_y) {
      foundOne = true;
      return r1;
    }
    iter++;
  }
  // If there's a problem, not found
  return 0;
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


function setup() {
  canvas = createCanvas(WIDTH, HEIGHT);
  frameRate(120);
  canvas.position(10, 10);
  canvas.style("outline", "black 3px solid");

  resetButton = createButton('Reset');
  resetButton.position(450, HEIGHT + 20);
  resetButton.size(120, 40);
  resetButton.mousePressed(() => {
    done = false;
    drawLoop = 0;
    vals = Array(width).fill(0);
    norms = Array(width).fill(0);
    maxIter = slider.value();
  });

  slider = createSlider(500, 5000, maxIter, 100);
  slider.position(20, HEIGHT + 30);
  slider.style('width', '400px');
  sliderP = createP(slider.value());
  sliderP.position(40, HEIGHT + 50);

  vals = Array(width).fill(0);
  norms = Array(width).fill(0);
}

function draw() {
  background(220);
  stroke(0, 0, 255, 100);
  strokeWeight(4);
  sliderP.html(`Set # Iterations: ${slider.value()}`);

  if (!done) {
    // Draw a sample between (0, 1)
    sampleNumber = monteCarlo();
    bin = int(sampleNumber * width);
    vals[bin] += 1 * MULTIPLIER;

    let normalization = false;
    maxBinCount = 0;
    for (let x = 0; x < vals.length; x++) {
      // Draw vertical bar
      line(x, height, x, height-norms[x]);
      if (vals[x] > height) {
        normalization = true;
      }
      if (vals[x] > maxBinCount) maxBinCount = vals[x];
    }

    for (let x = 0; x < vals.length; x++) {
      if (normalization) norms[x] = vals[x] / maxBinCount * height;
      else norms[x] = vals[x];
    }

    drawLoop++;
  } else {
    moveAvgs = calcEWMA(vals);
    // Keep drawing vertical bar after done
    // And draw moving average line
    for (let x = 0; x < vals.length; x++) {
      stroke(0, 0, 255, 100);
      strokeWeight(4);
      line(x, height, x, height-norms[x]);
      stroke('yellow');
      strokeWeight(6);
      point(x, height-moveAvgs[x]);
    }
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
