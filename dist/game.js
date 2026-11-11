(function () {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const overlay = document.getElementById("gameOverlay");
  const overlayEyebrow = document.getElementById("overlayEyebrow");
  const overlayTitle = document.getElementById("overlayTitle");
  const overlayText = document.getElementById("overlayText");
  const controlGuide = document.getElementById("controlGuide");
  const primaryButton = document.getElementById("primaryButton");
  const weatherBadge = document.getElementById("weatherBadge");
  const messageToast = document.getElementById("messageToast");
  const stageValue = document.getElementById("stageValue");
  const coinValue = document.getElementById("coinValue");
  const lifeValue = document.getElementById("lifeValue");
  const progressDots = [...document.querySelectorAll(".progress-dot")];

  const WIDTH = 960;
  const HEIGHT = 540;
  const GRAVITY = 1750;
  const PLAYER_SPEED = 235;
  const JUMP_FORCE = 610;
  const MAX_LIVES = 2;
  const keys = new Set();
  const touch = { left: false, right: false };

  let audioContext = null;
  let state = "menu";
  let currentLevelIndex = 0;
  let currentLevel = null;
  let player = null;
  let cameraX = 0;
  let lives = MAX_LIVES;
  let totalCoins = 0;
  let levelCoins = [];
  let enemies = [];
  let particles = [];
  let jumpQueued = false;
  let lastTime = 0;
  let elapsed = 0;
  let toastTimer = 0;
  let flash = 0;
  let buttonAction = "start";

  const ground = (width) => ({ x: 0, y: 478, w: width, h: 80, kind: "ground" });
  const platform = (x, y, w, h = 28, kind = "earth") => ({ x, y, w, h, kind });
  const coinLine = (x, y, count, gap = 42) =>
    Array.from({ length: count }, (_, index) => ({ x: x + index * gap, y, collected: false }));

  const levels = [
    {
      name: "Rừng Nắng",
      badge: "☀ Rừng Nắng",
      weather: "sun",
      worldWidth: 2450,
      sky: ["#78d79a", "#b9e8a7"],
      spawn: { x: 90, y: 414 },
      platforms: [
        ground(2450),
        platform(340, 405, 170),
        platform(625, 350, 150),
        platform(910, 405, 190),
        platform(1230, 340, 180),
        platform(1540, 395, 170),
        platform(1830, 330, 185),
        platform(2140, 400, 140),
      ],
      coins: [
        ...coinLine(180, 425, 3),
        ...coinLine(380, 350, 3),
        ...coinLine(660, 295, 3),
        ...coinLine(960, 350, 4),
        ...coinLine(1270, 285, 3),
        ...coinLine(1580, 340, 3),
        ...coinLine(1870, 275, 3),
      ],
      enemies: [
        { type: "rat", x: 710, y: 450, range: 95, speed: 1.5 },
        { type: "rat", x: 1450, y: 450, range: 120, speed: 1.25, phase: 2 },
        { type: "rat", x: 1980, y: 450, range: 95, speed: 1.7, phase: 1 },
      ],
      goal: { x: 2320, y: 388, w: 54, h: 90 },
      intro: "Làm quen với khu rừng. Thu thập xu và nhảy qua những chú chuột tuần tra.",
    },
    {
      name: "Rừng Mưa",
      badge: "☂ Rừng Mưa",
      weather: "rain",
      worldWidth: 2650,
      sky: ["#5b9a91", "#8db3a2"],
      spawn: { x: 80, y: 414 },
      platforms: [
        ground(2650),
        platform(250, 390, 150),
        platform(520, 325, 165),
        platform(820, 395, 150),
        platform(1100, 315, 190),
        platform(1450, 385, 150),
        platform(1740, 305, 200),
        platform(2080, 380, 180),
        platform(2370, 320, 145),
      ],
      coins: [
        ...coinLine(285, 335, 3),
        ...coinLine(555, 270, 3),
        ...coinLine(845, 340, 3),
        ...coinLine(1140, 260, 4),
        ...coinLine(1490, 330, 3),
        ...coinLine(1790, 250, 4),
        ...coinLine(2110, 325, 4),
      ],
      enemies: [
        { type: "rat", x: 460, y: 450, range: 90, speed: 1.5 },
        { type: "snake", x: 920, y: 446, range: 70, speed: 1.1 },
        { type: "rat", x: 1530, y: 450, range: 100, speed: 1.4, phase: 1 },
        { type: "snake", x: 2020, y: 446, range: 85, speed: 1.2, phase: 2 },
      ],
      goal: { x: 2520, y: 388, w: 54, h: 90 },
      intro: "Cơn mưa làm khu rừng tối hơn. Rắn đã xuất hiện giữa những bụi cỏ.",
    },
    {
      name: "Rừng Bão",
      badge: "ϟ Rừng Bão",
      weather: "storm",
      worldWidth: 2850,
      sky: ["#365b60", "#627d78"],
      spawn: { x: 70, y: 414 },
      platforms: [
        ground(2850),
        platform(310, 375, 160),
        platform(610, 300, 150),
        platform(900, 390, 140),
        platform(1180, 305, 175),
        platform(1510, 385, 150),
        platform(1810, 285, 180),
        platform(2160, 380, 150),
        platform(2460, 300, 175),
      ],
      coins: [
        ...coinLine(345, 320, 3),
        ...coinLine(640, 245, 3),
        ...coinLine(925, 335, 3),
        ...coinLine(1215, 250, 4),
        ...coinLine(1545, 330, 3),
        ...coinLine(1845, 230, 4),
        ...coinLine(2190, 325, 3),
        ...coinLine(2495, 245, 3),
      ],
      enemies: [
        { type: "rat", x: 520, y: 450, range: 95, speed: 1.7 },
        { type: "snake", x: 1030, y: 446, range: 80, speed: 1.35 },
        { type: "snake", x: 1610, y: 446, range: 95, speed: 1.5, phase: 1 },
        { type: "rat", x: 2260, y: 450, range: 100, speed: 1.8, phase: 2 },
      ],
      goal: { x: 2720, y: 388, w: 54, h: 90 },
      intro: "Gió bão đẩy người anh hùng khi đang nhảy. Hãy canh thời điểm thật cẩn thận.",
    },
    {
      name: "Rừng Tuyết",
      badge: "❄ Rừng Tuyết",
      weather: "snow",
      worldWidth: 3050,
      sky: ["#87aeb3", "#d4e2d9"],
      spawn: { x: 70, y: 414 },
      platforms: [
        ground(3050),
        platform(260, 390, 155, 28, "snow"),
        platform(545, 315, 170, 28, "snow"),
        platform(860, 380, 150, 28, "snow"),
        platform(1150, 290, 190, 28, "snow"),
        platform(1500, 380, 165, 28, "snow"),
        platform(1830, 285, 190, 28, "snow"),
        platform(2180, 370, 160, 28, "snow"),
        platform(2490, 290, 190, 28, "snow"),
        platform(2790, 390, 130, 28, "snow"),
      ],
      coins: [
        ...coinLine(295, 335, 3),
        ...coinLine(585, 260, 3),
        ...coinLine(890, 325, 3),
        ...coinLine(1190, 235, 4),
        ...coinLine(1540, 325, 3),
        ...coinLine(1870, 230, 4),
        ...coinLine(2210, 315, 3),
        ...coinLine(2530, 235, 4),
      ],
      enemies: [
        { type: "snake", x: 460, y: 446, range: 75, speed: 1.2 },
        { type: "wisp", x: 890, y: 315, range: 85, speed: 1.5 },
        { type: "snake", x: 1450, y: 446, range: 85, speed: 1.35, phase: 2 },
        { type: "wisp", x: 1900, y: 250, range: 100, speed: 1.65, phase: 1 },
        { type: "wisp", x: 2560, y: 255, range: 85, speed: 1.8, phase: 3 },
      ],
      goal: { x: 2920, y: 388, w: 54, h: 90 },
      intro: "Tuyết khiến mặt đất trơn hơn. Lửa ma trơi bay lượn giữa những tầng cây lạnh giá.",
    },
    {
      name: "Hang Rồng",
      badge: "◆ Đường đến Hang Rồng",
      weather: "embers",
      worldWidth: 3350,
      sky: ["#365344", "#a0644d"],
      spawn: { x: 70, y: 414 },
      platforms: [
        ground(3350),
        platform(300, 380, 160),
        platform(610, 300, 165),
        platform(920, 390, 145),
        platform(1190, 285, 190),
        platform(1540, 380, 160),
        platform(1870, 290, 190),
        platform(2220, 375, 155),
        platform(2520, 285, 190),
        platform(2840, 375, 155),
      ],
      coins: [
        ...coinLine(335, 325, 3),
        ...coinLine(650, 245, 3),
        ...coinLine(945, 335, 3),
        ...coinLine(1235, 230, 4),
        ...coinLine(1580, 325, 3),
        ...coinLine(1910, 235, 4),
        ...coinLine(2250, 320, 3),
        ...coinLine(2560, 230, 4),
        ...coinLine(2880, 320, 3),
      ],
      enemies: [
        { type: "rat", x: 500, y: 450, range: 100, speed: 1.8 },
        { type: "snake", x: 1030, y: 446, range: 85, speed: 1.45 },
        { type: "wisp", x: 1260, y: 250, range: 90, speed: 1.7 },
        { type: "rat", x: 1710, y: 450, range: 105, speed: 2, phase: 2 },
        { type: "snake", x: 2180, y: 446, range: 90, speed: 1.6, phase: 1 },
        { type: "wisp", x: 2590, y: 245, range: 105, speed: 1.9, phase: 3 },
        { type: "wisp", x: 3000, y: 335, range: 80, speed: 2.1, phase: 1 },
      ],
      goal: { x: 3190, y: 382, w: 86, h: 96, princess: true },
      intro: "Công chúa đang ở phía trước. Vượt qua thử thách cuối cùng mà không cần đối đầu với rồng.",
    },
  ];

  function createPlayer(spawn) {
    return {
      x: spawn.x,
      y: spawn.y,
      w: 34,
      h: 48,
      vx: 0,
      vy: 0,
      grounded: false,
      facing: 1,
      invulnerable: 0,
      walkTime: 0,
    };
  }

  function cloneItems(items) {
    return items.map((item) => ({ ...item, baseX: item.x, baseY: item.y, phase: item.phase || 0 }));
  }

  function loadLevel(index, showIntro = true) {
    currentLevelIndex = index;
    currentLevel = levels[index];
    player = createPlayer(currentLevel.spawn);
    levelCoins = cloneItems(currentLevel.coins);
    enemies = cloneItems(currentLevel.enemies);
    cameraX = 0;
    particles = createWeatherParticles(currentLevel.weather);
    weatherBadge.textContent = currentLevel.badge;
    updateHud();

    if (showIntro) {
      showToast(currentLevel.intro, 3400);
    }
  }

  function startGame() {
    unlockAudio();
    lives = MAX_LIVES;
    totalCoins = 0;
    state = "playing";
    loadLevel(0);
    hideOverlay();
  }

  function showOverlay(config) {
    overlayEyebrow.textContent = config.eyebrow;
    overlayTitle.textContent = config.title;
    overlayText.textContent = config.text;
    primaryButton.textContent = config.button;
    controlGuide.hidden = config.hideControls === true;
    buttonAction = config.action;
    overlay.classList.add("visible");
  }

  function hideOverlay() {
    overlay.classList.remove("visible");
  }

  function finishLevel() {
    if (state !== "playing") return;
    playSound("finish");
    state = "levelComplete";

    if (currentLevelIndex === levels.length - 1) {
      const best = Math.max(Number(localStorage.getItem("herozx-best") || 0), totalCoins);
      localStorage.setItem("herozx-best", String(best));
      showOverlay({
        eyebrow: "CÔNG CHÚA ĐÃ AN TOÀN",
        title: "CHIẾN THẮNG!",
        text: `Hero-Zx đã hoàn thành hành trình với ${totalCoins} xu. Chàng nông dân đưa công chúa trở về mà không cần giao chiến với rồng.`,
        button: "Chơi lại từ đầu",
        action: "restart",
        hideControls: true,
      });
      state = "victory";
      return;
    }

    showOverlay({
      eyebrow: `HOÀN THÀNH ${currentLevel.name.toUpperCase()}`,
      title: `MÀN ${currentLevelIndex + 1} XONG!`,
      text: `Bạn đang có ${totalCoins} xu và ${lives} mạng. Thử thách tiếp theo sẽ khó hơn.`,
      button: `Sang màn ${currentLevelIndex + 2}`,
      action: "next",
      hideControls: true,
    });
  }

  function nextLevel() {
    state = "playing";
    loadLevel(currentLevelIndex + 1);
    hideOverlay();
  }

  function hitPlayer(reason) {
    if (player.invulnerable > 0 || state !== "playing") return;
    lives -= 1;
    playSound("hurt");
    flash = 0.32;
    updateHud();

    if (lives <= 0) {
      state = "gameOver";
      showOverlay({
        eyebrow: reason === "fall" ? "RƠI KHỎI ĐƯỜNG MÒN" : "BỊ QUÁI PHÁT HIỆN",
        title: "HẾT MẠNG",
        text: `Bạn đã thu thập được ${totalCoins} xu. Hãy thử lại và chọn đường đi an toàn hơn.`,
        button: "Thử lại từ đầu",
        action: "restart",
        hideControls: true,
      });
      return;
    }

    player = createPlayer(currentLevel.spawn);
    player.invulnerable = 1.8;
    cameraX = Math.max(0, player.x - WIDTH * 0.35);
    showToast("Còn 1 mạng — cẩn thận hơn nhé!", 1900);
  }

  function updateHud() {
    stageValue.textContent = `${currentLevelIndex + 1}/5`;
    coinValue.textContent = String(totalCoins);
    lifeValue.textContent = "♥".repeat(lives) + "♡".repeat(MAX_LIVES - lives);
    progressDots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentLevelIndex);
      dot.classList.toggle("done", index < currentLevelIndex);
    });
  }

  function showToast(message, duration = 1800) {
    messageToast.textContent = message;
    messageToast.classList.add("show");
    toastTimer = duration / 1000;
  }

  function rectsIntersect(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function enemyRect(enemy) {
    if (enemy.type === "wisp") return { x: enemy.x - 15, y: enemy.y - 18, w: 30, h: 36 };
    if (enemy.type === "snake") return { x: enemy.x - 17, y: enemy.y - 30, w: 34, h: 30 };
    return { x: enemy.x - 18, y: enemy.y - 27, w: 36, h: 27 };
  }

  function update(dt) {
    elapsed += dt;
    if (toastTimer > 0) {
      toastTimer -= dt;
      if (toastTimer <= 0) messageToast.classList.remove("show");
    }
    flash = Math.max(0, flash - dt);

    updateWeather(dt);
    if (state !== "playing") return;

    const moveLeft = keys.has("ArrowLeft") || keys.has("KeyA") || touch.left;
    const moveRight = keys.has("ArrowRight") || keys.has("KeyD") || touch.right;
    const direction = Number(moveRight) - Number(moveLeft);
    const acceleration = player.grounded && currentLevel.weather === "snow" ? 760 : 1800;
    const friction = player.grounded && currentLevel.weather === "snow" ? 360 : 1900;

    if (direction !== 0) {
      player.vx += direction * acceleration * dt;
      player.vx = Math.max(-PLAYER_SPEED, Math.min(PLAYER_SPEED, player.vx));
      player.facing = direction;
      player.walkTime += dt * Math.abs(player.vx) * 0.035;
    } else {
      const amount = friction * dt;
      if (Math.abs(player.vx) <= amount) player.vx = 0;
      else player.vx -= Math.sign(player.vx) * amount;
    }

    if (jumpQueued) {
      if (player.grounded) {
        player.vy = -JUMP_FORCE;
        player.grounded = false;
        playSound("jump");
      }
      jumpQueued = false;
    }

    if (currentLevel.weather === "storm" && !player.grounded) {
      player.vx += (58 + Math.sin(elapsed * 1.7) * 42) * dt;
    }

    player.vy += GRAVITY * dt;
    player.vy = Math.min(player.vy, 950);
    movePlayerX(dt);
    movePlayerY(dt);
    player.x = Math.max(0, Math.min(currentLevel.worldWidth - player.w, player.x));
    player.invulnerable = Math.max(0, player.invulnerable - dt);

    updateEnemies();
    collectCoins();

    const playerRect = { x: player.x + 4, y: player.y + 3, w: player.w - 8, h: player.h - 4 };
    for (const enemy of enemies) {
      if (rectsIntersect(playerRect, enemyRect(enemy))) {
        hitPlayer("enemy");
        break;
      }
    }

    if (player.y > HEIGHT + 140) hitPlayer("fall");
    if (rectsIntersect(playerRect, currentLevel.goal)) finishLevel();

    const targetCamera = Math.max(0, Math.min(currentLevel.worldWidth - WIDTH, player.x - WIDTH * 0.36));
    cameraX += (targetCamera - cameraX) * Math.min(1, dt * 5.5);
  }

  function movePlayerX(dt) {
    player.x += player.vx * dt;
    for (const block of currentLevel.platforms) {
      if (!rectsIntersect(player, block)) continue;
      if (player.vx > 0) player.x = block.x - player.w;
      else if (player.vx < 0) player.x = block.x + block.w;
      player.vx = 0;
    }
  }

  function movePlayerY(dt) {
    const previousBottom = player.y + player.h;
    const previousTop = player.y;
    player.y += player.vy * dt;
    player.grounded = false;

    for (const block of currentLevel.platforms) {
      if (!rectsIntersect(player, block)) continue;
      if (player.vy >= 0 && previousBottom <= block.y + 8) {
        player.y = block.y - player.h;
        player.vy = 0;
        player.grounded = true;
      } else if (player.vy < 0 && previousTop >= block.y + block.h - 8) {
        player.y = block.y + block.h;
        player.vy = 0;
      }
    }
  }

  function updateEnemies() {
    for (const enemy of enemies) {
      if (enemy.type === "rat") {
        enemy.x = enemy.baseX + Math.sin(elapsed * enemy.speed + enemy.phase) * enemy.range;
      } else if (enemy.type === "snake") {
        const lunge = Math.max(0, Math.sin(elapsed * enemy.speed + enemy.phase));
        enemy.x = enemy.baseX + lunge * enemy.range;
      } else {
        enemy.x = enemy.baseX + Math.sin(elapsed * enemy.speed + enemy.phase) * enemy.range;
        enemy.y = enemy.baseY + Math.sin(elapsed * enemy.speed * 1.7 + enemy.phase) * 24;
      }
    }
  }

  function collectCoins() {
    for (const coin of levelCoins) {
      if (coin.collected) continue;
      const coinBox = { x: coin.x - 11, y: coin.y - 11, w: 22, h: 22 };
      if (rectsIntersect(player, coinBox)) {
        coin.collected = true;
        totalCoins += 1;
        playSound("coin");
        updateHud();
      }
    }
  }

  function createWeatherParticles(weather) {
    const count = weather === "rain" || weather === "storm" ? 100 : weather === "snow" ? 75 : 45;
    return Array.from({ length: count }, () => ({
      x: Math.random() * WIDTH,
      y: Math.random() * HEIGHT,
      speed: 45 + Math.random() * 240,
      size: 1 + Math.random() * 4,
      drift: -25 + Math.random() * 50,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function updateWeather(dt) {
    if (!currentLevel) return;
    for (const particle of particles) {
      if (currentLevel.weather === "rain" || currentLevel.weather === "storm") {
        particle.y += particle.speed * dt;
        particle.x -= (currentLevel.weather === "storm" ? 95 : 35) * dt;
      } else if (currentLevel.weather === "snow") {
        particle.y += particle.speed * 0.2 * dt;
        particle.x += Math.sin(elapsed + particle.phase) * 18 * dt;
      } else if (currentLevel.weather === "embers") {
        particle.y -= particle.speed * 0.13 * dt;
        particle.x += Math.sin(elapsed * 1.5 + particle.phase) * 13 * dt;
      } else {
        particle.y += particle.speed * 0.08 * dt;
        particle.x += Math.sin(elapsed + particle.phase) * 9 * dt;
      }

      if (particle.y > HEIGHT + 20) particle.y = -20;
      if (particle.y < -25) particle.y = HEIGHT + 20;
      if (particle.x < -30) particle.x = WIDTH + 30;
      if (particle.x > WIDTH + 30) particle.x = -30;
    }
  }

  function render() {
    if (!currentLevel) {
      currentLevel = levels[0];
      particles = createWeatherParticles(currentLevel.weather);
    }

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.imageSmoothingEnabled = false;
    drawBackground();
    drawWorld();
    drawWeather();

    if (flash > 0) {
      ctx.fillStyle = `rgba(255, 235, 210, ${Math.min(0.5, flash * 1.5)})`;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }
  }

  function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    gradient.addColorStop(0, currentLevel.sky[0]);
    gradient.addColorStop(1, currentLevel.sky[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    if (currentLevel.weather === "sun") {
      ctx.fillStyle = "rgba(255, 239, 132, 0.7)";
      ctx.fillRect(770, 68, 62, 62);
      ctx.fillStyle = "rgba(255, 247, 173, 0.45)";
      ctx.fillRect(758, 56, 86, 86);
    }

    drawMountainLayer(0.08, 300, "#436f63", 95);
    drawMountainLayer(0.16, 360, "#315e53", 76);
    drawTreeLayer(0.27, 380, "#245247", 94);
    drawTreeLayer(0.48, 430, "#173f39", 72);

    if (currentLevel.weather === "embers") {
      ctx.fillStyle = "rgba(118, 47, 35, 0.18)";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }
  }

  function drawMountainLayer(factor, baseY, color, width) {
    const offset = -((cameraX * factor) % width);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, HEIGHT);
    ctx.lineTo(0, baseY);
    for (let x = offset - width; x < WIDTH + width; x += width) {
      ctx.lineTo(x + width * 0.5, baseY - 95 - ((x / width) % 3) * 11);
      ctx.lineTo(x + width, baseY);
    }
    ctx.lineTo(WIDTH, HEIGHT);
    ctx.closePath();
    ctx.fill();
  }

  function drawTreeLayer(factor, baseY, color, spacing) {
    const offset = -((cameraX * factor) % spacing);
    ctx.fillStyle = color;
    for (let x = offset - spacing; x < WIDTH + spacing; x += spacing) {
      const sway = ((Math.floor((x + cameraX * factor) / spacing) % 3) + 3) % 3;
      ctx.fillRect(x + 34, baseY - 78 - sway * 12, 15, 90 + sway * 12);
      ctx.fillRect(x + 12, baseY - 105 - sway * 12, 60, 40);
      ctx.fillRect(x + 21, baseY - 130 - sway * 12, 42, 40);
    }
  }

  function drawWorld() {
    ctx.save();
    ctx.translate(-Math.round(cameraX), 0);

    for (const block of currentLevel.platforms) drawPlatform(block);
    drawGoal(currentLevel.goal);
    for (const coin of levelCoins) if (!coin.collected) drawCoin(coin);
    for (const enemy of enemies) drawEnemy(enemy);

    if (player && (player.invulnerable <= 0 || Math.floor(elapsed * 12) % 2 === 0)) {
      drawHero(player);
    }

    ctx.restore();
  }

  function drawPlatform(block) {
    const isSnow = currentLevel.weather === "snow" || block.kind === "snow";
    const topColor = isSnow ? "#edf6e5" : "#67cf4f";
    const edgeColor = isSnow ? "#b6d3cf" : "#2a7b3f";
    const soilColor = currentLevel.weather === "embers" ? "#6d4938" : "#76523b";

    ctx.fillStyle = "#102d28";
    ctx.fillRect(block.x - 3, block.y - 3, block.w + 6, block.h + 6);
    ctx.fillStyle = soilColor;
    ctx.fillRect(block.x, block.y, block.w, block.h);
    ctx.fillStyle = topColor;
    ctx.fillRect(block.x, block.y, block.w, 9);
    ctx.fillStyle = edgeColor;
    ctx.fillRect(block.x, block.y + 9, block.w, 4);

    for (let x = block.x + 18; x < block.x + block.w - 8; x += 42) {
      ctx.fillStyle = "rgba(39, 28, 25, 0.26)";
      ctx.fillRect(x, block.y + 20, 14, 5);
      if (block.h > 35) ctx.fillRect(x + 12, block.y + 42, 8, 5);
    }
  }

  function drawCoin(coin) {
    const bob = Math.sin(elapsed * 5 + coin.x * 0.03) * 4;
    const x = Math.round(coin.x);
    const y = Math.round(coin.y + bob);
    ctx.fillStyle = "#4f3a14";
    ctx.fillRect(x - 10, y - 13, 20, 26);
    ctx.fillStyle = "#ffcc35";
    ctx.fillRect(x - 7, y - 10, 14, 20);
    ctx.fillStyle = "#fff08a";
    ctx.fillRect(x - 4, y - 7, 4, 12);
    ctx.fillStyle = "#c58324";
    ctx.fillRect(x + 3, y - 5, 3, 13);
  }

  function drawGoal(goal) {
    if (goal.princess) {
      ctx.fillStyle = "#251b24";
      ctx.fillRect(goal.x - 18, 266, 126, 212);
      ctx.fillStyle = "#513331";
      ctx.fillRect(goal.x - 10, 278, 110, 200);
      ctx.fillStyle = "#151717";
      ctx.fillRect(goal.x + 12, 318, 66, 160);
      drawPrincess(goal.x + 44, 430);
      return;
    }

    ctx.fillStyle = "#182a27";
    ctx.fillRect(goal.x, goal.y, 9, goal.h);
    ctx.fillStyle = "#e3b73f";
    ctx.fillRect(goal.x + 9, goal.y + 7, 44, 28);
    ctx.fillStyle = "#fff0a5";
    ctx.fillRect(goal.x + 15, goal.y + 12, 17, 6);
    ctx.fillStyle = "#4b9d52";
    ctx.fillRect(goal.x + 16, goal.y + 22, 28, 7);
  }

  function drawPrincess(x, feetY) {
    ctx.fillStyle = "#241b25";
    ctx.fillRect(x - 16, feetY - 62, 32, 58);
    ctx.fillStyle = "#f5c89b";
    ctx.fillRect(x - 11, feetY - 55, 22, 19);
    ctx.fillStyle = "#f3cc49";
    ctx.fillRect(x - 13, feetY - 67, 26, 12);
    ctx.fillStyle = "#cf5b79";
    ctx.fillRect(x - 15, feetY - 36, 30, 32);
    ctx.fillStyle = "#f6a7bb";
    ctx.fillRect(x - 8, feetY - 32, 16, 24);
    ctx.fillStyle = "#26342d";
    ctx.fillRect(x - 14, feetY - 4, 11, 5);
    ctx.fillRect(x + 3, feetY - 4, 11, 5);
  }

  function drawHero(hero) {
    const x = Math.round(hero.x);
    const y = Math.round(hero.y);
    const step = hero.grounded && Math.abs(hero.vx) > 20 ? Math.round(Math.sin(hero.walkTime) * 3) : 0;

    ctx.fillStyle = "#102725";
    ctx.fillRect(x + 6, y + 10, 25, 25);
    ctx.fillRect(x + 8, y + 33, 22, 12);
    ctx.fillStyle = "#f1c39d";
    ctx.fillRect(x + 9, y + 12, 19, 16);
    ctx.fillStyle = "#263b35";
    ctx.fillRect(x + (hero.facing > 0 ? 22 : 12), y + 18, 4, 4);

    ctx.fillStyle = "#149b9a";
    ctx.fillRect(x + 4, y + 5, 28, 9);
    ctx.fillRect(x + 8, y, 21, 7);
    ctx.fillStyle = "#63e4d2";
    ctx.fillRect(x + 9, y + 3, 16, 3);

    ctx.fillStyle = "#087a76";
    ctx.fillRect(x + 4, y + 28, 27, 15);
    ctx.fillStyle = "#4ed9c3";
    ctx.fillRect(x + (hero.facing > 0 ? 3 : 23), y + 29, 10, 5);
    ctx.fillRect(x + (hero.facing > 0 ? 0 : 28), y + 33, 9, 4);

    ctx.fillStyle = "#49392e";
    ctx.fillRect(x + 8, y + 42, 8, 6 + step);
    ctx.fillRect(x + 20, y + 42, 8, 6 - step);
    ctx.fillStyle = "#1a2724";
    ctx.fillRect(x + 5, y + 46 + step, 12, 3);
    ctx.fillRect(x + 18, y + 46 - step, 12, 3);

    const shieldX = hero.facing > 0 ? x + 24 : x - 5;
    ctx.fillStyle = "#1c2825";
    ctx.fillRect(shieldX, y + 25, 16, 18);
    ctx.fillStyle = "#9b6b36";
    ctx.fillRect(shieldX + 2, y + 27, 12, 14);
    ctx.fillStyle = "#d1a45d";
    ctx.fillRect(shieldX + 6, y + 29, 4, 10);
    ctx.fillStyle = "#5c3b24";
    ctx.fillRect(shieldX + 4, y + 32, 8, 4);
  }

  function drawEnemy(enemy) {
    const x = Math.round(enemy.x);
    const y = Math.round(enemy.y);

    if (enemy.type === "rat") {
      ctx.fillStyle = "#182421";
      ctx.fillRect(x - 18, y - 22, 34, 22);
      ctx.fillStyle = "#747469";
      ctx.fillRect(x - 15, y - 19, 29, 16);
      ctx.fillRect(x + 9, y - 25, 8, 9);
      ctx.fillStyle = "#d88b8e";
      ctx.fillRect(x + 11, y - 23, 4, 4);
      ctx.fillStyle = "#ffdf65";
      ctx.fillRect(x + 8, y - 15, 4, 4);
      ctx.fillStyle = "#c8b9a6";
      ctx.fillRect(x + 14, y - 9, 8, 4);
      ctx.strokeStyle = "#82675b";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x - 14, y - 7);
      ctx.quadraticCurveTo(x - 30, y - 18, x - 29, y - 3);
      ctx.stroke();
      return;
    }

    if (enemy.type === "snake") {
      ctx.fillStyle = "#14291f";
      ctx.fillRect(x - 16, y - 13, 32, 13);
      ctx.fillRect(x + 2, y - 27, 18, 18);
      ctx.fillStyle = "#57b94d";
      ctx.fillRect(x - 13, y - 10, 25, 7);
      ctx.fillRect(x + 5, y - 24, 12, 13);
      ctx.fillStyle = "#dcef62";
      ctx.fillRect(x + 12, y - 21, 3, 4);
      ctx.fillStyle = "#e95f5d";
      ctx.fillRect(x + 18, y - 14, 7, 2);
      return;
    }

    const pulse = Math.round(Math.sin(elapsed * 7 + enemy.phase) * 3);
    ctx.fillStyle = "rgba(86, 242, 220, 0.25)";
    ctx.fillRect(x - 18 - pulse, y - 22 - pulse, 36 + pulse * 2, 43 + pulse * 2);
    ctx.fillStyle = "#193333";
    ctx.fillRect(x - 12, y - 17, 24, 31);
    ctx.fillStyle = "#38d8c2";
    ctx.fillRect(x - 9, y - 15, 18, 25);
    ctx.fillStyle = "#b0ffb8";
    ctx.fillRect(x - 5, y - 12, 10, 16);
    ctx.fillStyle = "#173535";
    ctx.fillRect(x - 5, y - 4, 3, 4);
    ctx.fillRect(x + 3, y - 4, 3, 4);
  }

  function drawWeather() {
    if (currentLevel.weather === "storm" && Math.sin(elapsed * 2.1) > 0.985) {
      ctx.fillStyle = "rgba(255,255,235,0.7)";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }

    for (const particle of particles) {
      if (currentLevel.weather === "rain" || currentLevel.weather === "storm") {
        ctx.strokeStyle = currentLevel.weather === "storm" ? "rgba(210,235,240,0.65)" : "rgba(207,235,231,0.5)";
        ctx.lineWidth = particle.size * 0.55;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(particle.x - (currentLevel.weather === "storm" ? 12 : 6), particle.y + 19);
        ctx.stroke();
      } else if (currentLevel.weather === "snow") {
        ctx.fillStyle = "rgba(250,255,248,0.82)";
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
      } else if (currentLevel.weather === "embers") {
        ctx.fillStyle = "rgba(255,142,65,0.72)";
        ctx.fillRect(particle.x, particle.y, Math.max(2, particle.size * 0.7), Math.max(2, particle.size * 0.7));
      } else {
        ctx.fillStyle = "rgba(229,255,151,0.35)";
        ctx.fillRect(particle.x, particle.y, 2, 5);
      }
    }
  }

  function unlockAudio() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audioContext = new AudioCtx();
    }
    if (audioContext?.state === "suspended") audioContext.resume();
  }

  function playSound(type) {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;
    const settings = {
      jump: [260, 410, 0.11, "square"],
      coin: [680, 920, 0.12, "square"],
      hurt: [170, 85, 0.24, "sawtooth"],
      finish: [420, 760, 0.35, "triangle"],
    }[type];
    if (!settings) return;
    oscillator.type = settings[3];
    oscillator.frequency.setValueAtTime(settings[0], now);
    oscillator.frequency.exponentialRampToValueAtTime(settings[1], now + settings[2]);
    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + settings[2]);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + settings[2]);
  }

  function requestJump() {
    jumpQueued = true;
  }

  function handleKeyDown(event) {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "Space"].includes(event.code)) event.preventDefault();
    keys.add(event.code);
    if (!event.repeat && ["Space", "ArrowUp", "KeyW"].includes(event.code)) requestJump();
  }

  function handleKeyUp(event) {
    keys.delete(event.code);
  }

  function bindTouchControls() {
    document.querySelectorAll(".control-button").forEach((button) => {
      const action = button.dataset.action;
      const press = (event) => {
        event.preventDefault();
        unlockAudio();
        button.classList.add("pressed");
        if (action === "jump") requestJump();
        else touch[action] = true;
      };
      const release = (event) => {
        event.preventDefault();
        button.classList.remove("pressed");
        if (action !== "jump") touch[action] = false;
      };
      button.addEventListener("pointerdown", press);
      button.addEventListener("pointerup", release);
      button.addEventListener("pointercancel", release);
      button.addEventListener("pointerleave", release);
    });
  }

  function gameLoop(timestamp) {
    const dt = Math.min(0.034, (timestamp - lastTime) / 1000 || 0);
    lastTime = timestamp;
    update(dt);
    render();
    requestAnimationFrame(gameLoop);
  }

  primaryButton.addEventListener("click", () => {
    if (buttonAction === "start" || buttonAction === "restart") startGame();
    else if (buttonAction === "next") nextLevel();
  });

  window.addEventListener("keydown", handleKeyDown, { passive: false });
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener("blur", () => {
    keys.clear();
    touch.left = false;
    touch.right = false;
  });

  bindTouchControls();
  loadLevel(0, false);
  state = "menu";
  requestAnimationFrame(gameLoop);
})();
