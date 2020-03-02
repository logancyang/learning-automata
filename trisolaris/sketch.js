let fr = 20;
const TRISOLARAN_DATE = "2418-02-26";
let starSystem;

let years, months, days;
let bg, bgFlipped;
let showEnglish;

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

function diffDate(startDate, endDate) {
  let b = moment(startDate);
  let a = moment(endDate);
  const intervals = ['years', 'months', 'days'];
  let output = {};

  for (const interval of intervals) {
    let diff = a.diff(b, interval);
    b.add(diff, interval);
    output[interval] = diff;
  }
  return output;
}

function showText(showEnglish) {
  noStroke();
  fill(0, 225, 255);
  const distances = starSystem.getDistances();
  if (showEnglish) {
    textSize(18);
    text(`Trisolaris`, 50, 50);
    text(`Civilization Epoch:  ${starSystem.epoch}`, 80, 80);
    text(`Distance to Star Alpha:  ${distances['0, 3'].toPrecision(2)}`, 80, 110);
    text(`Surface Temperature:  ${distances['0, 3'].toPrecision(2)}`, 80, 140);
    text(
      `Fleet Arrival to Earth (in Earth time): `+
      `${years} y ${months} m ${days} d`, 80, 170
    );
    text(`Reference Frame: System Center of Mass`, 50, 220);
  } else {
    textSize(22);
    text(`三体星`, 50, 50);
    text(`文明纪元:  ${starSystem.epoch}`, 80, 80);
    text(`距离恒星Alpha:  ${distances['0, 3'].toPrecision(2)}`, 80, 110);
    text(`表面温度:  ${distances['0, 3'].toPrecision(2)}`, 80, 140);
    text(`距三体舰队到达地球: ${years} 年 ${months} 月 ${days} 天`, 80, 170);
    text(`参照系：系统质心`, 50, 220);
  }
}

function setup() {
  const canvas = createCanvas(windowWidth, 1000);
  canvas.parent("canvas-trisolaris");

  const randomEpoch = int(random(8000, 10000));
  starSystem = new StarSystem(randomEpoch, canvas.width, canvas.height);

  for (let i = 0; i < 10; i++) {
    const p = createP(`some gibberish number ${i}`);
    p.parent("gibber");
  }

  frameRate(fr);

  const timeDiff = diffDate(new Date(), new Date(TRISOLARAN_DATE));
  years = timeDiff.years;
  months = timeDiff.months;
  days = timeDiff.days;

  showEnglish = true;
  canvas.mousePressed(switchLanguage);

  // Star initializations
  starSystem.resetSystem(canvas.width, canvas.height);
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

  if (starSystem.outOfBoundaries(canvas.width, canvas.height)) {
    starSystem.resetSystem(canvas.width, canvas.height);
  }

  showText(showEnglish);
}
