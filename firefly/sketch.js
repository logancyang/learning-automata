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
  canvas.position(0, 0);
  canvas.style('z-index', '-1');
  flyGroup.initGroup();
}

function draw() {
  background(0, 0, 55);

  const mousePos = createVector(mouseX, mouseY);
  const mouseVel = createVector(winMouseX - pwinMouseX, winMouseY - pwinMouseY);
  const mouseSpeed = mouseVel.mag();
  flyGroup.run(mousePos, mouseSpeed);
}