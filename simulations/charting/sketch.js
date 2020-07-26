let tree;
let depth;
let foundAll = false;
let rotateParam = 150000;

const MAX_DIST = 100;
const MIN_DIST = 30;
const NUM_LEAVES = 800;
const MULTIPLIER = 50;


function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  depth = windowHeight/2;
  frameRate(15);
  tree = new Tree({showLeaves: true});
}


function draw() {
  background(0);
  rotateY(-0.1 + millis()/rotateParam);
  translate(-width/2, -height/2, 0);
  if (rotateParam > 100000) rotateParam -= 200;
  tree.show();
  if (!foundAll) {
    foundAll = tree.grow();
  }
}
