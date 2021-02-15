let pause = false;

class Fruit {
  constructor() {
    this.pos = createVector(0, 0);
    this.speed = createVector(0, 0);
    this.prec = 1000;
    this.speed_amp = 100;
    this.size = random(20) + 60;
  }

  rand_init() {
    let angle = map(random(1000), 0, 1000, -0.95, 0.5) * TWO_PI;
    this.pos = createVector(random((width * 1) / 4) + width / 4, height);
    this.speed = createVector(random(50) - 25, random(30) + 70);
  }

  update(time_step) {
    this.speed.y -= time_step * 9.807;
    this.pos.x += this.speed.x * time_step;
    this.pos.y -= this.speed.y * time_step;
  }
}

function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(1);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 4;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 4, 0, -arrowSize / 4, arrowSize, 0);
  pop();
}

class SlicedFruit {
  sgn(x) {
    if (x < 0) {
      return -1;
    } else {
      return 1;
    }
  }

  re_create_angle(pp1) {
    pp1.y = -pp1.y;
    let angle = atan(pp1.y / pp1.x);
    if (pp1.x > 0 && pp1.y > 0) {
      return TWO_PI - angle;
    }
    if (pp1.x < 0 && pp1.y > 0) {
      return PI - angle;
    }
    if (pp1.x > 0 && pp1.y < 0) {
      return -angle;
    }
    if (pp1.x < 0 && pp1.y < 0) {
      return PI - angle;
    }
  }

  calc_angles(p1, p2) {
    p1 = p5.Vector.sub(p1, this.fruit.pos);
    p2 = p5.Vector.sub(p2, this.fruit.pos);

    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;
    let dr = sqrt(dx ** 2 + dy ** 2);
    let dd = p1.x * p2.y - p2.x * p1.y;

    let pp1 = createVector(0, 0);
    let pp2 = createVector(0, 0);

    pp1.x =
      (dd * dy +
        this.sgn(dy) *
          dx *
          sqrt((this.fruit.size / 2) ** 2 * dr ** 2 - dd ** 2)) /
      dr ** 2;
    pp1.y =
      (-dd * dx +
        abs(dy) * sqrt((this.fruit.size / 2) ** 2 * dr ** 2 - dd ** 2)) /
      dr ** 2;

    this.angle1 = this.re_create_angle(pp1);

    pp2.x =
      (dd * dy -
        this.sgn(dy) *
          dx *
          sqrt((this.fruit.size / 2) ** 2 * dr ** 2 - dd ** 2)) /
      dr ** 2;
    pp2.y =
      (-dd * dx -
        abs(dy) * sqrt((this.fruit.size / 2) ** 2 * dr ** 2 - dd ** 2)) /
      dr ** 2;

    this.angle2 = this.re_create_angle(pp2);
  }

  constructor(fruit, p1, p2) {
    this.created = false;
    this.fruit = fruit;
    this.pos1 = createVector(fruit.pos.x, fruit.pos.y);
    this.pos2 = createVector(fruit.pos.x, fruit.pos.y);
    this.angle1 = 0;
    this.angle2 = 0;
    this.calc_angles(p1, p2);
    this.speed1 = createVector(fruit.speed.x, fruit.y);
    this.speed2 = createVector(fruit.speed.x, fruit.y);
    this.speed1.x -= 10;
    this.speed2.x += 10;
    this.t1 = 0;
    this.t2 = 0;
    this.tp = map(random(1000), 0, 1000, -0.1, 0.1);
  }

  update(time_step) {
    this.speed1.y -= 9.807 * time_step;
    this.speed2.y -= 9.807 * time_step;

    this.pos1.x += this.speed1.x * time_step;
    this.pos1.y -= this.speed1.y * time_step;

    this.pos2.x += this.speed2.x * time_step;
    this.pos2.y -= this.speed2.y * time_step;

    this.t1 += this.tp;
    this.t2 -= this.tp;
  }

  draw() {
    noStroke();
    fill(this.fruit.color);
    push();
    translate(this.pos1.x, this.pos1.y);
    rotate(this.t1);
    arc(
      0,
      0,
      this.fruit.size,
      this.fruit.size,
      this.angle1,
      this.angle2,
      CHORD
    );
    pop();
    push();
    translate(this.pos2.x, this.pos2.y);
    rotate(this.t2);
    arc(
      0,
      0,
      this.fruit.size,
      this.fruit.size,
      this.angle2,
      this.angle1,
      CHORD
    );
    pop();
  }
}

class Orange extends Fruit {
  constructor() {
    super();
    this.rand_init();
    this.color = "orange";
  }

  draw() {
    strokeWeight(this.size);
    stroke(this.color);
    point(this.pos);
  }
}

class Watermelon extends Fruit {
  constructor() {
    super();
    this.rand_init();
    this.color = "green";
  }

  draw() {
    strokeWeight(this.size);
    stroke(this.color);
    point(this.pos);
  }
}

class Bomb extends Fruit {
  constructor() {
    super();
    this.rand_init();
    this.color = "black";
  }

  draw() {
    strokeWeight(this.size);
    stroke(this.color);
    point(this.pos);
  }
}

function mousePressed() {
  mouse_pressed = true;
}

function mouseReleased() {
  mouse_pressed = false;
  clice_points.splice(0, clice_points.length);
}

function remove_element(element) {
  for (i = 0; i < fruit_list.length; i++) {
    if (fruit_list[i] == element) {
      fruit_list.splice(i, 1);
    }
  }
}

function sleep(milis) {
  let start = millis();

  while (true) {
    if (millis() - start >= milis) {
      return;
    }
  }
}

function removeA(arr) {
  var what,
    a = arguments,
    L = a.length,
    ax;
  while (L > 1 && arr.length) {
    what = a[--L];
    while ((ax = arr.indexOf(what)) !== -1) {
      arr.splice(ax, 1);
    }
  }
  return arr;
}

function check_if_hit(mouse_pos, prev_mouse_pos, fruit) {
  if (p5.Vector.sub(mouse_pos, fruit.pos).mag() > fruit.size) return false;

  p1 = p5.Vector.sub(mouse_pos, fruit.pos);
  p2 = p5.Vector.sub(prev_mouse_pos, fruit.pos);

  let dx = p2.x - p1.x;
  let dy = p2.y - p1.y;
  let dr = sqrt(dx ** 2 + dy ** 2);
  let dd = p1.x * p2.y - p2.x * p1.y;

  if ((fruit.size / 2) ** 2 * dr ** 2 - dd ** 2 >= 0) return true;

  return false;
}

let fruit;
let last_mouse_pos;
let moving = false;
let fruit_list = [];
let min_speed = 1;
let mouse_pressed = false;
let score = 0;
let mouse_path = [];
let list_of_sliced = [];
let clice_points = [];
let max_trail_lengh = 10;
let min_trail_speed = 30;

function setup() {
  const canvas = createCanvas(900, 600);
  canvas.parent("sketch-holder");
  frameRate(120);
  last_mouse_pos = createVector(mouseX, mouseY);
}

function draw() {
  background(220);

  moving =
    p5.Vector.sub(last_mouse_pos, createVector(mouseX, mouseY)).mag() >
    min_speed;

  fruit_list.forEach((fruit) => fruit.update(deltaTime / 100));
  fruit_list.forEach((fruit) => fruit.draw());
  list_of_sliced.forEach((fruit) => fruit.update(deltaTime / 100));
  list_of_sliced.forEach((fruit) => fruit.draw());
  list_of_sliced.forEach((fruit) => {
    if (fruit.pos1.y > height + 100) {
      removeA(list_of_sliced, fruit);
    }
  });

  fruit_list.forEach((fruit) => {
    if (fruit.pos.y > height + 100) {
      removeA(fruit_list, fruit);
      if (!(fruit instanceof Bomb)) {
        score -= 3;
      }
    }
  });

  for (a = 0; a < list_of_sliced.lengh; a++) {
    if (
      list_of_sliced[a].pos1.y > height ||
      list_of_sliced[a].pos2.y > height
    ) {
      list_of_sliced.splice(a, 1);
    }
  }

  for (a = 0; a < fruit_list.size; a++) {
    print(fruit_list[a].pos.y);
    if (fruit_list[a].pos.y > height) {
      fruit_list.splice(a, 1);
    }
  }

  if (mouse_pressed && moving) {
    fruit_list.forEach(function (fruit) {
      if (check_if_hit(createVector(mouseX, mouseY), last_mouse_pos, fruit)) {
        score++;
        if (fruit instanceof Bomb) {
          score -= 11;
        } else {
          let tmp = new SlicedFruit(
            fruit,
            createVector(mouseX, mouseY),
            last_mouse_pos
          );
          list_of_sliced.push(tmp);
        }
        remove_element(fruit);
      }
    });
  }

  if (random(100) > 97) {
    switch (int(random(3))) {
      case 0:
        fruit_list.push(new Orange());
        break;
      case 1:
        fruit_list.push(new Watermelon());
        break;
      case 2:
        fruit_list.push(new Bomb());
        break;
    }
  }

  stroke(color(0, 0, 0, 0));
  textSize(20);
  fill("black");
  text(score, 20, 30);

  last_mouse_pos.x = mouseX;
  last_mouse_pos.y = mouseY;
}
