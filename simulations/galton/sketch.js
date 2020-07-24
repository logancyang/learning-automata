const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Events = Matter.Events;

let engine;
let world;
const particles = [];
const plinkos = [];
const buckets = [];

const P_RADIUS = 7;
const PLINKO_RADIUS = 3;
const NCOLS = 19;
const NROWS = 19;
const DROP_INTERVAL = 50;
const PLINKO_WIDTH = 370  ;
const PLINKO_HEIGHT = 600;
const PLINKO_COLOR = [200, 50, 80];
const RING_INTERVAL = 5;

let ground;
let ding;

// function preload() {
//   ding = loadSound('/assets/vibraphone-ding.mp3');
// }

// function collideSound(event) {
//   const pairs = event.pairs;
//   for (const pair of pairs) {
//     const labelA = pair.bodyA.label;
//     const labelB = pair.bodyB.label;
//     if (labelA === 'ground' && labelB === 'particle') {
//       ding.play();
//     }
//   }
// }

function setup() {
  createCanvas(PLINKO_WIDTH, PLINKO_HEIGHT);
  colorMode(HSB);
  engine = Engine.create();
  world = engine.world;
  // Add collision sound effect: vibraphone
  // Events.on(engine, 'collisionEnd', collideSound);
  // Add ground
  ground = new Boundary(
    PLINKO_WIDTH/2, PLINKO_HEIGHT, PLINKO_WIDTH, 50, 0, {label: 'ground'});
  // Add plinkos
  const spacing = width / NCOLS;
  // varying x, fixed y -> row, go thru NCOLS
  // fixed x, varying y -> col, go thru NROWS
  for (let i = 0; i < NCOLS+1; i++) {
    for (let j = 0; j < NROWS; j++) {
      let x = i * spacing;
      if (j % 2 === 1) {
         x += spacing/2;
      }
      const y = j * spacing + spacing;
      plinkos.push(new Particle(
        x, y, PLINKO_RADIUS,
        {isStatic: true, color: PLINKO_COLOR}
      ));
    }
    // Shift next row
  }

  // Add buckets
  for (let i = 0; i < NCOLS; i++) {
    const x = i * spacing * 1.5;
    const h = 200;
    const w = 3;
    const y = PLINKO_HEIGHT - h/2;
    buckets.push(new Boundary(x, y, w, h, 0));
  }
}

function mouseDragged() {
  circles.push(new Particle(mouseX, mouseY, particleRadius));
}

function draw() {
  background(0, 0, 0);
  // timestep is 1000ms/30frames
  Engine.update(engine, 1000/30);
  // Add particles
  if (frameCount % DROP_INTERVAL === 0) {
    particles.push(new Particle(
      PLINKO_WIDTH/2, 5, P_RADIUS, {randomOffset: true, label: 'particle'}
    ));
  }

  for (let i = particles.length-1; i > -1; i--) {
    if (particles[i].isOffScreen()) {
      World.remove(world, particles[i].body);
      particles.splice(i, 1);
    }
    particles[i].show();
  }
  for (const plinko of plinkos) {
    plinko.show();
  }
  for (const bucket of buckets) {
    bucket.show();
  }
  ground.show();
}
