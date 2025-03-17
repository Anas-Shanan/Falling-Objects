window.onload = function () {
  const canvas = document.getElementById("gameCanvas");
  let ctx = canvas.getContext("2d");

  canvas.width = 800;
  canvas.height = 600;

  let startTheGame = document.getElementById("start");
  startTheGame.addEventListener("click", onClick);

  let gameRunning = false;
  let score = 0;
  let missed = 0;
  let timeLeft = 2000;

  function onClick() {
    gameRunning = true;
    startTheGame.style.display = "none";
    gameLoop(gameRunning);
    timer();
  }

  console.log("Game started:", gameRunning);

  ctx.fillStyle = "lightblue";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const player = {
    x: canvas.width / 2 - 50, // Startposition in der Mitte
    y: canvas.height - 50, // Am unteren Rand
    width: 200,
    height: 20,
    speed: 10,
  };

  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  function createFallingObject() {
    console.log("falling obj", createFallingObject);
    return {
      x: Math.random() * canvas.width,
      y: 0,
      radius: 10 + Math.random() * 15, // Zufällige Größe
      speed: 2 + Math.random() * 3, // Zufällige Geschwindigkeit
      color: getRandomColor(),
    };
  }

  const fallingObjects = [];
  function moveFallingObjects() {
    for (let obj of fallingObjects) {
      obj.y += obj.speed;
      if (obj.y - obj.radius > canvas.height) {
        /* missed++; */
        fallingObjects.splice(fallingObjects.indexOf(obj), 1);
      }
    }
  }

  function checkCollision(obj) {
    if (
      obj.y + obj.radius >= player.y &&
      obj.x + obj.radius > player.x &&
      obj.x - obj.radius < player.x + player.width
    ) {
      score++;
      fallingObjects.splice(fallingObjects.indexOf(obj), 1);
    } else if (obj.y >= canvas.height) {
      missed++;
      fallingObjects.splice(fallingObjects.indexOf(obj), 1);
    }
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "a") {
      if (player.x > 0) player.x -= player.speed;
    } else if (event.key === "ArrowRight" || event.key === "d") {
      if (player.x + player.width < canvas.width) player.x += player.speed;
    }
  });

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function timer() {
    if (timeLeft > 0) {
      timeLeft--;
    } else if (timeLeft <= 0) {
      gameRunning = false;
    }
  }
  function gameOver() {
    if (missed >= 5) {
      gameRunning = false;
      ctx.fillStyle = "red";
      ctx.font = "70px Arial";
      ctx.fillText("Game Over Habibi", 100, 300);
      startTheGame.style.display = "block";
      timer.style.display = "none";
      /* gameLoop(false); */
    }
  }

  function draw() {
    console.log("Draw function ", draw);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Canvas löschen

    ctx.fillStyle = "lightblue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Spieler zeichnen
    ctx.fillStyle = "green";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Fallende Objekte zeichnen
    console.log("Falling objects in draw:", fallingObjects);
    for (let obj of fallingObjects) {
      console.log("Drawing object:", obj);

      ctx.fillStyle = obj.color;
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }

    // Punktzahl anzeigen
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Punkte: " + score, 10, 30);
    ctx.fillText("Missed:" + missed, 10, 60);
    ctx.fillStyle = "green";
    ctx.fillText("Time: " + timeLeft + "s", 10, 90);
    gameOver();
  }

  function gameLoop(value) {
    console.log("game running", gameRunning);
    if (value) {
      moveFallingObjects();
      for (let obj of fallingObjects) {
        checkCollision(obj);
      }
      console.log(" draw", draw);
      draw();
      timer();
      requestAnimationFrame(gameLoop); // Ruft die gameLoop-Funktion wieder auf
    } else {
      return;
    }
  }

  // Spiel starten
  setInterval(() => {
    if (gameRunning) {
      fallingObjects.push(createFallingObject());
      /////console.log("Falling objects:", fallingObjects);
    }
  }, 2000);

  /* setInterval(() => {
  gameLoop(false);
}, 20000); */

  /*   setTimeout(() => {
    gameRunning = false;
    gameLoop(gameRunning);

    console.log("Game stopped after one minute");
  }, 60000); */
};

/* window.onload = function () {
  const canvas = document.getElementById("gameCanvas");
  let ctx = canvas.getContext("2d");

  canvas.width = 800;
  canvas.height = 600;

  let startTheGame = document.getElementById("start");
  startTheGame.addEventListener("click", onClick);

  let gameRunning = false;
  let gameInterval;
  let timerInterval;
  let score = 0;
  let missed = 0;
  let timeLeft = 5; // 60 seconds = 1 minute

  const player = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 50,
    width: 200,
    height: 20,
    speed: 10,
  };
  const fallingObjects = [];

  function onClick() {
    if (!gameRunning) {
      gameRunning = true;
      score = 0;
      missed = 0;
      timeLeft = 5; // Reset the timer
      fallingObjects.length = 0; // Clear falling objects
      startTheGame.style.display = "none"; // Hide the start button
      gameInterval = setInterval(() => {
        if (gameRunning) {
          fallingObjects.push(createFallingObject());
        }
      }, 1000); // Create a new falling object every second
      startTimer(); // Start the timer
    }
  }

  function startTimer() {
    timerInterval = setInterval(() => {
      timeLeft--; // Decrease the time by 1 second
      if (timeLeft <= 0) {
        clearInterval(timerInterval); // Stop the timer
        endGame(); // Call a function to handle the end of the game
      }
    }, 1000); // Update every 1000ms (1 second)
  }

  function createFallingObject() {
    return {
      x: Math.random() * (canvas.width - 20),
      y: 0,
      radius: 10 + Math.random() * 15,
      speed: 2 + Math.random() * 3,
      color: getRandomColor(),
    };
  }

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function moveFallingObjects() {
    for (let obj of fallingObjects) {
      obj.y += obj.speed;
      if (obj.y - obj.radius > canvas.height) {
        missed++;
        fallingObjects.splice(fallingObjects.indexOf(obj), 1);
      }
    }
  }

  function checkCollision(obj) {
    if (
      obj.y + obj.radius >= player.y &&
      obj.x + obj.radius > player.x &&
      obj.x - obj.radius < player.x + player.width
    ) {
      score++;
      fallingObjects.splice(fallingObjects.indexOf(obj), 1);
    }
  }

  document.addEventListener("keydown", (event) => {
    if (gameRunning) {
      if (event.key === "ArrowLeft" || event.key === "a") {
        if (player.x > 0) player.x -= player.speed;
      } else if (event.key === "ArrowRight" || event.key === "d") {
        if (player.x + player.width < canvas.width) player.x += player.speed;
      }
    }
  });

  function endGame() {
    gameRunning = false;
    clearInterval(gameInterval); // Stop creating new falling objects
    ctx.fillStyle = "red";
    ctx.font = "48px Arial";
    ctx.fillText("Time's Up!", canvas.width / 2 - 100, canvas.height / 2);
    ctx.fillText(
      "Final Score: " + score,
      canvas.width / 2 - 120,
      canvas.height / 2 + 50
    );
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = "lightblue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = "green";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw falling objects
    for (let obj of fallingObjects) {
      ctx.fillStyle = obj.color;
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }

    // Draw score, missed, and timer
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Punkte: " + score, 10, 30);
    ctx.fillText("Missed: " + missed, 10, 60);
    ctx.fillText("Time: " + timeLeft + "s", 10, 90); // Display the timer

    gameOver();
  }

  function gameLoop() {
    if (gameRunning) {
      moveFallingObjects();
      for (let obj of fallingObjects) {
        checkCollision(obj);
      }
    }
    draw(); // Always call draw, even if the game is not running
    requestAnimationFrame(gameLoop); // Continuously call gameLoop
  }

  // Start the game loop immediately
  gameLoop();
}; */
