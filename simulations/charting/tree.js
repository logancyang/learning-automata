class Leaf {
  constructor() {
    const randX = randomGaussian(width/2, width/6);
    const randY = randomGaussian(height/2, height/6);
    const randZ = randomGaussian(depth/2, depth/6);
    this.pos = createVector(randX, randY, randZ);
    this.reached = false;
  }

  show() {
    fill(125);
    noStroke();
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    sphere(0.8);
    pop();
  }
}


class Branch {
  constructor(parent, pos, dir) {
    this.pos = pos;
    this.parent = parent;
    this.dir = dir;
    this.originDir = dir.copy();
    // # times surrounding leaves find this branch as closest
    this.count = 0;
    this.lenMultiplier = 60;
  }

  next() {
    const newDir = p5.Vector.mult(this.dir, this.lenMultiplier);
    const nextPos = p5.Vector.add(this.pos, newDir);
    return new Branch(this, nextPos, this.dir.copy());
  }

  reset() {
    this.dir = this.originDir.copy();
    this.count = 0;
  }

  show() {
    if (this.parent) {
      stroke(200);
      line(
        this.pos.x, this.pos.y, this.pos.z,
        this.parent.pos.x, this.parent.pos.y, this.parent.pos.z
      );
    }
  }
}


class Tree {
  constructor(opts) {
    this.leaves = [];
    this.branches = [];
    this.showLeaves = opts.showLeaves;

    const pos = createVector(width/2, height/2, depth/2);
    const dir = createVector(0, -1, 0);
    const root = new Branch(null, pos, dir);
    this.branches.push(root);

    // Add leaves
    for (let i = 0; i < NUM_LEAVES; i++) {
      this.leaves.push(new Leaf());
    }

    // Space Colonization algo: grow the root to be near the leaves
    let found = false;
    let curr = root;
    while (!found) {
      for (const leaf of this.leaves) {
        let d = p5.Vector.dist(curr.pos, leaf.pos);
        if (d < MAX_DIST) {
          found = true;
        }
      }

      if (!found) {
        let branch = curr.next();
        curr = branch;
        this.branches.push(curr);
      }
    }
  }

  grow() {
    // Look at all leaves.
    // For each leaf, find its closest branch that is in (MIN_DIST, MAX_DIST)
    for (const leaf of this.leaves) {
      let closestBranch = null;
      let record = 100000;
      for (const branch of this.branches) {
        let d = p5.Vector.dist(leaf.pos, branch.pos);
        if (d < MIN_DIST) {
          leaf.reached = true;
          closestBranch = null;
          break;
        } else if (closestBranch === null || d < record) {
          closestBranch = branch;
          record = d;
        }
      }

      if (closestBranch !== null) {
        // Found closestBranch for this leaf, grow a new branch
        // IMPORTANT: this is the part that determines the next branch's
        // magnitude and direction
        let genDir = p5.Vector.sub(leaf.pos, closestBranch.pos);
        genDir.normalize();
        const randnum = random(0, 1);
        if (randnum < 0.3333) {
          closestBranch.dir = createVector(genDir.x, 0, 0);
        } else if (randnum > 0.3333 && randnum < 0.6666) {
          closestBranch.dir = createVector(0, genDir.y, 0);
        } else {
          closestBranch.dir = createVector(0, 0, genDir.z);
        }
        closestBranch.count++;
      }
    }

    // Remove reached leaves
    for (let i = this.leaves.length-1; i >= 0; i--) {
      if (this.leaves[i].reached) this.leaves.splice(i, 1);
    }

    // Find the branches to be grown on (closest to some leaves)
    for (let i = this.branches.length-1; i >= 0; i--) {
      const branch = this.branches[i];
      if (branch.count > 0) {
        // If branch is close to many leaves, discount new branch length
        // and add new branch to branches list
        branch.dir.div(branch.count);
        this.branches.push(branch.next());
      }
      // IMPORTANT: reset this branch
      branch.reset();
    }
  }

  show() {
    if (this.showLeaves) {
      for (const leaf of this.leaves) {
        leaf.show();
      }
    }

    for (let i = 0; i < this.branches.length; i++) {
      const b = this.branches[i];
      if (b.parent) {
        // const thickness = map(i, 0, this.branches.length, 1.5, 0.5);
        strokeWeight(1);
        stroke(66, 192, 248);
        line(
          b.pos.x, b.pos.y, b.pos.z,
          b.parent.pos.x, b.parent.pos.y, b.parent.pos.z
        );
      }
    }
  }
}


