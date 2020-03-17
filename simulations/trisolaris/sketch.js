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
  const triAlphaDistanceInMilMiles = distances['0, 3'] * 500 / 1.6;
  const triAlphaDistanceInMilKms = distances['0, 3'] * 5;
  if (showEnglish) {
    textSize(18);
    text(`Trisolaris`, 50, 50);
    text(`Civilization Epoch:  ${starSystem.epoch}`, 80, 80);
    text(`End of Epoch Observed:  ${starSystem.observedCollapse}`, 80, 80+1*30);
    text(`Distance to Star Alpha:  ${triAlphaDistanceInMilMiles.toPrecision(4)} Mil Miles`, 80, 80+2*30);
    text(
      `Fleet Arrival to Earth (in Earth time): `+
      `${years} y ${months} m ${days} d`, 80, 80+3*30
    );
    text(`Reference Frame: System Center of Mass`, 50, 80+4*30);
  } else {
    textSize(22);
    text(`三体星`, 50, 50);
    text(`文明纪元:  ${starSystem.epoch}`, 80, 80);
    text(`观测到纪元结束:  ${starSystem.observedCollapse}`, 80, 80+1*30);
    text(`距离恒星Alpha:  ${triAlphaDistanceInMilKms.toPrecision(4)} 亿公里`, 80, 80+2*30);
    text(`距三体舰队到达地球: ${years} 年 ${months} 月 ${days} 天`, 80, 80+3*30);
    text(`参照系：系统质心`, 50, 80+4*30);
  }
}

function setup() {
  const canvas = createCanvas(windowWidth, 1000);
  canvas.parent("canvas-trisolaris");

  const randomEpoch = int(random(8000, 10000));
  starSystem = new StarSystem(randomEpoch, canvas.width, canvas.height);

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
  // Center canvas on Star Alpha
  // TODO: how to draw trails for this reference frame? Subtract star0.pos out of all trails?
  // let star0 = starSystem.stars[0];
  // let centerPos = createVector(star0.pos.x-windowWidth/2, star0.pos.y-windowHeight/2);
  // translate(-centerPos.x, -centerPos.y)
  starSystem.run();

  pop();

  if (starSystem.outOfBoundaries(canvas.width, canvas.height)) {
    starSystem.resetSystem(canvas.width, canvas.height);
  }

  showText(showEnglish);
}
