# Nature of Code Notes by Logan Yang

## Table of Content

Part I: Creating Physics Engine

- Vectors
- Forces
- Oscillations
- Particle Systems
    - Inheritance
    - Polymorphism
- Box2D
- Steering Forces

Part II: Complexity

- Flocking
- Cellular Automata
- Fractals

Part III: Intelligence

- Evolution
- Neural Networks


## 1. Introduction: Random Walker, Gaussian, Custom Distributions, Perlin Noise

For a function that yields a standard Gaussian distribution (mean = 0, std = 1), we just add our mean and multiply by our stddev to everything the standard Gaussian yields.

`random()` gives us uniform distribution.

To get a custom distribution, there are 2 main approaches.

- The "bucket" approach

Draw from `[0, 0, 0, 0, 1]`, we have 80% chance picking 0.

- **2-number approach (Rejection Sampling: a Monte Carlo Method)**

```js
let vals, norms;
let width, height;
let drawLoop = 0;

function monteCarlo() {
  let foundOne = false;
  let iter = 0;
  let r1, r2;
  while (!foundOne && iter < 10000) {
    r1 = random(1);
    r2 = random(1);
    // target function: y = x^2
    target_y = r1 * r1;
    if (r2 < target_y) {
      foundOne = true;
      return r1;
    }
    iter++;
  }
  // If there's a problem, not found
  return 0;
}

function setup() {
  width = 600;
  height = 600;
  canvas = createCanvas(width, height);
  canvas.position(10, 10);
  canvas.style("outline", "black 3px solid");

  vals = Array(width).fill(0);
  norms = Array(width).fill(0);
}

function draw() {
  background(255);
  stroke(148,0,211);
  strokeWeight(4);
  // Draw a sample between (0, 1)
  sampleNumber = monteCarlo();
  bin = int(sampleNumber * width);
  vals[bin] += 1 * 10;

  let normalization = false;
  maxBinCount = 0;
  for (let x = 0; x < vals.length; x++) {
    line(x, height, x, height-norms[x]);
    if (vals[x] > height) {
      normalization = true;
    }
    if (vals[x] > maxBinCount) maxBinCount = vals[x];
  }

  for (let x = 0; x < vals.length; x++) {
    if (normalization) norms[x] = vals[x] / maxBinCount * height;
    else norms[x] = vals[x];
  }

  textSize(24);
  noStroke();
  text(`Monte Carlo Iteration:  ${drawLoop}`, 50, 50);
  drawLoop++;

  if (drawLoop > 5000) {
    text("Done!", 50, 100);
    noLoop();
  }
}
```

Dan Shiffman called this approach the "2-number approach". I found on Wikipedia that it is actually one method under the umbrella of Monte Carlo simulations called [Rejection Sampling](https://en.wikipedia.org/wiki/Rejection_sampling). In that article, there is a visual description that is helpful to understand why this works:

```
To visualize the motivation behind rejection sampling, imagine graphing
the density function of a random variable onto a large rectangular board
and throwing darts at it. Assume that the darts are uniformly distributed
around the board. Now remove all of the darts that are outside the area
under the curve. The remaining darts will be distributed uniformly within
the area under the curve, and the x-positions of these darts will be
distributed according to the random variable's density. This is because
there is the most room for the darts to land where the curve is highest and
thus the probability density is greatest.
```

This is a method for simulating a custom *continuous* distribution.

TODO: Make this visualization along side the bar chart distribution in a synchronous way, put it on my website learning-automata.co.

Additional note: in [pseudo-random number sampling](https://en.wikipedia.org/wiki/Pseudo-random_number_sampling), there is a method to generate discrete random variables. The method is to use CDF. For example, r.v. X = 0, 1, 2. P(X) = 0.2, 0.7, 0.1 accordingly. Then divide [0, 1) into

```
Uniformly draw from [0, 1), return 0, 1, 2 depending on which interval
it falls into.

            0.2                          0.9   1
    |========|============================|====|

return:  0                   1               2
```

### Perlin Noise

Perlin Noise is developed by Prof. Perlin at NYU in the 80s. On a high level, it is a technique to *make smoothness and achieve natural looking motions or textures*. Will use it more in the future.

## 2. Vectors and Forces

In Processing, there is a class `PVector`. In P5.js, the class is `p5.Vector` and can be created using

```js
let someVector = createVector(some_x, some_y);
```

The class has vector math methods such as `add()`, `dot()`, `cross()`, `mag()`, `magSq()`, `dist()`, `rotate()`, `angleBetween()`, etc.

The constructor takes 2 or 3 arguments, depending on 2D or 3D.

### Static method for PVector in Processing (Java)

```java
PVector f = new PVector(0, 1);
float mass = 2;
// If we want to calculate acceleration, we need A = f/mass
// But we can't do it directly passing in the f object, because
// it will be updated in-place. We need static function in the
// PVector class to make a copy of f
PVector a = PVector.div(f, mass);
```

### Applying force with draw()

Since it's sometimes unnecessary to keep track time or # draw loops in a sketch, *we can re-apply force every frame*. In this case, **DO NOT forget to set acceleration to 0 (mult 0) after every frame udpate!**

```java
// Inside the Mover class
void update() {
    vel.add(acc);
    location.add(vel);
    // Note, reset acc
    acc.mult(0);
}
```

If we do choose to apply the force with a parameter time, then we don't have to do it every frame. But that can be a rare use case.

*Takeaway, location and velocity are cumulative between frames, but always calculate force fresh every frame!*

### Simulate friction

```
friction = - mu * || N || * vel_hat
```

where ||N|| is the magnitude of the normal force from the surface, and vel_hat the unit velocity vector.

Don't forget when calculating the friction, copy the velocity vector and do not change it in-place.

## 3. Oscillations

Rotation in Processing,

```java
// PI = 180 degrees, this is 45 degrees
float angle = PI/4;
float aVelocity = 0;
float aAcceleration = 0.0001;

void setup() {
  size(800, 200);
  smooth();
}

void draw() {
  background(255);


  fill(127);
  stroke(0);
  // Note that `rotate` has center at origin (0, 0),
  // aka top left corner of the canvas, we need translate to
  // make it centered
  translate(width/2, height/2);
  rectMode(CENTER);
  rotate();
  rect(0, 0, 64, 36);

  angle += aVelocity;
  aVelocity += aAcceleration;
}
```

Polar coordinate

```
x = r * cos(a);
y = r * sin(a);
```

Simple harmonic motion

```java
// Say period = 200, it means 200 frames are one period
float x = amplitude * sin((frameCount / period) * TWO_PI);

// But really we can just use one "angle" variable in sin()
float x = amplitude * sin(angle);
```

Springs

```java
// Bob: Mover class object
class Mover {
  PVector position;
  PVector velocity;
  PVector acceleration;

  void applyForce() {};
}

class Spring {
  float k;
  float restLength;
  // If we need moving anchor, we can have it as a Mover object
  PVector anchor;

  // This is powerful, Spring directly modifies Mover object
  void connect(Mover m) {
    // Calculates displacement, force
    float force = ...;
    // and then apply the force to m
    m.applyForce(force);
  };
}
```

It's good to use physics engine libraries to simulate complex spring systems.


## 4. Particle Systems

Java ArrayList: `add(), get(), remove(), size()`

```java
ArrayList<Particle> particles = new ArrayList<Particle>();
particles.add(new Particle());
particles.get(<index>);
particles.remove(<index>);
// Enhanced Java loop
// Con: can't modify the arraylist while in the loop
for (Particle p: particles) {
  p.update();
  p.display();
}

// PROBLEM MODIFYING ARRAYLIST WHILE LOOPING:
// If we want to remove from arraylist in the middle
// the indices change, e.g. removing c from a, b, c, d, e
// we do remove(2), and it
// gives a, b, d, e, with d occupying index 2 now.
// The loop goes on to i=3 and d is skipped
// SOLUTION:
// To avoid this when removing in the loop, LOOP BACKWARD
for (int i = particles.size(); i >= 0; i--) {
  if (particle.isDead()) {
    particles.remove(i);
  }
  particles[i].update();
  particles[i].display();
}
```

JavaScript Array: `.push(), [i], .splice(i, numToBeRemoved), .length`

Note: `.splice()` can also add items. [ref](https://www.w3schools.com/jsref/jsref_splice.asp)

### Organize Particles into one ParticleSystem class

```java
class ParticleSystem {
  ArrayList<Particle> particles;

  ParticleSystem() {
    particles = new ArrayList<Particle>();
  }

  void addParticle(Particle p) {
    particles.add(p);
  }

  void run() {
    ...
  }
}
```

A `ParticleSystem` class is essentially an `ArrayList` or `Particle`s. Its constructor
should be initializing that ArrayList. It can also have a `centerPosition` where all its
particles initialize at. It should be able to `addParticle()`, display all particles via
a loop in `run()`, and more depending on the use cases.

We can also have a `system of ParticleSystems` where it is an ArrayList of `ParticleSystem`s. We can assign properties to the system of systems and separate the functionality for each level of system.

### Inheritance

1. Inherit everything from super class
2. Add data or funtionality
3. Override functions
4. `super` ! Call its parent's function

```java
// extends is the keyword for inheritance
class Kitten extends Mammal {
  int numWhiskers;

  void sleep() {
    println("purrrr");
    super.sleep();
  }

  void meow() {}
}
```

Another example

```java
// extends is the keyword for inheritance
class SquareParticle extends Particle {
  SquareParticle(PVector l) {
    super(l);
  }

  void display() {
    fill(127);
    stroke(0);
    rectMode(CENTER);
    rect(location.x, location.y, 16, 16);
  }
}
```

### Polymorphism

Polymorphism allows us to use child classes as type parent class, e.g.
put child classes into one array of type parent class.

Suppose we have a class `Animal`, and `Dog`, `Cat` extends it.

```java
Animal[] kingdom = new Animal[100];

Animal spot = new Dog();
kingdom[0] = new Dog();
kingdom[1] = new Cat();
...

for (Animal a: kingdom) {
  // This is powerful! These call their own subclass functions!
  a.sleep();
  a.eat();
}
```

JavaScript ES6 has the same syntax `extends` and `super` as Java!

Note that JS has differences between ES5 class syntax and ES6 ones.

ES5 has

```js
function MyClass(params) {
  this.params = params;
}
```

while ES6 has

```js
class MyClass {
  constructor(params) {
    this.params;
  }
}
```

Here is a good [reference](https://javascript.info/class-inheritance).

### Use Image Textures with Particles

Processing uses `PImage` for images. Preload an image and don't load it in the constructor. Processing has `P2D` mode to render things much faster.

There is this `blendMode` concept, with `blendMode(ADD)` all the RGB values are added
on top of each other which creates a brighter effect.

[Ref video](https://www.youtube.com/watch?v=nzDYHa6ursA&list=PLRqwX-V7Uu6Z9hI4mSgx2FlE5w8zvjmEy&index=9)

