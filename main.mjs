import {Circle} from "./circle/circle.mjs";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

let worldWidth = canvas.width;
let worldHeight = canvas.height;

const updateWorldSettings = () => {
  if (worldHeight !== window.innerHeight || worldWidth !== window.innerWidth) {
    worldWidth = window.innerWidth;
    worldHeight = window.innerHeight;
    canvas.width = worldWidth;
    canvas.height = worldHeight;
  }
};

updateWorldSettings();

const circles = [];

const tryCreateCircle = () => {
  const x = worldWidth * Math.random();
  const y = worldHeight * Math.random();
  let valid = true;
  for (const circle of circles) {
    if (circle.contains(x, y)) {
      valid = false;
      break;
    }
  }

  if (valid)
    return new Circle({x, y});
  return null;
}

const update = () => {
  const c = tryCreateCircle();
  if (c)
    circles.push(c);

  ctx.clearRect(0, 0, worldWidth, worldHeight);

  const t1 = new Date().getTime();

  for (const circle of circles) {
    if (circle.growing) {
      if (circle.edges(0, worldWidth, 0, worldHeight)) {
        circle.growing = false;
      } else {
        for (const otherCircle of circles) {
          if (circle.id !== otherCircle.id) {
            if (circle.intersectsWithCircle(otherCircle)) {
              circle.growing = false;
              break;
            }
          }
        }
      }
    }
    circle.draw(ctx);
    circle.grow();
  }

  const t2 = new Date().getTime();
  // console.log(t2 - t1);

  updateWorldSettings();

  requestAnimationFrame(update);
}

update();
