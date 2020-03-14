function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
	const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-landing');
}

function draw() {
  background(0);
  noStroke();
  fill(255);
  textSize(22);
  text(`WELCOME`, windowWidth/2, windowHeight/2);
}