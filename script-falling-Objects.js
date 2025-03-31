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
  let timeLeft = 60;

  function onClick() {
    gameRunning = true;
    startTheGame.style.display = "none";
    gameLoop(gameRunning);
    timer();
  }

  console.log("Game started:", gameRunning);

  ctx.fillStyle = "black";
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
      type: getType(),
    };
  }

  function getType() {
    let numType = Math.floor(1 + Math.random() * 100);
    if (numType > 90) {
      return "Power-up";
    } else if (numType < 10) {
      return "Obstacle";
    } else {
      return "Normal";
    }
  }
  function getEffect(type) {
    if (type === "Power-up") {
      return 10;
    } else if (type === "Obstacle") {
      return -10;
    } else {
      return 0;
    }
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
      bigObjects(obj);
      const effect = getEffect(obj.type);
      score += effect;
      fallingObjects.splice(fallingObjects.indexOf(obj), 1);
    } else if (obj.y >= canvas.height) {
      missed++;
      fallingObjects.splice(fallingObjects.indexOf(obj), 1);
    }
  }

  function bigObjects(obj) {
    if (obj.radius > 18) {
      score += 2;
    } else {
      score += 1;
    }
  }

  /*   fallingObjects.filter((obj) => {
    if (checkCollision(obj)) {
      bigObjects(obj);
      return false;
    }
    return true;
  });  */

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

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Spieler zeichnen
    ctx.fillStyle = "green";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Fallende Objekte zeichnen
    /*  console.log("Falling objects in draw:", fallingObjects); */
    for (let obj of fallingObjects) {
      /*  console.log("Drawing object:", obj); */

      ctx.fillStyle = obj.color;
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();

      ctx.fillStyle = "white";
      ctx.font = "bold 15px serif";
      ctx.textAlign = "left";
      ctx.fillText(obj.type, obj.x - 20, obj.y - 20);
    }

    // Punktzahl anzeigen
    ctx.fillStyle = "white";
    ctx.font = "bold 17px serif";
    ctx.fillText("Punkte: " + score, 10, 30);
    ctx.fillText("Missed:" + missed, 10, 60);
    ctx.fillStyle = "green";
    ctx.fillText("Time: " + timeLeft + "s", 10, 90);
    gameOver();
  }

  function gameLoop(value) {
    /* console.log("game running", gameRunning); */
    if (value) {
      moveFallingObjects();

      for (let obj of fallingObjects) {
        checkCollision(obj);
      }
      draw();

      getType();
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

  setInterval(() => {
    timer();
  }, 1000);

  /* setInterval(() => {
    gameLoop(false);
    }, 20000); */
};
