const canvas = document.getElementById("fallingCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const heading = document.getElementById("main-heading");
const headingRect = heading.getBoundingClientRect();
const resumeBtn = document.getElementById("resume-btn").getBoundingClientRect();
const projectsBtn = document.getElementById("projects-btn").getBoundingClientRect();
const linkedinBtn = document.getElementById("linkedin-btn").getBoundingClientRect();
const buttonRects = [resumeBtn, projectsBtn, linkedinBtn];

const shipImage = new Image();
shipImage.src = "Retro_Blue_ship.png.webp";

let ship = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 60,
  width: 40,
  height: 40,
  speed: 5
};

let bullets = [];
let keys = {};
let isPaused = false;

const imageMagenta = new Image();
imageMagenta.src = "invader_3.png";

const imageGreen = new Image();
imageGreen.src = "invader_6.png";
document.addEventListener("keydown", (e) => {
  keys[e.key] = true;

  // Space bar to shoot
  if (e.key === " ") {
    bullets.push({ x: ship.x + ship.width / 2 - 2, y: ship.y });
  }

  // 'p' to toggle pause
  if (e.key.toLowerCase() === "p") {
    isPaused = !isPaused;
  }
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

class FallingInvader {
  constructor() {
    this.width = 40;
    this.height = 40;
    this.x = Math.random() * (canvas.width - this.width);
    this.y = -this.height;
    this.dy = 2 + Math.random() * 2;

    // Randomly choose between magenta and green invader
    this.image = Math.random() < 0.5 ? imageMagenta : imageGreen;
  }

update() {
  // Collision detection with the heading
  if (
    this.y + this.height >= headingRect.top &&
    this.y <= headingRect.bottom &&
    this.x + this.width >= headingRect.left &&
    this.x <= headingRect.right
  ) {
    this.dy *= -0.7;
    this.y = headingRect.top - this.height;
  } else {
    // Bounce off any of the buttons
    let bounced = false;
    for (const rect of buttonRects) {
      if (
        this.y + this.height >= rect.top &&
        this.y <= rect.bottom &&
        this.x + this.width >= rect.left &&
        this.x <= rect.right
      ) {
        this.dy *= -0.7;
        this.y = rect.top - this.height;
        bounced = true;
        break;
      }
    }

    if (!bounced) {
      this.dy += 0.1;
    }
  }

  this.y += this.dy;
}

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

let invaders = [];

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const heading = document.getElementById("main-heading");
const headingRect = heading.getBoundingClientRect();
const resumeBtn = document.getElementById("resume-btn").getBoundingClientRect();
const projectsBtn = document.getElementById("projects-btn").getBoundingClientRect();
const linkedinBtn = document.getElementById("linkedin-btn").getBoundingClientRect();
const buttonRects = [resumeBtn, projectsBtn, linkedinBtn];

  if (isPaused) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("PAUSED", canvas.width / 2 - 60, canvas.height / 2);
    requestAnimationFrame(animate);
    return;
  }

  if (keys["ArrowLeft"] && ship.x > 0) {
    ship.x -= ship.speed;
  }
  if (keys["ArrowRight"] && ship.x < canvas.width - ship.width) {
    ship.x += ship.speed;
  }

  ctx.drawImage(shipImage, ship.x, ship.y, ship.width, ship.height);

  bullets.forEach((bullet, bulletIndex) => {
  bullet.y -= 10;

  // Draw the bullet
  ctx.fillStyle = "red";
  ctx.fillRect(bullet.x, bullet.y, 4, 10);

  // Check collision with each invader
  invaders.forEach((invader, invaderIndex) => {
    const hit = bullet.x < invader.x + invader.width &&
                bullet.x + 4 > invader.x &&
                bullet.y < invader.y + invader.height &&
                bullet.y + 10 > invader.y;

    if (hit) {
      // Remove the bullet and the invader
      bullets.splice(bulletIndex, 1);
      invaders.splice(invaderIndex, 1);
    }
  });

  // Remove bullet if it leaves screen
  if (bullet.y < 0) {
    bullets.splice(bulletIndex, 1);
  }
});

  if (invaders.length < 20) {
    invaders.push(new FallingInvader());
  }

  invaders.forEach((invader, index) => {
    invader.update();
    invader.draw();

    if (invader.y > canvas.height) {
      invaders.splice(index, 1);
    }
  });

  requestAnimationFrame(animate);
}

animate();
