let tree;

const MAX_DIST = 50;
const MIN_DIST = 10;
const NUM_LEAVES = 1000;


function setup() {
  createCanvas(900, 900);
  tree = new Tree({showLeaves: true});
}


function draw() {
  background(0, 0, 0);
  tree.show();
  tree.grow();
}
