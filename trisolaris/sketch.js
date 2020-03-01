let fr = 15;
const TRISOLARAN_DATE = "2418-02-26";

const starSystem = new StarSystem();
let distance;
let years, months;

let bg, bgFlipped;

// Fake gravitational constant
let G = 0.03;
let showEnglish;
let TRISOLARIS = 'trisolaris'

let fontRegular;
function preload() {
  fontRegular = loadFont('assets/digital-7.ttf');
  bg = loadImage('images/space-bg.jpg');
  bgFlipped = loadImage('images/space-bg-flipped.jpg');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function switchLanguage() {
  showEnglish = !showEnglish;
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

// Can only handle starIndex 0 -> 3
function initStars(starIndex, angle) {
  const starMasses = [0.5, 0.2, 0.2, 0.005];
  const starVys = [0.2, -0.2, 0.2, 0.1];
  // Position offset from center of canvas
  const starOffsets = [-300, 295, 305, -310];
  const starColorSets = [pinkStarSet, whiteStarSet, whiteStarSet, blueStarSet];
  let trailThickness, name;
  if (starIndex === 3) {
    trailThickness = 2;
    name = TRISOLARIS;
  }

  // Rotate velocity and position by random angle [-PI, PI]
  const offsetVector = createVector(starOffsets[starIndex], 0);
  const velocity = createVector(0, starVys[starIndex]);
  offsetVector.rotate(angle);
  velocity.rotate(angle);

  return {
    x: windowWidth*0.5+offsetVector.x,
    y: windowHeight*0.5+offsetVector.y,
    mass: starMasses[starIndex],
    vx: velocity.x,
    vy: velocity.y,
    gConstant: G,
    colorSet: starColorSets[starIndex],
    trailThickness,
    name
  };
}

function showText(showEnglish) {
  textSize(22);
  noStroke();
  fill(0, 225, 255);
  const distances = starSystem.getDistances();
  if (showEnglish) {
    text(`Trisolaris`, 50, 50);
    text(`Civilization Epoch:  8009`, 80, 80);
    text(`Distance to Star A:  ${distances['0, 3'].toPrecision(2)}`, 80, 110);
    text(`Surface Temperature:  ${distances['0, 3'].toPrecision(2)}`, 80, 140);
    text(`Fleet Arrival to Earth (in Earth time): ${years} years ${months} months`, 80, 170);
  } else {
    text(`三体星`, 50, 50);
    text(`文明纪元:  8009`, 80, 80);
    text(`距离恒星A:  ${distances['0, 3'].toPrecision(2)}`, 80, 110);
    text(`表面温度:  ${distances['0, 3'].toPrecision(2)}`, 80, 140);
    text(`距三体舰队到达地球: ${years} 年 ${months} 月`, 80, 170);
  }
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

  showEnglish = true;
  canvas.mousePressed(switchLanguage);

  const randAngle = random(-PI, PI);
  const star0 = new Star(initStars(0, randAngle));
  starSystem.addStar(star0);

  const star1 = new Star(initStars(1, randAngle));
  starSystem.addStar(star1);

  const star2 = new Star(initStars(2, randAngle));
  starSystem.addStar(star2);

  const trisolaris = new Star(initStars(3, randAngle));
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

  starSystem.run();

  pop();

  showText(showEnglish);
}
