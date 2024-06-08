import {Circle} from "./circle/circle.mjs";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const maskCanvas = document.createElement("canvas");
const maskCtx = maskCanvas.getContext('2d', {willReadFrequently: true});

let worldWidth = canvas.width;
let worldHeight = canvas.height;
let worldChanged = false;

const updateWorldSettings = () => {
  if (worldHeight !== window.innerHeight || worldWidth !== window.innerWidth) {
    worldWidth = window.innerWidth;
    worldHeight = window.innerHeight;
    canvas.width = worldWidth;
    canvas.height = worldHeight;
    maskCanvas.width = worldWidth;
    maskCanvas.height = worldHeight;
    worldChanged = true;
  }
};

updateWorldSettings();

const circles = [];
let maskData = null;

const tryCreateCircle = (maskImgData) => {
  const x = Math.floor(worldWidth * Math.random());
  const y = Math.floor(worldHeight * Math.random());
  let valid = true;
  for (const circle of circles) {
    if (circle.contains(x, y)) {
      valid = false;
      break;
    }
  }

  if (valid) { // if so far valid check mask
    valid = false;

    const i = (y * worldWidth + x) * 4;

    // A single pixel (R, G, B, A) will take 4 positions in the array:
    const R = maskImgData[i];
    // const G = maskImgData[i + 1];
    // const B = maskImgData[i + 2];
    // const A = maskImgData[i + 3] / 255;
    // console.log(R)
    // // Alpha-weighted color:
    // const wR = (R * A + 255 * iA) | 0;
    // const wG = (G * A + 255 * iA) | 0;
    // const wB = (B * A + 255 * iA) | 0;
    if (R > 0)
      valid = true;
  }
  if (valid)
    return new Circle({x, y});
  return null;
}

let circleAttempts = 0;

const update = () => {
  const t1 = new Date().getTime();

  if (worldChanged) {
    worldChanged = false;

    maskCtx.translate(worldWidth / 2, worldHeight / 2);
    maskCtx.scale(2, 4);
    maskCtx.fillStyle = 'rgba(255,0,0,1)';
    let p = new Path2D("M0-50A50 50 0 1 0 0 50 50 50 0 0 0 0-50Zm0 20a30 30 0 1 1 0 60 30 30 0 0 1 0-60Z");
    maskCtx.fill(p);
    p = new Path2D("M135-50a10 10 0 0 0-10 10V8L88-46a10 10 0 0 0-18 6v80a10 10 0 0 0 10 10 10 10 0 0 0 10-10V-8l37 54a10 10 0 0 0 18-6v-80a10 10 0 0 0-10-10Z");
    maskCtx.fill(p);
    p = new Path2D("M175-50c-6 0-10 4-10 10v80c0 6 4 10 10 10h55a10 10 0 1 0 0-20h-45V10h20a10 10 0 0 0 0-20h-20v-20h45a10 10 0 1 0 0-20z");
    maskCtx.fill(p);

    maskCtx.restore();

    maskData = maskCtx.getImageData(0, 0, worldWidth, worldHeight).data;
  }
  maskCtx.save();


  let cCount = 0;
  while (cCount < 10 && circleAttempts < 10000) {
    circleAttempts++;
    const c = tryCreateCircle(maskData);
    if (c) {
      circles.push(c);
      cCount++;
    }
  }
  if (circleAttempts < 10000)
    circleAttempts = 0;

  ctx.clearRect(0, 0, worldWidth, worldHeight);


  for (const circle of circles) {
    if (circle.growing) {
      if (circle.r >= 10)
        circle.growing = false;
      else if (circle.edges(0, worldWidth, 0, worldHeight)) {
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
