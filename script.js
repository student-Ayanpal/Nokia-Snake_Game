const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 20;
const canvasSize = canvas.width;
let snake, direction, food, score, interval, speed, specialFood, bugCounter;
let specialTimer;
let isPaused = false;

function startGame() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "flex";

  const level = document.getElementById("level").value;
  speed = level === 'easy' ? 300 : level === 'medium' ? 250 : 200;
  score = 0;
  bugCounter = 0;
  direction = 'right';
  snake = [{x: 5, y: 5}];
  food = randomPosition();
  specialFood = null;
  updateScore();
  document.getElementById("pauseBtn").innerText = "Pause";
  isPaused = false;

  showKeyboardHint(); 

  clearInterval(interval);
  interval = setInterval(update, speed);
}

function update() {
  if (isPaused) return;

  const head = {...snake[0]};
  if (direction === 'up') head.y--;
  if (direction === 'down') head.y++;
  if (direction === 'left') head.x--;
  if (direction === 'right') head.x++;

  if (head.x < 0 || head.x >= canvasSize / gridSize || head.y < 0 || head.y >= canvasSize / gridSize || snake.some(p => p.x === head.x && p.y === head.y)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    bugCounter++;
    food = randomPosition();
    if (bugCounter % 5 === 0) spawnSpecialFood();
  } else if (specialFood && head.x === specialFood.x && head.y === specialFood.y) {
    score += 5;
    specialFood = null;
    document.getElementById("special-bug").innerText = "";
    clearInterval(specialTimer);
  } else {
    snake.pop();
  }

  updateScore();
  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);
  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.arc(food.x * gridSize + 10, food.y * gridSize + 10, 8, 0, Math.PI * 2);
  ctx.fill();

  if (specialFood) {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(specialFood.x * gridSize + 10, specialFood.y * gridSize + 10, 12, 0, Math.PI * 2);
    ctx.fill();
  }

  snake.forEach((segment, i) => {
    ctx.fillStyle = "red";
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);

    if (i === 0) {
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(segment.x * gridSize + 5, segment.y * gridSize + 5, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(segment.x * gridSize + 15, segment.y * gridSize + 5, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

function randomPosition() {
  let position;
  do {
    position = {
      x: Math.floor(Math.random() * canvasSize / gridSize),
      y: Math.floor(Math.random() * canvasSize / gridSize)
    };
  } while (snake.some(segment => segment.x === position.x && segment.y === position.y));
  return position;
}

function changeDirection(dir) {
  if (dir === 'up' && direction !== 'down') direction = 'up';
  else if (dir === 'down' && direction !== 'up') direction = 'down';
  else if (dir === 'left' && direction !== 'right') direction = 'left';
  else if (dir === 'right' && direction !== 'left') direction = 'right';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') changeDirection('up');
  if (e.key === 'ArrowDown') changeDirection('down');
  if (e.key === 'ArrowLeft') changeDirection('left');
  if (e.key === 'ArrowRight') changeDirection('right');
});

function updateScore() {
  document.getElementById("score").innerText = "Score: " + score;
}

function spawnSpecialFood() {
  specialFood = randomPosition();
  let timeLeft = 10;
  document.getElementById("special-bug").innerText = "Time Left: " + timeLeft + "s";

  specialTimer = setInterval(() => {
    timeLeft--;
    document.getElementById("special-bug").innerText = "Time left: " + timeLeft + "s";
    if (timeLeft <= 0) {
      specialFood = null;
      document.getElementById("special-bug").innerText = "";
      clearInterval(specialTimer);
    }
  }, 1000);
}

function togglePause() {
  const btn = document.getElementById("pauseBtn");
  if (isPaused) {
    interval = setInterval(update, speed);
    isPaused = false;
    btn.innerText = "Pause";
  } else {
    clearInterval(interval);
    isPaused = true;
    btn.innerText = "Resume";
  }
}

function gameOver() {
  clearInterval(interval);
  document.getElementById("game-screen").style.display = "none";
  document.getElementById("game-over-screen").style.display = "block";
  document.getElementById("final-score").innerText = "Final Score: " + score;

  const feedback = document.getElementById("feedback-message");
  if (score >= 30) {
    feedback.innerText = "Excellent";
  } else if (score >= 10) {
    feedback.innerText = "Good";
  } else {
    feedback.innerText = "Try Again";
  }
}

function resetGame() {
  document.getElementById("game-over-screen").style.display = "none";
  document.getElementById("start-screen").style.display = "block";
  document.getElementById("feedback-message").innerText = "";
}

function showKeyboardHint() {
  const hint = document.getElementById("keyboard-hint");
  const isDesktop = window.innerWidth > 768;
  if (isDesktop) {
    hint.style.display = "block";
    setTimeout(() => {
      hint.style.display = "none";
    }, 5000);
  }
}

// Floating bubbles animation
const container = document.getElementById('bubble-container');
const totalBubbles = 50;

for (let i = 0; i < totalBubbles; i++) {
  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  bubble.classList.add(i % 2 === 0 ? 'cyan' : 'red');
  bubble.style.left = Math.random() * 100 + 'vw';
  bubble.style.animationDuration = `${10 + Math.random() * 10}s`;
  bubble.style.animationDelay = `${Math.random() * 5}s`;
  container.appendChild(bubble);
}
