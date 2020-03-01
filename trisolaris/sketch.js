let fr = 15;
const TRISOLARAN_DATE = "2418-02-26";

const starSystem = new StarSystem();
let distance;
let years, months;

let bg, bgFlipped;

// Fake gravitational constant
let G = 0.03;
let showTrail;

let fontRegular;
function preload() {
  fontRegular = loadFont('assets/digital-7.ttf');
  bg = loadImage('images/space-bg.jpg');
  bgFlipped = loadImage('images/space-bg-flipped.jpg');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function switchShowTrail() {
  showTrail = !showTrail;
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

function diffDate(startDate, endDate) {
  let b = moment(startDate);
  let a = moment(endDate);
  const intervals = ['years', 'months'];
  let output = {};

  for (const interval of intervals) {
    let diff = a.diff(b, interval);
    b.add(diff, interval);
    output[interval] = diff;
  }
  return output;
}

function getDistancesBetween(stars) {
  if (stars.length < 2) {
    return 0;
  }
  const distances = [];
  for (let i = 0; i < stars.length; i++) {
    for (let j = i+1; j < stars.length; j++) {
      distances.push(stars[i].getDistance(stars[j]));
    }
  }
  return distances;
}

function setup() {
  const canvas = createCanvas(windowWidth, 900);
  canvas.parent("canvas-trisolaris");

  for (let i = 0; i < 10; i++) {
    const p = createP(`some gibberish number ${i}`);
    p.parent("gibber");
  }

  frameRate(fr);

  const timeDiff = diffDate(new Date(), new Date(TRISOLARAN_DATE));
  years = timeDiff.years;
  months = timeDiff.months;

  showTrail = true;
  canvas.mousePressed(switchShowTrail);

  // Star 0
  let starParams = {
    x: windowWidth*0.5-300,
    y: windowHeight*0.5,
    mass: 0.5,
    vx: 0,
    vy: 0.2,
    gConstant: G,
    colorSet: pinkStarSet
  }
  const star0 = new Star(starParams);
  starSystem.addStar(star0);

  // Star 1
  starParams = {
    x: windowWidth*0.5+295,
    y: windowHeight*0.5,
    mass: 0.2,
    vx: 0,
    vy: -0.2,
    gConstant: G
  }
  const star1 = new Star(starParams);
  starSystem.addStar(star1);

  // Star 2
  starParams = {
    x: windowWidth*0.5+305,
    y: windowHeight*0.5,
    mass: 0.2,
    vx: 0,
    vy: 0.2,
    gConstant: G
  }
  const star2 = new Star(starParams);
  starSystem.addStar(star2);

  // Trisolaris
  starParams = {
    x: windowWidth*0.5-310,
    y: windowHeight*0.5,
    mass: 0.005,
    vx: 0,
    vy: 0.1,
    gConstant: G,
    colorSet: blueStarSet,
    trailThickness: 2,
    name: 'trisolaris'
  }
  const trisolaris = new Star(starParams);
  starSystem.addStar(trisolaris);
}

function draw() {
  background(0);
  const scale = 0.8;
  const bgWidth = scale * bg.width;
  const bgHeight = scale * bg.height;
  imageMode(CORNER);
  image(bg, 0, 0, bgWidth, bgHeight);
  image(bgFlipped, bgWidth, 0, bgWidth, bgHeight);

  push();
  const centerOfMass = starSystem.getCenterOfMass();

  // Center canvas on center of mass
  let centerPos = createVector(centerOfMass.x-windowWidth/2, centerOfMass.y-windowHeight/2);
  translate(-centerPos.x, -centerPos.y)

  starSystem.run(showTrail);

  pop();

  textSize(22);
  textFont(fontRegular);
  noStroke();
  fill(0, 225, 255);
  const distances = starSystem.getDistances();
  text(`Trisolaris`, 50, 50);
  text(`Distance to Star A:  ${distances['0, 3'].toPrecision(2)}`, 80, 80);
  text(`Surface temperature:  ${distances['0, 3'].toPrecision(2)}`, 80, 110);
  text(`Fleet Arrival to Earth, in Earth time: ${years} years ${months} months`, 80,140);
}
