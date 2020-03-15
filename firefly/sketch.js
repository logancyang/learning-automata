let flyGroup;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  flyGroup.resizeGroupWindow(windowWidth, windowHeight);
}

function setup() {
	const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-landing');
  flyGroup = new FireflyGroup({
    numFlies: 200,
    width: windowWidth,
    height: windowHeight
  })
  flyGroup.initGroup();
}

function draw() {
  background(0, 0, 55);
  noStroke();
  fill(255);
  textSize(22);
  text(`WELCOME`, windowWidth/2, windowHeight/2);

  const mousePos = createVector(mouseX, mouseY);
  const mouseXDiff = winMouseX - pwinMouseX;
  const mouseYDiff = winMouseY - pwinMouseY;
  const mouseSpeed = Math.sqrt(mouseXDiff*mouseXDiff + mouseYDiff*mouseYDiff);
  flyGroup.run(mousePos, mouseSpeed);
}