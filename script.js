const canvas = document.getElementById("sunflowerCanvas");
const ctx = canvas.getContext("2d");
resizeCanvas();

const cx = canvas.width / 2;
const cy = 250;

function resizeCanvas() {
  canvas.width = 500;
  canvas.height = 700;
}

// --- Dibujado base ---
function drawPetal(angle, radius, color, alpha = 1) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(radius * 0.2, -radius * 0.5, 0, -radius);
  ctx.quadraticCurveTo(-radius * 0.2, -radius * 0.5, 0, 0);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawLeaf(xOffset, yOffset, flip = 1, rotationDeg = 0) {
  ctx.save();
  ctx.translate(cx + xOffset, cy + yOffset);
  ctx.rotate((rotationDeg * Math.PI) / 180);
  ctx.scale(flip, 1);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(40, 20, 0, 60);
  ctx.quadraticCurveTo(-30, 30, 0, 0);
  ctx.fillStyle = "#2ecc71";
  ctx.fill();
  ctx.restore();
}

function drawStem() {
  ctx.beginPath();
  ctx.moveTo(cx - 8, cy + 60);
  ctx.lineTo(cx - 8, cy + 300);
  ctx.lineTo(cx + 8, cy + 300);
  ctx.lineTo(cx + 8, cy + 60);
  ctx.closePath();
  ctx.fillStyle = "#27ae60";
  ctx.fill();
}

function drawLeaves() {
  drawLeaf(-45, 120, 1, -40);
  drawLeaf(45, 180, -1, 40);
}

function drawCenter() {
  ctx.beginPath();
  ctx.arc(cx, cy, 60, 0, 2 * Math.PI);
  ctx.fillStyle = "#5e2c04";
  ctx.fill();
}

function drawRing() {
  ctx.beginPath();
  ctx.arc(cx, cy, 65, 0, 2 * Math.PI);
  ctx.strokeStyle = "#a77d4d";
  ctx.lineWidth = 8;
  ctx.stroke();
}

function drawStraightTextBelowFlower(text, yOffset = 350) {
  ctx.save();
  ctx.font = "bold 32px Arial";
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.fillText(text, cx, cy + yOffset);
  ctx.restore();
}

// --- Texto animado letra por letra ---
function drawCurvedTextLetter(char, angle, radius, centerX, centerY) {
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(angle);
  ctx.translate(0, -radius);
  ctx.rotate(-angle);
  ctx.fillStyle = "rgba(255, 215, 0, 0.8)";
  ctx.font = "bold 25px Arial";
  ctx.fillText(char, -6, 0);
  ctx.restore();
}

function animateCurvedText(text, radius, centerX, centerY, startAngle, spacing, delay, onFinish) {
  const chars = text.split("");
  const angleStep = spacing / radius;
  let angle = startAngle - (chars.length / 2) * angleStep;
  let index = 0;

  function drawNext() {
    if (index >= chars.length) {
      onFinish && onFinish();
      return;
    }
    const char = chars[index];
    drawCurvedTextLetter(char, angle, radius, centerX, centerY);
    angle += angleStep;
    index++;
    setTimeout(drawNext, delay);
  }

  drawNext();
}

// --- Estados acumulativos ---
let outerPetals = [];
let innerPetals = [];

// --- Animación general ---
function animateLayer(petalArray, radius, color, delay, store, callback) {
  let index = 0;

  function fadeIn() {
    const angle = petalArray[index];
    let alpha = 0;

    function step() {
      alpha += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawStem();
      drawLeaves();

      outerPetals.forEach(p => drawPetal(p.angle, p.radius, p.color));
      innerPetals.forEach(p => drawPetal(p.angle, p.radius, p.color));

      drawPetal(angle, radius, color, alpha);

      if (alpha < 1) {
        requestAnimationFrame(step);
      } else {
        store.push({ angle, radius, color });
        index++;
        if (index < petalArray.length) {
          setTimeout(fadeIn, delay);
        } else {
          callback && callback();
        }
      }
    }

    step();
  }

  fadeIn();
}

// --- Ejecución principal ---
function animateSunflower() {
  const petals = 20;
  const outerAngles = Array.from({ length: petals }, (_, i) => (i * 2 * Math.PI) / petals);
  const innerAngles = Array.from({ length: petals }, (_, i) => ((i + 0.5) * 2 * Math.PI) / petals);

  animateLayer(outerAngles, 120, "#f1c40f", 10, outerPetals, () => {
    animateLayer(innerAngles, 90, "#f39c12", 10, innerPetals, () => {
      setTimeout(() => {
        drawCenter();
        setTimeout(() => {
          drawRing();
          setTimeout(() => {
            animateCurvedText("FELIZ CUMPLEAÑOS PICIOSA!!", 165, cx, cy -10, 0, 20, 80, () => {
              drawStraightTextBelowFlower("TE AMO ❤️", 340);
            });
          }, 300);
        }, 300);
      }, 300);
    });
  });
}

animateSunflower();