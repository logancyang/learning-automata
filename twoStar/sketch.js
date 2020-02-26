let fr = 30;
const n = 2;
let stars = [];
let distance;

// Fake gravitational constant
let g = 10;

let fontRegular;
function preload() {
  fontRegular = loadFont('assets/digital-7.ttf');
}

function computeCenterOfMass(stars) {
  const totalMass = stars.map(star => star.mass).reduce((prev, next) => prev + next);
  let acc = createVector(0, 0);
  for (const star of stars) {
    let mr = p5.Vector.mult(star.pos, star.mass);
    acc.add(mr);
  }
  return acc.div(totalMass);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(fr);
  // colorMode();

  // Star 1
  let starParams = {
    x: windowWidth*0.4,
    y: windowHeight*0.5,
    mass: 0.5,
    vx: 0,
    vy: 4
  }
  let newStar = new Star(starParams);
  stars.push(newStar);

  // Star 2
  starParams = {
    x: windowWidth*0.6,
    y: windowHeight*0.5,
    mass: 0.5,
    vx: 0,
    vy: -4,
    colorSet: pinkStarSet
  }
  newStar = new Star(starParams);
  stars.push(newStar);
}

function draw() {
  background(0);

  // let centerOfMass = computeCenterOfMass(stars);
  // stroke(255, 0, 0);
  // strokeWeight(5);
  // point(centerOfMass.x, centerOfMass.y);

  for (let i = 0; i < stars.length; i++) {
    for (let j = 0; j < stars.length; j++) {
      if (i != j) {
        force = stars[j].attract(stars[i]);
        stars[i].applyForce(force);
      }
    }

    stars[i].update();
    stars[i].show();
  }

  distance = stars[0].getDistance(stars[1]);
  textSize(24);
  textFont(fontRegular);
  noStroke();
  fill(255);
  text(`Distance:  ${distance.toPrecision(4)}`, 50, 50);
}
