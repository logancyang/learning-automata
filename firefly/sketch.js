let flyGroup;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
	const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-landing');
  flyGroup = new FireflyGroup({
    numFlies: 100,
    width: windowWidth,
    height: windowHeight
  })
  flyGroup.initGroup();
}

function draw() {
  background(0);
  noStroke();
  fill(255);
  textSize(22);
  text(`WELCOME`, windowWidth/2, windowHeight/2);

  flyGroup.showGroup();
}