let tree;

const MAX_DIST = 50;
const MIN_DIST = 10;
const NUM_LEAVES = 500;


function setup() {
  createCanvas(windowWidth, windowHeight);
  tree = new Tree({showLeaves: true});
}


function draw() {
  background(0);
  tree.show();
  tree.grow();
}
