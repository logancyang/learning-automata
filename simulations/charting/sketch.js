let tree;
let depth;

const MAX_DIST = 50;
const MIN_DIST = 20;
const NUM_LEAVES = 500;


function setup() {
  createCanvas(1440, 800, WEBGL);
  depth = height/2;
  frameRate(5);
  tree = new Tree({showLeaves: true});
}


function draw() {
  background(0);
  rotateY(-0.1 + millis()/120000);
  translate(-width/2, -height/2, 0);

  tree.show();
  tree.grow();
}
