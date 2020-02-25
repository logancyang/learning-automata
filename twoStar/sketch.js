const n = 2;
let stars = [];

// Fake gravitational constant
let g = 1;

function computeCenterOfMass(stars) {
  const totalMass = stars.map(star => star.mass).reduce((prev, next) => prev + next);
  let acc = createVector(0, 0);
  for (const star of stars) {
    let mr = p5.Vector.mult(star.pos, star.mass);
    acc.add(mr);
  }
  return acc.div(totalMass);
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Star 1
  let starParams = {
    x: windowWidth*0.45,
    y: windowHeight*0.5,
    mass: 0.5,
    vx: 0,
    vy: 0.5
  }
  let newStar = new Star(starParams);
  stars.push(newStar);

  // Star 2
  starParams = {
    x: windowWidth*0.55,
    y: windowHeight*0.5,
    mass: 0.5,
    vx: 0,
    vy: -0.5
  }
  newStar = new Star(starParams);
  stars.push(newStar);
}

function draw() {
  background(0);
  let centerOfMass = computeCenterOfMass(stars);
  fill(255, 0, 0);
  ellipse(centerOfMass.x, centerOfMass.y, 8);

  for (let i = 0; i < stars.length; i++) {
    for (let j = 0; j < stars.length; j++) {
      if (i != j) {
        force = stars[j].attract(stars[i]);
        stars[i].applyForce(force);
      }
    }

    stars[i].update();
    stars[i].show();
  }
}
