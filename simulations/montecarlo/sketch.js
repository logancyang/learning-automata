let vals, norms;
let width, height;
let drawLoop = 0;

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

// function mousePressed() {
//   loop();
// }

// function mouseReleased() {
//   noLoop();
// }

function setup() {
  // noLoop();
  width = 600;
  height = 600;
  canvas = createCanvas(width, height);
  canvas.position(10, 10);
  canvas.style("outline", "black 3px solid");

  vals = Array(width).fill(0);
  norms = Array(width).fill(0);
}

function draw() {
  background(255);
  stroke(148,0,211);
  strokeWeight(4);
  // Draw a sample between (0, 1)
  sampleNumber = monteCarlo();
  bin = int(sampleNumber * width);
  vals[bin] += 1 * 10;

  let normalization = false;
  maxBinCount = 0;
  for (let x = 0; x < vals.length; x++) {
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

  textSize(24);
  noStroke();
  text(`Monte Carlo Iteration:  ${drawLoop}`, 50, 50);
  drawLoop++;

  if (drawLoop > 5000) {
    text("Done!", 50, 100);
    noLoop();
  }
}
