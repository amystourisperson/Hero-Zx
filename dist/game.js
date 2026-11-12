(function () {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const gameCard = document.getElementById("gameCard");
  const weddingHeading = document.getElementById("weddingHeading");
  const weddingReplay = document.getElementById("weddingReplay");
  const overlay = document.getElementById("gameOverlay");
  const overlayEyebrow = document.getElementById("overlayEyebrow");
  const overlayTitle = document.getElementById("overlayTitle");
  const overlayText = document.getElementById("overlayText");
  const controlGuide = document.getElementById("controlGuide");
  const primaryButton = document.getElementById("primaryButton");
  const weatherBadge = document.getElementById("weatherBadge");
  const messageToast = document.getElementById("messageToast");
  const chatButton = document.getElementById("chatButton");
  const chatDialog = document.getElementById("chatDialog");
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const heroSpeech = document.getElementById("heroSpeech");
  const petSpeech = document.getElementById("petSpeech");
  const stageValue = document.getElementById("stageValue");
  const coinValue = document.getElementById("coinValue");
  const lifeValue = document.getElementById("lifeValue");
  const shopButton = document.getElementById("shopButton");
  const shopDialog = document.getElementById("shopDialog");
  const shopBalance = document.getElementById("shopBalance");
  const shopItems = [...shopDialog.querySelectorAll("[data-item]")];
  const battleControls = document.getElementById("battleControls");
  const battleButtons = [...battleControls.querySelectorAll("[data-weapon]")];
  const bossHud = document.getElementById("bossHud");
  const bossHealth = document.getElementById("bossHealth");
  const bossName = document.getElementById("bossName");
  const dragonDialogue = document.getElementById("dragonDialogue");
  const dialogueSpeaker = document.getElementById("dialogueSpeaker");
  const dialogueAction = document.getElementById("dialogueAction");
  const dialogueLine = document.getElementById("dialogueLine");
  const dialogueStep = document.getElementById("dialogueStep");
  const dialogueNext = document.getElementById("dialogueNext");
  const petDialogue = document.getElementById("petDialogue");
  const petSpeaker = document.getElementById("petSpeaker");
  const petLine = document.getElementById("petLine");
  const petStep = document.getElementById("petStep");
  const petNext = document.getElementById("petNext");
  const mathDialog = document.getElementById("mathDialog");
  const mathForm = document.getElementById("mathForm");
  const mathPrompt = document.getElementById("mathPrompt");
  const mathAnswer = document.getElementById("mathAnswer");
  const progressTrack = document.querySelector(".progress-track");

  const WIDTH = 960;
  const HEIGHT = 540;
  const GROUND_Y = 478;
  const HERO_HEIGHT = 48;
  const WEDDING_FLOOR_Y = 416;
  const PET_ARRIVAL = 3.3;
  const GRAVITY = 1750;
  const PLAYER_SPEED = 235;
  const JUMP_FORCE = 665;
  const MAX_LIVES = 5;
  const HAZARD_WARNING_DISTANCE = 240;
  const seasonWeather = {
    sun: {
      count: 45, fall: 0.08, drift: 0, sway: 9,
      forest: ["#436f63", "#315e53", "#245247", "#173f39"],
      particles: ["rgba(229,255,151,0.35)"],
    },
    spring: {
      count: 54, fall: 0.13, drift: 14, sway: 22,
      forest: ["#dbacc9", "#b481a4", "#a35f88", "#8a456f"],
      particles: ["#ffe7ef", "#ffc7dc", "#f997bf"],
    },
    summer: {
      count: 25, fall: -0.06, drift: 6, sway: 16,
      forest: ["#83a36e", "#59844f", "#386a40", "#214e37"],
      particles: ["#ffe5a880", "#fff3ce85"],
    },
    autumn: {
      count: 78, fall: 0.24, drift: 115, sway: 40,
      forest: ["#c58a6f", "#a56e57", "#ba6241", "#8b452e"],
      particles: ["#ffb648", "#f28331", "#d95336", "#ffd580"],
    },
    winter: {
      count: 82, fall: 0.2, drift: -12, sway: 18,
      forest: ["#849eae", "#5c7c91", "#416b7d", "#2c4c65"],
      particles: ["#fbfffe", "#d2edf5", "#f3fbff"],
    },
    night: {
      count: 24, fall: -0.03, drift: 4, sway: 14,
      forest: ["#33446a", "#263653", "#203150", "#172541"],
      particles: ["#95b3eb70", "#b7d9ef80"],
    },
    rain: {
      count: 125, fall: 2.3, drift: -90, sway: 12,
      particles: ["#aecfe980", "#c8e6ff9c", "#88b5d56b"],
    },
  };
  const TRAPDOOR_SPIKE_Y = 515;
  const shopPrices = { life: 20, shield: 12, freeze: 16 };
  const SHIELD_DURATION = 1.5;
  const FREEZE_DURATION = 3;
  const PET_SHIELD_DURATION = 3;
  const PET_WARNING_LEAD = 1.2;
  const MAP_SWING_DURATION = 0.36;
  const PET_CAGE_LEVEL = 1;
  const PET_CAGE_X = 1390;
  const PET_CAGE_Y = 174;
  const petConversation = [
    ["Pet", "Có ai không...? Làm ơn đưa tôi ra khỏi đây với..."],
    ["Hero", "Bình tĩnh nào, ta sẽ đưa ngươi ra. Từ giờ ngươi được tự do rồi!"],
    ["Pet", "Ngài đã cứu tôi... Tôi không biết phải cảm ơn thế nào. Nếu ngài không chê, hãy để tôi đi theo và bảo vệ ngài nhé!"],
  ];
  const redDragonColors = {
    outline: "#321b2a", wing: "#a92339", wingLight: "#e04b46", tail: "#c4343c",
    body: "#db3c40", belly: "#ffb078", horn: "#f6d4a1", eye: "#ffdf77", foot: "#ff765d",
  };
  const whiteDragonColors = {
    outline: "#39536e", wing: "#a5c9e1", wingLight: "#e6f7ff", tail: "#c9e2ee",
    body: "#ffffff", belly: "#d8f3ff", horn: "#b4e5ff", eye: "#42baff", foot: "#daeaf5",
  };
  const DRAGON_HP = 100;
  const ENRAGED_DRAGON_HP = 80;
  const DRAGON_CLOAK_DURATION = 0.5;
  const ENRAGED_FIRE_SPEED = 250;
  const ENRAGED_FIRE_SPREAD = 210;
  const ENRAGED_FIRE_MIN_DISTANCE = 180;
  const weapons = {
    dart: { name: "Phi tiêu", damage: 12, cooldown: 0.35, speed: 620, duration: 0.8, color: "#b8f7e9" },
    sword: { name: "Kiếm", damage: 30, cooldown: 0.55, range: 108, color: "#e1f4ff" },
    bow: { name: "Cung", damage: 20, cooldown: 0.66, speed: 710, duration: 1.2, color: "#ffdc92" },
  };
  const weaponKeys = { Digit1: "dart", Digit2: "sword", Digit3: "bow" };
  const dragonPact = [
    ["Hero", "hạ kiếm, thở dốc", "Ngươi đã bại trận. Ta sẽ lấy đầu ngươi về kinh thành để hoàn thành sứ mệnh cứu công chúa."],
    ["Rồng", "thở ra luồng khói yếu ớt, mắt nhìn thẳng vào chàng", "Thân xác này đã chết, nhưng ta không khuất phục trước lưỡi kiếm. Ta khuất phục trước ý chí của ngươi."],
    ["Hero", "nhíu mày nghi hoặc", "Ngươi định giở trò gì trước khi chết?"],
    ["Rồng", "khẽ cúi đầu", "Ngàn năm qua chỉ có ngươi đủ bản lĩnh đánh bại ta. Hãy lập khế ước, ta nguyện hóa linh hồn đi theo phục vụ ngươi."],
    ["Hero", "bất ngờ, mũi kiếm khẽ hạ xuống", "Chúa tể bầu trời lại chấp nhận làm thuộc hạ cho một kẻ phàm trần sao?"],
    ["Rồng", "bật cười trầm đục", "Đi theo kẻ mạnh hơn mình là vinh dự. Hãy nhận lấy sức mạnh của ta, cứu công chúa và cùng ta rời khỏi vương quốc dối trá này."],
    ["Hero", "tra kiếm vào vỏ, đưa tay về phía trước", "Được, ta chấp nhận lời thề của ngươi. Từ nay, ngươi là đôi cánh của ta."],
  ];
  const hazardWarnings = {
    spikes: [
      "Cẩn thận, có gai! Đôi ủng của Hero xin phép bay qua.",
      "Gai đang chờ dưới đất. Nhấc chân lên nào, Hero!",
      "Đường tắt qua bãi gai à? Có đấy, ở ngay trên không!",
    ],
    trap: [
      "Bẫy gai phía trước! Đợi gai rút rồi hẵng chạy qua.",
      "Đất đang chơi ú òa với gai. Canh lúc nó trốn nhé!",
      "Bẫy gai đang tập nhảy. Chờ nó đáp xuống rồi tới lượt Hero!",
    ],
    water: [
      "Có sông phía trước! Nhảy qua đá kẻo đôi ủng uống no nước.",
      "Đá là đường đi, sông là chỗ cá ở. Nhảy đúng nhà nhé!",
      "Sông mời Hero đi bơi. Cứ từ chối lịch sự bằng một cú nhảy!",
    ],
    crevasse: [
      "Khe băng phía trước! Nhảy từng bậc, kẻo Hero trượt patin.",
      "Băng trơn lắm! Lấy đà vừa đủ rồi nhắm vào bậc kế tiếp.",
      "Cẩn thận khe băng! Đôi ủng này chưa có bằng lái trên tuyết.",
    ],
    lava: [
      "Có dung nham! Hôm nay Hero chưa định nướng ủng đâu.",
      "Dung nham đang sôi. Nhắm tảng đá rồi nhảy qua nhé!",
      "Bếp lửa của rồng ở ngay trước mặt. Đi qua đá cho mát chân!",
    ],
    trapdoor: [
      "Nắp gỗ phía trước hơi đáng ngờ. Nhảy qua cho chắc nhé!",
      "Có tiếng cót két dưới tấm ván. Đừng thử độ bền bằng đôi ủng!",
      "Gỗ ở trên, gai ở dưới. Hero đi đường trên không nhé!",
    ],
    steam: [
      "Đá sắp phì hơi nóng! Nhảy qua lúc nó nghỉ lấy hơi.",
      "Có ấm nước khổng lồ dưới đất à? Canh nhịp rồi nhảy nhé!",
      "Luồng hơi trước mặt hơi nóng tính. Chờ nó dịu rồi đi!",
    ],
    flame: [
      "Miệng bẫy đỏ lên rồi! Chờ lửa tắt hoặc nhảy qua lúc an toàn.",
      "Bẫy sắp phun lửa. Canh nhịp, đừng đứng trên miệng phun nhé!",
    ],
    swamp: [
      "Đầm lầy phía trước làm chậm bước chân. Có quái gần đó, hãy nhảy qua!",
      "Bùn níu chân Hero! Nhảy lên để thoát lầy và né quái nhé!",
    ],
    arrow: [
      "Ô đá sáng lên là tên sắp bắn từ dưới đất. Chờ tên bay qua nhé!",
      "Mũi tên phóng thẳng lên trời. Canh nhịp rồi bước qua!",
    ],
    fallingRock: [
      "Đá sắp rơi ở vạch vàng. Đợi nó chạm đất rồi đi tiếp!",
      "Nhìn lên một chút, Hero! Viên đá đang chuẩn bị rơi.",
    ],
  };
  const keys = new Set();
  const touch = { left: false, right: false };
  const warnedHazards = new Set();
  const openTrapdoors = new Set();
  const nextWarningByKind = new Map();

  let audioContext = null;
  let state = "menu";
  let currentLevelIndex = 0;
  let currentLevel = null;
  let player = null;
  let cameraX = 0;
  let lives = MAX_LIVES;
  let totalCoins = 0;
  let coinBalance = 0;
  let shieldTime = 0;
  let freezeTime = 0;
  let petRescued = false;
  let petDialogueIndex = 0;
  let petShieldTime = 0;
  let petShieldWait = 0;
  let petFlight = null;
  let petWarningActive = false;
  let enemyTime = 0;
  let respawnPoint = null;
  let levelCoins = [];
  let enemies = [];
  let enemyShots = [];
  let particles = [];
  let jumpBuffer = 0;
  let rescueTime = 0;
  let weddingTime = 0;
  let lastTime = 0;
  let elapsed = 0;
  let toastTimer = 0;
  let speechTimer = 0;
  let flash = 0;
  let buttonAction = "start";
  let arena = null;
  let dragonDefeated = false;
  let dialogueIndex = 0;
  const collectedWeapons = new Set();
  const solvedFences = new Set();
  let activeMathFence = null;

  const ground = (x, width) => ({ x, y: GROUND_Y, w: width, h: 80, kind: "ground" });
  const platform = (x, y, w, h = 28, kind = "earth") => ({ x, y, w, h, kind });
  const hazard = (kind, x, w, phase = 0) => ({ kind, x, w, phase });
  const mathFence = (x, operator) => ({ kind: "mathFence", x, w: 58, operator });
  const coinLine = (x, y, count, gap = 42) =>
    Array.from({ length: count }, (_, index) => ({ x: x + index * gap, y, collected: false }));
  const arenaFloor = [ground(0, WIDTH)];
  const weddingHero = createPlayer({ x: -17, y: -HERO_HEIGHT });

  const dayLevels = [
    {
      name: "Đồng Cỏ Bậc Thang", badge: "☀ Rừng Nắng", weather: "sun",
      worldWidth: 4900, sky: ["#78d79a", "#b9e8a7"], checkpointX: 2500,
      structures: [["house", 234], ["house", 2450], ["house", 2650]],
      platforms: [
        platform(335, 426, 105, 52, "log"), platform(478, 372, 155, 24, "log"),
        platform(682, 320, 125, 22, "log"), platform(847, 370, 120, 24, "log"),
        platform(1375, 421, 144, 57, "log"), platform(1560, 375, 118, 22, "log"),
        platform(1730, 327, 160, 22, "log"), platform(2160, 406, 150, 22, "log"),
        platform(2800, 420, 165, 58, "log"), platform(3000, 370, 150, 22, "log"),
        platform(3240, 419, 130, 22, "log"), platform(3960, 427, 110, 51, "log"),
        platform(4130, 370, 120, 22, "log"),
      ],
      hazards: [hazard("spikes", 1080, 62), hazard("trapdoor", 1925, 104), mathFence(2690, "+"),
        hazard("spikes", 3460, 72), hazard("trapdoor", 4350, 120)],
      coins: [
        ...coinLine(164, 444, 5, 31), ...coinLine(358, 391, 3, 28), ...coinLine(495, 337, 4, 29),
        ...coinLine(701, 285, 3, 32), ...coinLine(874, 335, 3, 30), ...coinLine(1170, 444, 4, 36),
        ...coinLine(1590, 340, 3, 30), ...coinLine(1755, 292, 3, 35), ...coinLine(2340, 444, 4, 35),
        ...coinLine(2600, 444, 5, 32), ...coinLine(3020, 335, 4, 32), ...coinLine(3640, 444, 5, 32),
        ...coinLine(4150, 335, 3, 30), ...coinLine(4550, 444, 5, 33),
      ],
      enemies: [
        { type: "rat", x: 995, range: 48, speed: 1.1 },
        { type: "rat", x: 2300, range: 64, speed: 1.35, phase: 2 },
        { type: "rat", x: 3730, range: 90, speed: 1.4, phase: 1 },
      ],
      intro: "Chạy qua đồng cỏ hoặc leo các bậc gỗ để nhặt thêm xu.",
    },
    {
      name: "Sông Hoa Mùa Xuân", badge: "✿ Mùa Xuân", weather: "spring",
      worldWidth: 5300, sky: ["#dba7d3", "#ffe3e7"], checkpointX: 2700,
      structures: [["house", 325], ["waterfall", 710], ["house", 1850], ["waterfall", 3270], ["house", 5050]],
      platforms: [
        platform(584, 452, 100, 26, "stone"), platform(760, 421, 90, 24, "bridge"),
        platform(1420, 437, 122, 28, "bridge"), platform(1612, 462, 105, 25, "stone"),
        platform(2230, 449, 112, 25, "stone"), platform(3020, 451, 104, 24, "bridge"),
        platform(3190, 413, 105, 24, "bridge"), platform(3360, 450, 98, 24, "stone"),
        platform(4088, 453, 93, 26, "stone"), platform(4290, 419, 150, 22, "bridge"),
        platform(4760, 450, 88, 24, "stone"),
      ],
      hazards: [hazard("water", 510, 420), hazard("water", 1340, 440),
        hazard("water", 2140, 290), hazard("water", 2940, 600), hazard("water", 4000, 260),
        hazard("water", 4680, 255)],
      coins: [
        ...coinLine(158, 444, 5), ...coinLine(605, 417, 3, 26), ...coinLine(772, 386, 3, 28),
        ...coinLine(1040, 444, 5), ...coinLine(1440, 402, 3, 32), ...coinLine(1630, 427, 3, 28),
        ...coinLine(1880, 444, 4), ...coinLine(2250, 414, 3, 30), ...coinLine(2610, 444, 5),
        ...coinLine(3040, 416, 3, 28), ...coinLine(3210, 378, 3, 30), ...coinLine(3378, 415, 3, 28),
        ...coinLine(3630, 444, 5), ...coinLine(4103, 418, 3, 26), ...coinLine(4310, 384, 4, 30),
        ...coinLine(4775, 415, 3, 27), ...coinLine(5020, 444, 4, 35),
      ],
      enemies: [
        { type: "snake", x: 1160, range: 82, speed: 1.2 },
        { type: "rat", x: 1945, range: 74, speed: 1.25, phase: 1 },
        { type: "snake", x: 3720, range: 80, speed: 1.3 },
        { type: "rat", x: 4530, range: 68, speed: 1.4 },
      ],
      intro: "Sông xuân chia đường thành nhiều bờ nhỏ. Theo dãy xu qua đá và cầu gỗ.",
    },
    {
      name: "Hẻm Núi Mùa Hạ", badge: "☀ Mùa Hạ", weather: "summer", windy: true,
      worldWidth: 5700, sky: ["#71bed1", "#ffe8a3"], checkpointX: 2850,
      structures: [["house", 2860], ["house", 5390]],
      platforms: [
        platform(380, 425, 175, 53, "brick"), platform(590, 383, 145, 95, "brick"),
        platform(795, 334, 160, 22, "brick"), platform(1005, 392, 205, 86, "brick"),
        platform(1620, 409, 185, 69, "brick"), platform(1830, 363, 155, 24, "brick"),
        platform(2030, 307, 185, 24, "brick"), platform(2250, 365, 160, 24, "brick"),
        platform(3080, 415, 160, 63, "brick"), platform(3270, 369, 170, 24, "brick"),
        platform(3510, 418, 220, 60, "brick"), platform(4200, 401, 240, 24, "brick"),
        platform(4690, 419, 120, 59, "brick"), platform(4850, 367, 210, 22, "brick"),
      ],
      hazards: [hazard("steam", 1270, 60, 0.5), hazard("trap", 1450, 74, 1.1),
        hazard("steam", 2470, 70, 0.7), hazard("trapdoor", 2630, 102),
        hazard("trap", 3820, 68, 0.3), hazard("steam", 4000, 64, 1.2),
        hazard("trapdoor", 4520, 114), hazard("steam", 5220, 72, 0.3)],
      coins: [
        ...coinLine(182, 444, 5, 33), ...coinLine(410, 390, 4, 32), ...coinLine(620, 348, 3, 35),
        ...coinLine(820, 299, 3, 36), ...coinLine(1035, 357, 4, 35), ...coinLine(1650, 374, 4, 34),
        ...coinLine(1855, 328, 3, 35), ...coinLine(2050, 272, 4, 35), ...coinLine(2270, 330, 4, 32),
        ...coinLine(2900, 444, 4, 35), ...coinLine(3110, 380, 3, 38), ...coinLine(3300, 334, 4, 34),
        ...coinLine(3540, 383, 4, 42), ...coinLine(4220, 366, 5, 35), ...coinLine(4890, 332, 4),
        ...coinLine(5390, 444, 5, 32),
      ],
      enemies: [
        { type: "snake", x: 1390, range: 44, speed: 1.1 },
        { type: "zombie", x: 2775, range: 50, speed: 0.8, phase: 1 },
        { type: "rat", x: 5100, range: 63, speed: 1.3 },
      ],
      intro: "Leo qua các tầng đá. Chờ luồng hơi nóng tắt trước khi chạy ngang miệng hốc.",
    },
    {
      name: "Phế Tích Mùa Thu", badge: "🍂 Gió Mùa Thu", weather: "autumn", windy: true,
      worldWidth: 6100, sky: ["#e89a65", "#ffdb9d"], checkpointX: 3060,
      platforms: [
        platform(540, 418, 140, 22, "brick"), platform(730, 367, 120, 22, "brick"),
        platform(1050, 444, 90, 24, "ice"), platform(1220, 413, 102, 26, "ice"),
        platform(1690, 423, 170, 22, "brick"), platform(1910, 372, 164, 22, "brick"),
        platform(2110, 418, 165, 22, "brick"), platform(2495, 448, 135, 24, "ice"),
        platform(2770, 405, 130, 22, "brick"), platform(3380, 415, 120, 22, "brick"),
        platform(3560, 366, 140, 22, "brick"), platform(3870, 445, 98, 24, "ice"),
        platform(4040, 412, 108, 26, "ice"), platform(4460, 416, 130, 22, "brick"),
        platform(4640, 363, 160, 22, "brick"), platform(5040, 441, 97, 24, "ice"),
        platform(5210, 416, 97, 24, "ice"), platform(5570, 423, 140, 22, "brick"),
      ],
      hazards: [hazard("crevasse", 965, 445), hazard("trapdoor", 2240, 108), hazard("crevasse", 2440, 270),
        hazard("crevasse", 3790, 440), hazard("spikes", 4340, 66), hazard("crevasse", 4960, 430),
        hazard("swamp", 350, 190), hazard("swamp", 3140, 210),
        hazard("flame", 1540, 70), hazard("flame", 3650, 70, 1.3)],
      coins: [
        ...coinLine(165, 444, 5), ...coinLine(565, 383, 3, 36), ...coinLine(750, 332, 3, 36),
        ...coinLine(1065, 409, 3, 26), ...coinLine(1240, 378, 3, 29), ...coinLine(1490, 444, 4),
        ...coinLine(1710, 388, 4, 36), ...coinLine(1930, 337, 4, 36), ...coinLine(2130, 383, 4, 35),
        ...coinLine(2550, 413, 3, 28), ...coinLine(2790, 370, 3, 32), ...coinLine(3130, 444, 5),
        ...coinLine(3580, 331, 4, 33), ...coinLine(3887, 410, 3, 27), ...coinLine(4060, 377, 3, 30),
        ...coinLine(4660, 328, 4, 36), ...coinLine(5060, 406, 3, 27), ...coinLine(5230, 381, 3, 27),
        ...coinLine(5600, 388, 3, 34), ...coinLine(5790, 444, 5, 32),
      ],
      enemies: [
        { type: "zombie", x: 446, range: 75, speed: 0.85 },
        { type: "ghost", x: 1940, y: 337, range: 85, speed: 0.95, phase: 2 },
        { type: "zombie", x: 3220, range: 60, speed: 1 },
        { type: "ghost", x: 4710, y: 321, range: 91, speed: 1.05, phase: 1 },
        { type: "wisp", x: 5480, y: 353, range: 55, speed: 1.4 },
      ],
      intro: "Gió cuốn lá qua phế tích. Né bẫy phun lửa và nhảy khỏi đầm lầy gần zombie!",
    },
    {
      name: "Đường Tuyết Tới Thành Rồng", badge: "❄ Mùa Đông", weather: "winter",
      worldWidth: 6700, sky: ["#7397b3", "#c8e2e8"], checkpointX: 3370,
      structures: [["house", 266], ["house", 3380], ["house", 5620], ["house", 5830]],
      platforms: [
        platform(610, 442, 100, 30, "stone"), platform(780, 407, 120, 27, "stone"),
        platform(1305, 416, 150, 62, "brick"), platform(1490, 366, 180, 22, "brick"),
        platform(2000, 449, 106, 27, "stone"), platform(2185, 423, 104, 26, "stone"),
        platform(2640, 420, 132, 58, "brick"), platform(2815, 361, 150, 24, "brick"),
        platform(3560, 415, 138, 63, "brick"), platform(3750, 361, 142, 22, "brick"),
        platform(4140, 450, 96, 25, "stone"), platform(4310, 414, 116, 25, "stone"),
        platform(4750, 414, 160, 64, "brick"), platform(4960, 362, 172, 22, "brick"),
      ],
      hazards: [hazard("lava", 525, 465), hazard("steam", 1110, 68, 0.6), hazard("lava", 1920, 460),
        hazard("trap", 3090, 70, 1), hazard("lava", 4060, 460), hazard("steam", 4570, 66, 0.2),
        hazard("spikes", 5250, 70)],
      coins: [
        ...coinLine(155, 444, 5), ...coinLine(630, 407, 3, 27), ...coinLine(803, 372, 3, 34),
        ...coinLine(1340, 381, 3, 38), ...coinLine(1515, 331, 4, 37), ...coinLine(2020, 414, 3, 31),
        ...coinLine(2205, 388, 3, 31), ...coinLine(2440, 444, 4), ...coinLine(2840, 326, 4, 34),
        ...coinLine(3420, 444, 3, 34), ...coinLine(3770, 326, 4, 34), ...coinLine(4158, 415, 3, 27),
        ...coinLine(4330, 379, 3, 33), ...coinLine(4990, 327, 4, 35), ...coinLine(5410, 444, 4, 34),
        ...coinLine(5670, 444, 4, 34), ...coinLine(6040, 444, 4, 34),
      ],
      enemies: [
        { type: "zombie", x: 1195, range: 43, speed: 0.9 },
        { type: "ghost", x: 1630, y: 322, range: 84, speed: 1.05 },
        { type: "wisp", x: 2490, y: 353, range: 62, speed: 1.55 },
        { type: "zombie", x: 3200, range: 42, speed: 0.9 },
        { type: "ghost", x: 5010, y: 323, range: 93, speed: 1.25, phase: 2 },
        { type: "snowman", x: 404 }, { type: "snowman", x: 3480 }, { type: "snowman", x: 5920 },
      ],
      intro: "Vượt đèo tuyết và né tuyết do người tuyết ném trước khi tới Thành Rồng.",
    },
  ];

  const nightLevels = [
    {
      name: "Rừng Đèn Trăng", badge: "☂ Rừng Mưa Đêm", weather: "night", rain: true,
      worldWidth: 2860, sky: ["#141b3a", "#465786"], checkpointX: 1460,
      platforms: [
        platform(320, 427, 138, 51, "log"), platform(502, 382, 165, 24, "log"),
        platform(690, 330, 130, 24, "bridge"), platform(878, 278, 130, 24, "bridge"),
        platform(1066, 226, 130, 24, "bridge"), platform(1254, PET_CAGE_Y, 240, 28, "bridge"),
        platform(905, 419, 155, 24, "bridge"), platform(1160, 426, 114, 52, "brick"),
        platform(1680, 418, 134, 22, "bridge"), platform(1860, 370, 130, 22, "bridge"),
        platform(2160, 420, 124, 24, "log"),
      ],
      hazards: [hazard("arrow", 754, 32), hazard("arrow", 2420, 32, 1.2), mathFence(2580, "−")],
      coins: [...coinLine(166, 444, 5, 32), ...coinLine(522, 347, 4, 30), ...coinLine(921, 384, 4, 29),
        ...coinLine(718, 295, 3, 32), ...coinLine(906, 243, 3, 32),
        ...coinLine(1094, 191, 3, 32), ...coinLine(1280, 139, 2, 32),
        ...coinLine(1350, 444, 4, 32), ...coinLine(1878, 335, 4, 30), ...coinLine(2520, 444, 4, 34)],
      enemies: [
        { type: "spider", x: 622, range: 48, speed: 1.15 },
        { type: "wisp", x: 1000, y: 324, range: 50, speed: 1.2 },
        { type: "plant", x: 1360 }, { type: "boar", x: 2070, range: 60, speed: 1.25 },
      ],
      structures: [["gate", 205], ["lantern", 815], ["tower", 1460], ["lantern", 2370]],
      intro: "Mưa đêm phủ khu rừng. Theo dãy bậc gỗ và xu lên cao để giải cứu Rồng Trắng!",
    },
    {
      name: "Bến Nước Sao Rơi", badge: "☾ Bến Nước", weather: "night",
      worldWidth: 3220, sky: ["#101d3b", "#355b79"], checkpointX: 1620,
      platforms: [
        platform(579, 448, 118, 24, "bridge"), platform(773, 416, 104, 24, "bridge"),
        platform(1305, 449, 132, 26, "stone"), platform(2010, 452, 115, 24, "bridge"),
        platform(2200, 419, 126, 22, "bridge"), platform(2510, 416, 150, 22, "stone"),
      ],
      hazards: [hazard("water", 495, 461), hazard("arrow", 1060, 30, 0.5), hazard("water", 1225, 291),
        hazard("water", 1930, 471), hazard("fallingRock", 2730, 36, 1.8)],
      coins: [...coinLine(165, 444, 4), ...coinLine(602, 413, 3, 31), ...coinLine(793, 381, 3, 30),
        ...coinLine(1328, 414, 3, 32), ...coinLine(1620, 444, 5, 30), ...coinLine(2040, 417, 3, 28),
        ...coinLine(2220, 384, 3, 34), ...coinLine(2900, 444, 4)],
      enemies: [
        { type: "spider", x: 345, range: 52, speed: 1.25 },
        { type: "wisp", x: 821, y: 326, range: 55, speed: 1.2 },
        { type: "plant", x: 1770 }, { type: "boar", x: 2910, range: 76, speed: 1.2 },
      ],
      structures: [["pier", 540], ["waterfall", 760], ["gate", 1620], ["house", 1765], ["pier", 2150],
        ["waterfall", 2240], ["lantern", 2560], ["house", 3050]],
      intro: "Qua bến gỗ và các bậc đá giữa sông. Ánh đèn đánh dấu chỗ nghỉ.",
    },
    {
      name: "Đài Ngắm Sao", badge: "☾ Đài Ngắm Sao", weather: "night",
      worldWidth: 3430, sky: ["#201a3f", "#5a4677"], checkpointX: 1710,
      platforms: [
        platform(350, 419, 135, 59, "brick"), platform(519, 369, 132, 22, "brick"),
        platform(697, 321, 150, 23, "brick"), platform(905, 379, 135, 24, "stone"),
        platform(1330, 422, 133, 56, "brick"), platform(1515, 373, 140, 22, "brick"),
        platform(1960, 420, 170, 58, "brick"), platform(2170, 371, 138, 24, "brick"),
        platform(2360, 322, 155, 22, "stone"), platform(2695, 415, 140, 24, "stone"),
      ],
      hazards: [hazard("arrow", 1088, 30, 0.7), hazard("fallingRock", 1210, 38),
        mathFence(1770, "×"), hazard("fallingRock", 2570, 36, 1.2), hazard("arrow", 3000, 30, 2)],
      coins: [...coinLine(180, 444, 5), ...coinLine(538, 334, 4, 28), ...coinLine(718, 286, 4, 32),
        ...coinLine(1532, 338, 4, 30), ...coinLine(1730, 444, 4), ...coinLine(2190, 336, 4, 30),
        ...coinLine(2381, 287, 4, 33), ...coinLine(3130, 444, 4)],
      enemies: [
        { type: "spider", x: 585, y: 369, range: 40, speed: 1.2 },
        { type: "wisp", x: 930, y: 309, range: 47, speed: 1.1 },
        { type: "plant", x: 1840 }, { type: "boar", x: 2850, range: 58, speed: 1.25 },
      ],
      structures: [["tower", 642], ["gate", 1610], ["tower", 2330], ["lantern", 2940]],
      intro: "Leo lên đài ngắm sao để lấy xu, hoặc đi dưới chân tháp và né đá rơi.",
    },
    {
      name: "Tu Viện Trăng Khuyết", badge: "☾ Tu Viện", weather: "night",
      worldWidth: 3630, sky: ["#171b32", "#494260"], checkpointX: 1800,
      platforms: [
        platform(465, 419, 150, 22, "brick"), platform(663, 367, 155, 22, "brick"),
        platform(920, 450, 113, 24, "stone"), platform(1100, 423, 122, 24, "brick"),
        platform(1530, 414, 142, 24, "brick"), platform(1930, 411, 150, 22, "brick"),
        platform(2140, 360, 170, 24, "brick"), platform(2620, 448, 108, 24, "stone"),
        platform(2810, 420, 112, 22, "brick"), platform(3100, 413, 148, 24, "brick"),
      ],
      hazards: [hazard("crevasse", 835, 470), hazard("trapdoor", 1390, 105),
        hazard("fallingRock", 1720, 35, 1.2), hazard("arrow", 2390, 32, 0.7),
        hazard("crevasse", 2535, 466), hazard("fallingRock", 3300, 38, 0.9), mathFence(3460, "÷")],
      coins: [...coinLine(162, 444, 5), ...coinLine(485, 384, 4, 32), ...coinLine(685, 332, 4, 33),
        ...coinLine(940, 415, 3, 32), ...coinLine(1120, 388, 4, 30), ...coinLine(1820, 444, 4),
        ...coinLine(2160, 325, 4, 33), ...coinLine(2642, 413, 3, 28), ...coinLine(2830, 385, 3, 31),
        ...coinLine(3430, 444, 4, 28)],
      enemies: [
        { type: "boar", x: 342, range: 66, speed: 1.3 },
        { type: "spider", x: 1160, y: 423, range: 35, speed: 1.15 },
        { type: "plant", x: 2055 }, { type: "wisp", x: 2190, y: 293, range: 78, speed: 1.15 },
      ],
      structures: [["gate", 483], ["tower", 750], ["gate", 1830], ["gate", 3135]],
      intro: "Len qua cổng tu viện và những hành lang đổ nát dưới trăng.",
    },
    {
      name: "Thành Rồng Dưới Trăng", badge: "☾ Thành Rồng", weather: "night",
      worldWidth: 3910, sky: ["#111a38", "#3b506f"], checkpointX: 1925,
      platforms: [
        platform(655, 450, 112, 26, "stone"), platform(840, 418, 122, 22, "brick"),
        platform(1200, 421, 147, 57, "brick"), platform(1395, 373, 149, 22, "brick"),
        platform(1730, 426, 130, 52, "brick"), platform(2200, 449, 120, 22, "stone"),
        platform(2403, 419, 113, 23, "brick"), platform(2740, 415, 130, 22, "brick"),
      ],
      hazards: [hazard("lava", 565, 481), hazard("arrow", 1110, 31, 1.4),
        hazard("fallingRock", 1630, 37, 0.4), hazard("lava", 2110, 480),
        hazard("arrow", 2660, 31, 0.9)],
      coins: [...coinLine(165, 444, 5), ...coinLine(675, 415, 3, 33), ...coinLine(861, 383, 4, 28),
        ...coinLine(1420, 338, 4, 30), ...coinLine(1945, 444, 4, 33), ...coinLine(2222, 414, 3, 34),
        ...coinLine(2423, 384, 4, 28), ...coinLine(2890, 444, 5, 32), ...coinLine(3210, 444, 5, 30)],
      enemies: [
        { type: "boar", x: 390, range: 75, speed: 1.25 },
        { type: "spider", x: 901, y: 418, range: 37, speed: 1.2 },
        { type: "plant", x: 1568 }, { type: "wisp", x: 2460, y: 328, range: 63, speed: 1.25 },
      ],
      structures: [["gate", 310], ["tower", 1415], ["gate", 1960], ["tower", 2960], ["gate", 3490]],
      weapons: [{ type: "dart", x: 2980 }, { type: "sword", x: 3200 }, { type: "bow", x: 3410 }],
      goal: { x: 3750, y: GROUND_Y - HERO_HEIGHT, w: 86, h: HERO_HEIGHT, princess: true },
      intro: "Qua cổng thành dưới trăng, nhặt phi tiêu, kiếm và cung trước khi gặp Rồng Đỏ.",
    },
  ];

  const levels = dayLevels.flatMap((level, index) => [level, nightLevels[index]]);
  const progressDots = levels.map((level, index) => {
    const dot = document.createElement("span");
    dot.className = level.weather === "night" ? "progress-dot night" : "progress-dot";
    dot.title = `Màn ${index + 1} · ${level.name}`;
    return dot;
  });
  progressTrack.replaceChildren(...progressDots);
  progressTrack.style.setProperty("--level-count", String(levels.length));

  levels.forEach((level) => {
    let bank = 0;
    const gaps = level.hazards.filter((obstacle) => ["water", "crevasse", "lava"].includes(obstacle.kind));
    for (const gap of gaps) {
      level.platforms.push(ground(bank, gap.x - bank));
      bank = gap.x + gap.w;
    }
    level.platforms.push(ground(bank, level.worldWidth - bank));
    level.collisionPlatforms = level.platforms.flatMap((block) => cutTrapdoorOpenings(block, level.hazards));
    level.spawn = { x: 80, y: GROUND_Y - HERO_HEIGHT };
    level.checkpoint = { x: level.checkpointX, y: level.spawn.y };
    level.goal ??= { x: level.worldWidth - 128, y: 388, w: 54, h: 90 };
  });

  function cutTrapdoorOpenings(block, hazards) {
    if (block.kind !== "ground") return [block];
    const end = block.x + block.w;
    const trapdoors = hazards.filter((obstacle) =>
      obstacle.kind === "trapdoor" && obstacle.x >= block.x && obstacle.x + obstacle.w <= end);
    if (trapdoors.length === 0) return [block];

    const pieces = [];
    let x = block.x;
    for (const trapdoor of trapdoors.sort((a, b) => a.x - b.x)) {
      if (trapdoor.x > x) pieces.push(ground(x, trapdoor.x - x));
      pieces.push(platform(trapdoor.x, GROUND_Y, trapdoor.w, 8, "trapdoor"));
      x = trapdoor.x + trapdoor.w;
    }
    if (x < end) pieces.push(ground(x, end - x));
    return pieces;
  }

  function createPlayer(spawn) {
    return {
      x: spawn.x,
      y: spawn.y,
      w: 34,
      h: HERO_HEIGHT,
      vx: 0,
      vy: 0,
      grounded: false,
      facing: 1,
      invulnerable: 0,
      walkTime: 0,
      swingTime: 0,
      inSwamp: false,
    };
  }

  function cloneItems(items) {
    return items.map((item) => ({ ...item, baseX: item.x, baseY: item.y, phase: item.phase || 0 }));
  }

  function loadLevel(index, showIntro = true) {
    currentLevelIndex = index;
    currentLevel = levels[index];
    petFlight = null;
    petWarningActive = false;
    speechTimer = 0;
    weddingTime = 0;
    gameCard.classList.remove("wedding");
    weddingHeading.hidden = true;
    weddingReplay.hidden = true;
    chatButton.hidden = false;
    shopButton.hidden = false;
    arena = null;
    dragonDefeated = false;
    if (dragonDialogue.open) dragonDialogue.close();
    if (petDialogue.open) petDialogue.close();
    if (mathDialog.open) mathDialog.close();
    activeMathFence = null;
    solvedFences.clear();
    collectedWeapons.clear();
    showBattleHud(false);
    warnedHazards.clear();
    openTrapdoors.clear();
    player = createPlayer(currentLevel.spawn);
    levelCoins = cloneItems(currentLevel.coins);
    enemies = cloneItems(currentLevel.enemies.map((enemy) => ({ y: GROUND_Y, facing: 1, ...enemy })));
    enemyShots = [];
    enemyTime = elapsed;
    updateEnemies();
    shieldTime = 0;
    petShieldTime = 0;
    freezeTime = 0;
    respawnPoint = currentLevel.spawn;
    cameraX = 0;
    jumpBuffer = 0;
    rescueTime = 0;
    particles = createWeatherParticles(currentLevel.rain ? "rain" : currentLevel.weather);
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
    coinBalance = 0;
    petRescued = false;
    petDialogueIndex = 0;
    petShieldTime = 0;
    petShieldWait = 0;
    state = "playing";
    loadLevel(0);
    hideOverlay();
  }

  function showOverlay(config) {
    chatButton.disabled = true;
    speechTimer = 0;
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
    primaryButton.blur();
  }

  function finishLevel() {
    if (state !== "playing") return;
    playSound("finish");

    if (currentLevel.goal.princess) {
      state = "rescuing";
      shopButton.disabled = true;
      chatButton.disabled = true;
      speechTimer = 0;
      player.vx = 0;
      player.invulnerable = 0;
      messageToast.classList.remove("show");
      return;
    }

    state = "levelComplete";
    shopButton.disabled = true;
    showOverlay({
      eyebrow: `HOÀN THÀNH ${currentLevel.name.toUpperCase()}`,
      title: `MÀN ${currentLevelIndex + 1} XONG!`,
      text: `Bạn đang có ${coinBalance} xu để tiêu và ${lives} mạng.`,
      button: `Sang màn ${currentLevelIndex + 2}`,
      action: "next",
      hideControls: true,
    });
  }

  function showVictory() {
    state = "victory";
    weddingTime = 0;
    clearControls();
    particles = createWeatherParticles("spring");
    gameCard.classList.add("wedding");
    weddingHeading.hidden = false;
    chatButton.hidden = true;
    shopButton.hidden = true;
    weatherBadge.textContent = "♥ Chiến thắng";
    showToast(`Hero và công chúa đã an toàn. Tổng số xu nhặt được: ${totalCoins}.`, 4500);
    try {
      const best = Number(localStorage.getItem("herozx-best")) || 0;
      localStorage.setItem("herozx-best", String(Math.max(best, totalCoins)));
    } catch {
      // Local browser settings can block score storage.
    }
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
      shopButton.disabled = true;
      showBattleHud(false);
      showOverlay({
        eyebrow: reason === "enemy" ? "ĐỤNG PHẢI QUÁI" : "GẶP CHƯỚNG NGẠI",
        title: "HẾT MẠNG",
        text: `Bạn đã thu thập được ${totalCoins} xu. Hãy thử lại và chọn đường đi an toàn hơn.`,
        button: "Thử lại từ đầu",
        action: "restart",
        hideControls: true,
      });
      return;
    }

    if (arena) {
      player = createPlayer({ x: 125, y: GROUND_Y - HERO_HEIGHT });
      petFlight = null;
      player.invulnerable = 1.8;
      arena.shots = [];
      arena.nextFire = 1.6;
      jumpBuffer = 0;
    } else {
      respawnHero();
    }
    const lifeHint = lives === 1 ? "Lần này, nhìn đường trước khi lấy đà nhé!" : "Phủi bụi rồi thử lại nào, Hero!";
    showToast(`Còn ${lives} mạng. ${lifeHint}`, 2300);
  }

  function respawnHero() {
    player = createPlayer(respawnPoint);
    petFlight = null;
    enemyShots = [];
    jumpBuffer = 0;
    warnedHazards.clear();
    openTrapdoors.clear();
    player.invulnerable = 1.8;
    cameraX = Math.max(0, Math.min(currentLevel.worldWidth - WIDTH, player.x - WIDTH * 0.35));
  }

  function updateCheckpoint() {
    const checkpoint = currentLevel.checkpoint;
    if (respawnPoint === checkpoint || !player.grounded || player.x < checkpoint.x) return;
    respawnPoint = checkpoint;
    showToast("Đã lưu cột mốc giữa màn. Hero có chỗ quay lại rồi!", 2800);
  }

  function updateHud() {
    stageValue.textContent = `${currentLevelIndex + 1}/${levels.length}`;
    coinValue.textContent = String(coinBalance);
    lifeValue.textContent = "♥".repeat(lives) + "♡".repeat(MAX_LIVES - lives);
    shopButton.disabled = currentLevelIndex === 0 || state !== "playing";
    chatButton.disabled = state !== "playing";
    shopButton.textContent = currentLevelIndex === 0 ? "Shop 🔒" : "Shop";
    progressDots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentLevelIndex);
      dot.classList.toggle("done", index < currentLevelIndex);
    });
  }

  function canBuy(item) {
    return state === "playing" && currentLevelIndex >= 1 && coinBalance >= shopPrices[item]
      && (item !== "life" || lives < MAX_LIVES)
      && (item !== "shield" || (shieldTime <= 0 && petShieldTime <= 0))
      && (item !== "freeze" || freezeTime <= 0);
  }

  function openShop() {
    if (shopButton.disabled) return;
    clearControls();
    shopBalance.textContent = `Bạn có ${coinBalance} xu.`;
    for (const button of shopItems) {
      const item = button.dataset.item;
      button.disabled = !canBuy(item);
      const label = button.querySelector(".shop-price");
      const unavailable = item === "life" && lives === MAX_LIVES ? "Đầy mạng"
        : (item === "shield" && (shieldTime > 0 || petShieldTime > 0)) || (item === "freeze" && freezeTime > 0) ? "Đang dùng" : "";
      label.textContent = unavailable || `${shopPrices[item]} xu`;
    }
    shopDialog.showModal();
  }

  function clearControls() {
    keys.clear();
    touch.left = false;
    touch.right = false;
    jumpBuffer = 0;
  }

  function openChat() {
    if (state !== "playing" || shopDialog.open || chatDialog.open) return;
    clearControls();
    chatInput.value = "";
    chatDialog.showModal();
  }

  function sendChat(event) {
    event.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    heroSpeech.textContent = text;
    speechTimer = 5;
    chatDialog.close();
  }

  function positionSpeechBubble() {
    heroSpeech.hidden = speechTimer <= 0;
    if (heroSpeech.hidden) return;
    const x = player.x + player.w / 2 - (arena ? 0 : Math.round(cameraX));
    heroSpeech.style.setProperty("--speech-x", `${x / WIDTH * 100}%`);
    heroSpeech.style.top = `${(player.y - 13) / HEIGHT * 100}%`;
  }

  function buyItem(item) {
    if (!shopDialog.open || !canBuy(item)) return;
    coinBalance -= shopPrices[item];
    let message;
    if (item === "life") {
      lives += 1;
      message = `Thêm 1 mạng! Hero đang có ${lives} mạng.`;
    } else if (item === "shield") {
      shieldTime = SHIELD_DURATION;
      message = "Khiên đã bật! Hero bất tử trong 1,5 giây.";
    } else {
      freezeTime = FREEZE_DURATION;
      message = "Quái đứng hình trong 3 giây. Tranh thủ chạy nào!";
    }
    updateHud();
    shopDialog.close();
    showToast(message, 2200);
  }

  function showToast(message, duration = 1800, warning = false) {
    messageToast.textContent = message;
    messageToast.classList.toggle("warning", warning);
    messageToast.classList.add("show");
    toastTimer = duration / 1000;
  }

  function rectsIntersect(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function enemyRect(enemy) {
    if (enemy.type === "snowman") return { x: enemy.x - 15, y: enemy.y - 44, w: 30, h: 44 };
    if (enemy.type === "spider") return { x: enemy.x - 19, y: enemy.y - 21, w: 38, h: 21 };
    if (enemy.type === "plant") return { x: enemy.x - 15, y: enemy.y - 42, w: 30, h: 42 };
    if (enemy.type === "boar") return { x: enemy.x - 22, y: enemy.y - 29, w: 44, h: 29 };
    if (enemy.type === "ghost") return { x: enemy.x - 15, y: enemy.y - 19, w: 30, h: 37 };
    if (enemy.type === "zombie") return { x: enemy.x - 13, y: enemy.y - 40, w: 28, h: 40 };
    if (enemy.type === "wisp") return { x: enemy.x - 15, y: enemy.y - 18, w: 30, h: 36 };
    if (enemy.type === "snake") return { x: enemy.x - 17, y: enemy.y - 30, w: 34, h: 30 };
    return { x: enemy.x - 18, y: enemy.y - 27, w: 36, h: 27 };
  }

  function spikeHeight(obstacle) {
    if (obstacle.kind === "spikes") return 23;
    const cycle = (elapsed + obstacle.phase) % 2.8;
    return Math.round(25 * Math.max(0, Math.min(1, (cycle - 1.3) / 0.23, (2.65 - cycle) / 0.23)));
  }

  function touchesHazard(obstacle, body) {
    if (obstacle.kind === "mathFence" || obstacle.kind === "swamp") return false;
    if (obstacle.kind === "arrow" || obstacle.kind === "fallingRock") {
      const projectile = trapProjectile(obstacle);
      return projectile !== null && rectsIntersect(body, projectile);
    }
    if (obstacle.kind === "trapdoor") {
      return openTrapdoors.has(obstacle.x) && rectsIntersect(body, {
        x: obstacle.x, y: TRAPDOOR_SPIKE_Y, w: obstacle.w, h: 140,
      });
    }
    const surface = isSurfaceHazard(obstacle);
    const height = surface ? hazardHeight(obstacle) : HEIGHT - GROUND_Y + 60;
    const y = surface ? GROUND_Y - height : GROUND_Y + 14;
    return height > 4 && rectsIntersect(body, { x: obstacle.x + 3, y, w: obstacle.w - 6, h: height });
  }

  function isSurfaceHazard(obstacle) {
    return obstacle.kind === "spikes" || obstacle.kind === "trap" || obstacle.kind === "steam"
      || obstacle.kind === "flame" || obstacle.kind === "arrow" || obstacle.kind === "fallingRock";
  }

  function trapProjectile(obstacle) {
    const time = (elapsed + obstacle.phase) % 3.6 - 1.4;
    if (time < 0) return null;
    const center = obstacle.x + obstacle.w / 2;
    if (obstacle.kind === "arrow") {
      return time < 0.75 ? { x: center - 6, y: GROUND_Y - 22 - time * 365, w: 12, h: 22 } : null;
    }
    const y = GROUND_Y - 232 + 350 * time * time;
    return y < GROUND_Y - 20 ? { x: center - 14, y, w: 28, h: 24 } : null;
  }

  function hazardHeight(obstacle) {
    if (obstacle.kind === "flame") {
      const cycle = (elapsed + obstacle.phase) % 4;
      return Math.round(96 * Math.max(0, Math.min(1, (cycle - 2.4) / 0.15, (3.4 - cycle) / 0.2)));
    }
    if (obstacle.kind !== "steam") return spikeHeight(obstacle);
    const cycle = (elapsed + obstacle.phase) % 3.4;
    return Math.round(54 * Math.max(0, Math.min(1, (cycle - 1.9) / 0.35, (3.1 - cycle) / 0.3)));
  }

  function warnAboutHazard() {
    let nearest = null;
    let nearestDistance = HAZARD_WARNING_DISTANCE;
    const rightEdge = player.x + player.w;
    for (const obstacle of currentLevel.hazards) {
      if (obstacle.kind === "mathFence") continue;
      const obstacleEnd = obstacle.x + obstacle.w;
      const gap = Math.max(obstacle.x - rightEdge, player.x - obstacleEnd);
      if (gap > HAZARD_WARNING_DISTANCE + 40) warnedHazards.delete(obstacle);

      const distance = player.facing > 0 ? obstacle.x - rightEdge : player.x - obstacleEnd;
      if (distance >= 0 && distance < nearestDistance) {
        nearest = obstacle;
        nearestDistance = distance;
      }
    }
    if (nearest && !warnedHazards.has(nearest)) {
      warnedHazards.add(nearest);
      const messages = hazardWarnings[nearest.kind];
      const index = nextWarningByKind.get(nearest.kind) ?? 0;
      showToast(messages[index], 3200, true);
      nextWarningByKind.set(nearest.kind, (index + 1) % messages.length);
    }
  }

  function reachedGoal(body) {
    const goal = currentLevel.goal;
    if (!goal.princess) return rectsIntersect(body, goal);
    return dragonDefeated && player.grounded && Math.abs(player.x + player.w / 2 - (goal.x + 44)) <= 41;
  }

  function triggerMathFence() {
    if (!player.grounded || player.y + player.h !== GROUND_Y) return false;
    const center = player.x + player.w / 2;
    const trap = currentLevel.hazards.find((obstacle) => obstacle.kind === "mathFence" &&
      !solvedFences.has(obstacle) && center >= obstacle.x && center < obstacle.x + obstacle.w);
    if (!trap) return false;

    let left = 2 + Math.floor(Math.random() * 8);
    let right = 2 + Math.floor(Math.random() * 8);
    let answer = left + right;
    if (trap.operator === "−") {
      if (left < right) [left, right] = [right, left];
      answer = left - right;
    } else if (trap.operator === "×") {
      answer = left * right;
    } else if (trap.operator === "÷") {
      answer = left;
      left *= right;
    }
    clearControls();
    player.vx = 0;
    activeMathFence = { trap, answer, raisedAt: performance.now() };
    mathPrompt.textContent = `${left} ${trap.operator} ${right} = ?`;
    mathAnswer.value = "";
    mathDialog.showModal();
    return true;
  }

  function submitMathAnswer(event) {
    event.preventDefault();
    if (!activeMathFence || !/^\d+$/.test(mathAnswer.value.trim())) return;
    const { trap, answer } = activeMathFence;
    activeMathFence = null;
    mathDialog.close();
    if (Number(mathAnswer.value) === answer) {
      solvedFences.add(trap);
      playSound("coin");
      showToast("Đúng rồi! Hàng rào đã hạ xuống.", 2600);
    } else {
      player.invulnerable = 0;
      hitPlayer("hazard");
      if (lives > 0) showToast(`Đáp án là ${answer}. Hero mất 1 mạng và trở về điểm hồi sinh.`, 3000);
    }
  }

  function update(dt) {
    if (shopDialog.open || chatDialog.open || dragonDialogue.open || petDialogue.open || mathDialog.open) return;
    elapsed += dt;
    speechTimer = Math.max(0, speechTimer - dt);
    if (toastTimer > 0) {
      toastTimer -= dt;
      if (toastTimer <= 0) messageToast.classList.remove("show");
    }
    flash = Math.max(0, flash - dt);

    if (state === "victory") {
      updateWeather(dt, "spring");
      weddingTime += dt;
      if (weddingReplay.hidden && weddingTime >= PET_ARRIVAL) {
        weddingReplay.hidden = false;
        showToast("Rồng Đỏ giờ là pet của Hero và công chúa!", 5000);
      }
      return;
    }

    updateWeather(dt);
    if (state === "rescuing") {
      rescueTime += dt;
      if (rescueTime >= 2.3) showVictory();
      return;
    }
    if (state !== "playing") return;

    updateWhitePet(dt);
    if (arena) {
      updateArena(dt);
      return;
    }
    moveHero(dt, currentLevel.worldWidth, currentLevel.collisionPlatforms, currentLevel.slipperyGround, currentLevel.windy);

    if (freezeTime <= 0) {
      enemyTime += dt;
      updateEnemies();
      updateRangedEnemies(dt);
    }
    collectCoins();

    const playerRect = { x: player.x + 4, y: player.y + 3, w: player.w - 8, h: player.h - 4 };
    const hazardHit = currentLevel.hazards.find((obstacle) => touchesHazard(obstacle, playerRect));
    const fell = player.y > HEIGHT + 140;
    const protectedNow = shieldTime > 0 || petShieldTime > 0;
    const hitByShot = updateEnemyShots(dt, playerRect);
    shieldTime = Math.max(0, shieldTime - dt);
    freezeTime = Math.max(0, freezeTime - dt);
    if (protectedNow && (fell || (hazardHit && !isSurfaceHazard(hazardHit)))) {
      respawnHero();
      showToast("Khiên cứu Hero khỏi cú rơi!", 2100);
      return;
    }
    if (!protectedNow && (fell || hazardHit)) {
      hitPlayer("hazard");
      return;
    }
    if (!protectedNow && player.invulnerable === 0 &&
        (hitByShot || enemies.some((enemy) => rectsIntersect(playerRect, enemyRect(enemy))))) {
      hitPlayer("enemy");
      return;
    }
    updateCheckpoint();
    if (triggerPetRescue()) return;
    if (triggerMathFence()) return;
    collectWeapons();
    if (currentLevel.goal.princess && !dragonDefeated && player.x >= currentLevel.goal.x - 195) {
      enterArena();
      return;
    }
    if (reachedGoal(playerRect)) finishLevel();
    else warnAboutHazard();

    const targetCamera = Math.max(0, Math.min(currentLevel.worldWidth - WIDTH, player.x - WIDTH * 0.36));
    cameraX += (targetCamera - cameraX) * Math.min(1, dt * 5.5);
  }

  function showPetLine() {
    const [speaker, line] = petConversation[petDialogueIndex];
    petSpeaker.textContent = speaker;
    petLine.textContent = line;
    petStep.textContent = `${petDialogueIndex + 1}/${petConversation.length}`;
    petNext.textContent = petDialogueIndex === 0 ? "Mở lồng" : petDialogueIndex === 1 ? "Tiếp" : "Cùng lên đường!";
  }

  function triggerPetRescue() {
    if (petRescued || currentLevelIndex !== PET_CAGE_LEVEL || !player.grounded ||
        Math.abs(player.x + player.w / 2 - PET_CAGE_X) > 92 ||
        Math.abs(player.y + player.h - PET_CAGE_Y) > 8) return false;
    state = "petDialogue";
    clearControls();
    player.vx = 0;
    speechTimer = 0;
    petDialogueIndex = 0;
    updateHud();
    showPetLine();
    petDialogue.showModal();
    return true;
  }

  function advancePetDialogue() {
    if (state !== "petDialogue") return;
    petDialogueIndex += 1;
    if (petDialogueIndex < petConversation.length) {
      showPetLine();
      return;
    }
    petDialogue.close();
    petRescued = true;
    petFlight = { x: PET_CAGE_X, y: PET_CAGE_Y - 12, vx: 0, vy: 0, facing: -1 };
    petWarningActive = false;
    petShieldWait = 8 + Math.random() * 10;
    state = "playing";
    clearControls();
    updateHud();
    playSound("finish");
    showToast(`Rồng Trắng đồng hành! Pet ngẫu nhiên tạo khiên bất tử trong ${PET_SHIELD_DURATION} giây.`, 4800);
  }

  function updateWhitePet(dt) {
    if (!petRescued) return;
    updatePetFlight(dt);
    petShieldTime = Math.max(0, petShieldTime - dt);
    // Start the next random cooldown only after all active shields expire.
    if (petShieldTime > 0 || shieldTime > 0) {
      petWarningActive = false;
      return;
    }
    petShieldWait = Math.max(0, petShieldWait - dt);
    petWarningActive = petShieldWait > 0 && petShieldWait <= PET_WARNING_LEAD;
    if (petShieldWait > 0) return;
    petWarningActive = false;
    petShieldTime = PET_SHIELD_DURATION;
    petShieldWait = 8 + Math.random() * 10;
    showToast(`Rồng Trắng bảo hộ! Bất tử trong ${PET_SHIELD_DURATION} giây.`, PET_SHIELD_DURATION * 1000);
    playSound("coin");
  }

  function heroInSwamp() {
    return !arena && player.grounded && Math.abs(player.y + player.h - GROUND_Y) < 6 &&
      currentLevel.hazards.some(obstacle => obstacle.kind === "swamp" &&
        player.x + player.w - 4 > obstacle.x && player.x + 4 < obstacle.x + obstacle.w);
  }

  function moveHero(dt, width, platforms, slippery, windy) {
    player.swingTime = Math.max(0, player.swingTime - dt);
    player.inSwamp = heroInSwamp();
    const moveLeft = keys.has("ArrowLeft") || keys.has("KeyA") || touch.left;
    const moveRight = keys.has("ArrowRight") || keys.has("KeyD") || touch.right;
    const direction = Number(moveRight) - Number(moveLeft);
    const onSlipperyGround = player.grounded && slippery;
    const acceleration = onSlipperyGround ? 760 : 1800;
    const friction = onSlipperyGround ? 360 : 1900;
    const maxSpeed = player.inSwamp ? PLAYER_SPEED * 0.45 : PLAYER_SPEED;

    if (direction !== 0) {
      player.vx += direction * acceleration * dt;
      player.vx = Math.max(-maxSpeed, Math.min(maxSpeed, player.vx));
      player.facing = direction;
      player.walkTime += dt * Math.abs(player.vx) * 0.035;
    } else {
      const amount = friction * dt;
      if (Math.abs(player.vx) <= amount) player.vx = 0;
      else player.vx -= Math.sign(player.vx) * amount;
    }

    if (jumpBuffer > 0 && player.grounded) {
      player.vy = -JUMP_FORCE;
      player.grounded = false;
      jumpBuffer = 0;
      playSound("jump");
    }
    jumpBuffer = Math.max(0, jumpBuffer - dt);

    if (windy && !player.grounded) {
      player.vx += (58 + Math.sin(elapsed * 1.7) * 42) * dt;
    }

    player.vy += GRAVITY * dt;
    player.vy = Math.min(player.vy, 950);
    movePlayerX(dt, platforms);
    movePlayerY(dt, platforms);
    player.inSwamp = heroInSwamp();
    if (player.inSwamp) player.vx = Math.max(-PLAYER_SPEED * 0.45, Math.min(PLAYER_SPEED * 0.45, player.vx));
    player.x = Math.max(0, Math.min(width - player.w, player.x));
    player.invulnerable = Math.max(0, player.invulnerable - dt);
  }

  function collectWeapons() {
    for (const pickup of currentLevel.weapons ?? []) {
      if (collectedWeapons.has(pickup.type) || Math.abs(player.x + player.w / 2 - pickup.x) > 30) continue;
      collectedWeapons.add(pickup.type);
      playSound("coin");
      showToast(`Đã nhặt ${weapons[pickup.type].name.toLowerCase()}. Giữ lại để đấu rồng!`, 2200);
    }
  }

  function showBattleHud(visible) {
    battleControls.hidden = !visible;
    bossHud.hidden = !visible;
    if (visible) {
      bossName.textContent = "Rồng Đỏ";
      bossHealth.max = DRAGON_HP;
      bossHealth.value = DRAGON_HP;
      for (const button of battleButtons) {
        button.disabled = !collectedWeapons.has(button.dataset.weapon);
        button.setAttribute("aria-pressed", "false");
      }
    }
  }

  function enterArena() {
    petFlight = null;
    enemyShots = [];
    arena = {
      returnX: player.x, returnCamera: cameraX, x: 715, feetY: GROUND_Y, hp: DRAGON_HP, facing: -1,
      nextFire: 2.3, cooldown: 0, slash: 0, weapon: null, motionTime: 0,
      enraged: false, cloakUntil: 0, nextCloak: Infinity, transformUntil: 0,
      shots: [], attacks: [],
    };
    player = createPlayer({ x: 125, y: GROUND_Y - HERO_HEIGHT });
    jumpBuffer = 0;
    showBattleHud(true);
    weatherBadge.textContent = "◆ Đấu trường Rồng Đỏ";
    showToast("Dùng phím 1–3 hoặc chạm vũ khí. Rồng đổi cách di chuyển theo vũ khí bạn dùng!", 5200);
  }

  function leaveArena() {
    petFlight = null;
    const { returnX, returnCamera } = arena;
    arena = null;
    dragonDefeated = true;
    state = "playing";
    player = createPlayer({ x: returnX, y: GROUND_Y - HERO_HEIGHT });
    cameraX = returnCamera;
    jumpBuffer = 0;
    showBattleHud(false);
    updateHud();
    weatherBadge.textContent = currentLevel.badge;
    showToast("Khế ước đã lập. Đi tiếp đến chân thành để cứu công chúa.", 3600);
  }

  function dragonBody() {
    const width = arena.enraged ? 102 : 82;
    const height = arena.enraged ? 112 : 90;
    return { x: arena.x - width / 2, y: arena.feetY - height, w: width, h: height };
  }

  function dragonIsHidden() {
    return elapsed < arena.cloakUntil;
  }

  function enrageDragon() {
    arena.enraged = true;
    arena.hp = ENRAGED_DRAGON_HP;
    arena.transformUntil = elapsed + 0.8;
    arena.nextCloak = elapsed + 2.7;
    arena.shots.length = 0;
    arena.attacks.length = 0;
    arena.nextFire = 1.5;
    bossName.textContent = "Rồng Lửa Cuồng Nộ";
    bossHealth.max = ENRAGED_DRAGON_HP;
    bossHealth.value = ENRAGED_DRAGON_HP;
    playSound("hurt");
    showToast("Cuồng Nộ! Rồng bắn 3 tia lửa. Giữ khoảng cách và nhảy qua khe giữa các tia!", 5000, true);
  }

  function showPactLine() {
    const [speaker, action, line] = dragonPact[dialogueIndex];
    dialogueSpeaker.textContent = speaker;
    dialogueAction.textContent = `(${action})`;
    dialogueLine.textContent = line;
    dialogueStep.textContent = `${dialogueIndex + 1}/${dragonPact.length}`;
    dialogueNext.textContent = dialogueIndex === dragonPact.length - 1 ? "Về chân thành" : "Tiếp";
  }

  function beginDragonPact() {
    state = "dragonDialogue";
    clearControls();
    speechTimer = 0;
    arena.feetY = GROUND_Y;
    player.invulnerable = 0;
    arena.slash = 0;
    arena.shots.length = 0;
    battleControls.hidden = true;
    updateHud();
    messageToast.classList.remove("show");
    dialogueIndex = 0;
    showPactLine();
    dragonDialogue.showModal();
  }

  function advanceDragonPact() {
    if (state !== "dragonDialogue") return;
    dialogueIndex += 1;
    if (dialogueIndex < dragonPact.length) {
      showPactLine();
    } else {
      dragonDialogue.close();
      leaveArena();
    }
  }

  function damageDragon(damage) {
    if (dragonIsHidden() || elapsed < arena.transformUntil) return;
    arena.hp = Math.max(0, arena.hp - damage);
    bossHealth.value = arena.hp;
    if (arena.hp === 0) {
      if (!arena.enraged) {
        enrageDragon();
        return;
      }
      playSound("finish");
      beginDragonPact();
    } else {
      playSound("coin");
    }
  }

  function attackDragon(type) {
    if (!arena || arena.hp <= 0 || shopDialog.open || chatDialog.open ||
        state !== "playing" || !collectedWeapons.has(type)) return;
    if (arena.weapon !== type) {
      arena.weapon = type;
      arena.motionTime = 0;
      for (const button of battleButtons) {
        button.setAttribute("aria-pressed", String(button.dataset.weapon === type));
      }
    }
    if (arena.cooldown > 0 || elapsed < arena.transformUntil) return;
    const weapon = weapons[type];
    const direction = player.facing;
    const x = player.x + player.w / 2;
    const y = player.y + 19;
    arena.cooldown = weapon.cooldown;

    if (type === "sword") {
      arena.slash = 0.16;
      const strike = { x: direction > 0 ? x : x - weapon.range, y: y - 12, w: weapon.range, h: 38 };
      if (rectsIntersect(strike, dragonBody())) damageDragon(weapon.damage);
    } else {
      const dragon = dragonBody();
      const angle = Math.atan2(dragon.y + dragon.h / 2 - y, Math.max(45, Math.abs(arena.x - x)));
      arena.attacks.push({
        x, y, vx: Math.cos(angle) * weapon.speed * direction,
        vy: Math.sin(angle) * weapon.speed, ttl: weapon.duration, type,
      });
    }
  }

  function moveDragon(dt) {
    arena.motionTime += dt;
    const heroX = player.x + player.w / 2;
    const time = arena.motionTime;
    arena.facing = heroX < arena.x ? -1 : 1;
    let x = 715;
    let feetY = GROUND_Y;
    let speed = 75;

    if (arena.weapon === "sword") {
      x = heroX - arena.facing * 118;
      speed = 85;
    } else if (arena.weapon === "dart") {
      x = 670 + Math.sin(time * 1.7) * 130;
      feetY -= 18 + Math.sin(time * 2.5) ** 2 * 55;
      speed = 150;
    } else if (arena.weapon === "bow") {
      x = 650 + Math.sin(time * 1.15) * 190;
      feetY -= 85 + Math.sin(time * 2.1) * 45;
      speed = 185;
    }

    x = Math.max(65, Math.min(WIDTH - 65, x));
    if (arena.enraged) speed *= 1.13;
    arena.x += Math.max(-speed * dt, Math.min(speed * dt, x - arena.x));
    arena.feetY += Math.max(-165 * dt, Math.min(165 * dt, feetY - arena.feetY));
  }

  function fireDragonVolley() {
    const direction = arena.facing;
    const x = arena.x + direction * 52;
    const y = arena.feetY - 23;
    const distance = Math.abs(player.x + player.w / 2 - x);
    // Let the fan spread before reaching Hero. Close melee range stays playable.
    if (arena.enraged && distance < ENRAGED_FIRE_MIN_DISTANCE) {
      arena.nextFire = 0.35;
      return;
    }
    const speed = arena.enraged ? ENRAGED_FIRE_SPEED : 285;
    const travelTime = Math.max(0.35, distance / speed);
    const aim = Math.max(-155, Math.min(155, (player.y + 25 - y) / travelTime));
    if (arena.enraged) {
      // From the ground, fan upward so all three fireballs remain above the floor.
      const centerVy = arena.feetY >= GROUND_Y - 35 ? Math.min(-ENRAGED_FIRE_SPREAD, aim) : aim;
      for (const spread of [-ENRAGED_FIRE_SPREAD, 0, ENRAGED_FIRE_SPREAD]) {
        arena.shots.push({ x, y, vx: direction * speed, vy: centerVy + spread });
      }
      arena.nextFire = 2.3;
    } else {
      arena.shots.push({ x, y, vx: direction * speed, vy: aim });
      arena.nextFire = 2.15;
    }
  }

  function updateArena(dt) {
    moveHero(dt, WIDTH, arenaFloor, false, false);
    arena.cooldown = Math.max(0, arena.cooldown - dt);
    arena.slash = Math.max(0, arena.slash - dt);
    if (elapsed < arena.transformUntil) return;

    if (freezeTime <= 0) moveDragon(dt);
    if (freezeTime <= 0 && elapsed >= arena.nextCloak) {
      arena.cloakUntil = elapsed + DRAGON_CLOAK_DURATION;
      arena.nextCloak = elapsed + 3.9;
      showToast("Rồng tàng hình!", 750);
    }
    const hidden = dragonIsHidden();
    const dragon = dragonBody();
    arena.attacks = arena.attacks.filter((attack) => {
      if (arena.hp <= 0) return false;
      attack.x += attack.vx * dt;
      attack.y += attack.vy * dt;
      attack.ttl -= dt;
      if (!hidden && rectsIntersect({ x: attack.x - 8, y: attack.y - 4, w: 16, h: 8 }, dragon)) {
        damageDragon(weapons[attack.type].damage);
        return false;
      }
      return attack.ttl > 0 && attack.x > -20 && attack.x < WIDTH + 20;
    });
    if (arena.hp <= 0 || elapsed < arena.transformUntil) {
      arena.attacks.length = 0;
      return;
    }

    if (freezeTime <= 0 && !hidden) {
      arena.nextFire -= dt;
      if (arena.nextFire <= 0) {
        fireDragonVolley();
      }
    }
    const protectedNow = shieldTime > 0 || petShieldTime > 0;
    shieldTime = Math.max(0, shieldTime - dt);
    freezeTime = Math.max(0, freezeTime - dt);
    const body = { x: player.x + 4, y: player.y + 3, w: player.w - 8, h: player.h - 4 };
    let hit = !hidden && rectsIntersect(body, dragon);
    arena.shots = arena.shots.filter((shot) => {
      shot.x += shot.vx * dt;
      shot.y += shot.vy * dt;
      if (rectsIntersect({ x: shot.x - 11, y: shot.y - 10, w: 22, h: 20 }, body)) {
        hit = true;
        return false;
      }
      return shot.x > -25 && shot.x < WIDTH + 25 && shot.y < GROUND_Y + 10 && shot.y > -25;
    });
    if (hit && !protectedNow) hitPlayer("enemy");
  }

  function movePlayerX(dt, platforms) {
    player.x += player.vx * dt;
    for (const block of platforms) {
      if ((block.kind !== "ground" && block.h <= 42) || !rectsIntersect(player, block)) continue;
      if (player.vx > 0) player.x = block.x - player.w;
      else if (player.vx < 0) player.x = block.x + block.w;
      player.vx = 0;
    }
  }

  function movePlayerY(dt, platforms) {
    const previousBottom = player.y + player.h;
    player.y += player.vy * dt;
    player.grounded = false;

    for (const block of platforms) {
      if (block.kind === "trapdoor" && openTrapdoors.has(block.x)) continue;
      if (player.vy >= 0 && previousBottom <= block.y && rectsIntersect(player, block)) {
        player.y = block.y - player.h;
        player.vy = 0;
        player.grounded = true;
      }
    }

    if (!arena && player.grounded && player.y + player.h === GROUND_Y) {
      const center = player.x + player.w / 2;
      const trapdoor = currentLevel.hazards.find((obstacle) =>
        obstacle.kind === "trapdoor" && center >= obstacle.x && center < obstacle.x + obstacle.w);
      if (trapdoor) openTrapdoors.add(trapdoor.x);
    }
  }

  function updateEnemies() {
    for (const enemy of enemies) {
      const previousX = enemy.x;
      if (enemy.type === "plant" || enemy.type === "snowman") {
        if (!(enemy.windup > 0)) enemy.facing = player.x + player.w / 2 < enemy.x ? -1 : 1;
        continue;
      }
      if (["rat", "zombie", "spider", "boar"].includes(enemy.type)) {
        enemy.x = enemy.baseX + Math.sin(enemyTime * enemy.speed + enemy.phase) * enemy.range;
      } else if (enemy.type === "snake") {
        const lunge = Math.max(0, Math.sin(enemyTime * enemy.speed + enemy.phase));
        enemy.x = enemy.baseX + lunge * enemy.range;
      } else {
        enemy.x = enemy.baseX + Math.sin(enemyTime * enemy.speed + enemy.phase) * enemy.range;
        enemy.y = enemy.baseY + Math.sin(enemyTime * enemy.speed * 1.7 + enemy.phase) * 24;
      }
      const distance = enemy.x - previousX;
      if (Math.abs(distance) > 0.001) enemy.facing = Math.sign(distance);
    }
  }

  function updateRangedEnemies(dt) {
    for (const enemy of enemies) {
      if (enemy.type !== "plant" && enemy.type !== "snowman") continue;
      const snow = enemy.type === "snowman";
      if (enemy.windup > 0) {
        enemy.windup -= dt;
        if (enemy.windup <= 0) {
          enemyShots.push({
            kind: snow ? "snow" : "fire",
            x: enemy.x + enemy.facing * 20, y: enemy.y - (snow ? 30 : 32),
            vx: (snow ? 225 : 205) * enemy.facing, vy: snow ? -165 : 0,
            ttl: 1.45,
          });
          enemy.nextShot = enemyTime + (snow ? 2.5 : 2.2);
        }
        continue;
      }
      const distance = Math.abs(player.x + player.w / 2 - enemy.x);
      if (distance <= (snow ? 250 : 270) && Math.abs(player.y + player.h - enemy.y) <= 105 &&
          enemyTime >= (enemy.nextShot ?? 0)) {
        enemy.windup = 0.58;
      }
    }
  }

  function updateEnemyShots(dt, playerRect) {
    let hit = false;
    enemyShots = enemyShots.filter((shot) => {
      shot.x += shot.vx * dt;
      shot.y += shot.vy * dt;
      if (shot.kind === "snow") shot.vy += 365 * dt;
      shot.ttl -= dt;
      if (shot.ttl <= 0 || shot.y >= GROUND_Y || shot.x < 0 || shot.x > currentLevel.worldWidth) return false;
      const body = { x: shot.x - 7, y: shot.y - 7, w: 14, h: 14 };
      if (currentLevel.collisionPlatforms.some((block) =>
        (block.kind !== "trapdoor" || !openTrapdoors.has(block.x)) && rectsIntersect(body, block))) return false;
      if (rectsIntersect(playerRect, body)) {
        hit = true;
        return false;
      }
      return true;
    });
    return hit;
  }

  function collectCoins() {
    for (const coin of levelCoins) {
      if (coin.collected) continue;
      const coinBox = { x: coin.x - 11, y: coin.y - 11, w: 22, h: 22 };
      if (rectsIntersect(player, coinBox)) {
        coin.collected = true;
        totalCoins += 1;
        coinBalance += 1;
        playSound("coin");
        updateHud();
      }
    }
  }

  function createWeatherParticles(weather) {
    const { count, particles: colors } = seasonWeather[weather];
    return Array.from({ length: count }, (_, index) => ({
      x: Math.random() * WIDTH,
      y: Math.random() * HEIGHT,
      speed: 45 + Math.random() * 240,
      size: 1 + Math.random() * 4,
      phase: Math.random() * Math.PI * 2,
      color: colors[index % colors.length],
    }));
  }

  function updateWeather(dt, weather = currentLevel?.rain ? "rain" : currentLevel?.weather) {
    if (!weather) return;
    const { fall, drift, sway } = seasonWeather[weather];
    const gust = weather === "autumn" ? 65 * Math.sin(elapsed * 0.8) : 0;
    for (const particle of particles) {
      particle.y += particle.speed * fall * dt;
      particle.x += (drift + gust + Math.sin(elapsed * 1.5 + particle.phase) * sway) * dt;

      if (particle.y > HEIGHT + 20) particle.y = -20;
      if (particle.y < -25) particle.y = HEIGHT + 20;
      if (particle.x < -30) particle.x = WIDTH + 30;
      if (particle.x > WIDTH + 30) particle.x = -30;
    }
  }

  function render() {
    if (!currentLevel) {
      currentLevel = levels[0];
      particles = createWeatherParticles(currentLevel.rain ? "rain" : currentLevel.weather);
    }

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.imageSmoothingEnabled = false;
    if (state === "victory") {
      drawWedding();
    } else if (arena) {
      drawArena();
    } else {
      drawBackground();
      drawWorld();
      drawWeather();
    }

    if (flash > 0) {
      ctx.fillStyle = `rgba(255, 235, 210, ${Math.min(0.5, flash * 1.5)})`;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }
    positionSpeechBubble();
    positionPetSpeech();
  }

  function drawWedding() {
    const sky = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    sky.addColorStop(0, "#f8c5d9");
    sky.addColorStop(1, "#fffaf6");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    drawBlossomGrove(0, 388, 164, 4, "#b5688a", "#e78db1", "#ffc1d5", "#fff1f6", "#996477");

    ctx.fillStyle = "#f9dce6";
    ctx.fillRect(0, WEDDING_FLOOR_Y, WIDTH, HEIGHT - WEDDING_FLOOR_Y);
    ctx.fillStyle = "#fffaf8";
    ctx.fillRect(0, WEDDING_FLOOR_Y, WIDTH, 11);
    drawPixelShape("#dc93b0", [[412, 412], [548, 412], [655, HEIGHT], [305, HEIGHT]]);
    drawPixelShape("#f5b5ce", [[427, 412], [533, 412], [623, HEIGHT], [337, HEIGHT]]);

    drawWeddingArch();
    for (const x of [276, 320, 640, 684]) drawWeddingFlowers(x);
    ctx.save();
    ctx.translate(438, WEDDING_FLOOR_Y);
    ctx.scale(1.42, 1.42);
    drawHero(weddingHero, null);
    ctx.restore();
    ctx.save();
    ctx.translate(520, WEDDING_FLOOR_Y);
    ctx.scale(1.42, 1.42);
    drawPrincess(0, 0, true);
    ctx.restore();
    drawHeart(480, 302 + Math.round(Math.sin(elapsed * 3) * 3));

    if (weddingTime >= 0.55) {
      const progress = Math.min(1, (weddingTime - 0.55) / (PET_ARRIVAL - 0.55));
      const ease = progress * (2 - progress);
      const x = Math.round(744 - ease * 359);
      const y = Math.round(209 + ease * (WEDDING_FLOOR_Y - 209) - Math.sin(progress * Math.PI) * 56);
      const size = Math.round(HERO_HEIGHT * 2 - ease * 62);
      if (progress === 1) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(-1, 1);
        drawDragon(0, 0, size);
        ctx.restore();
      } else {
        drawDragon(x, y, size);
      }
    }
    drawWeather("spring");
  }

  function drawWeddingFlowers(x) {
    const y = WEDDING_FLOOR_Y;
    drawPixelShape("#a7637f", [[x - 15, y - 20], [x + 15, y - 20], [x + 10, y], [x - 10, y]]);
    ctx.fillStyle = "#fff8f7";
    ctx.fillRect(x - 17, y - 23, 34, 7);
    ctx.fillStyle = "#f3d6df";
    ctx.fillRect(x - 9, y - 15, 18, 11);
    ctx.fillStyle = "#799b7a";
    ctx.fillRect(x - 2, y - 49, 4, 26);
    ctx.fillRect(x - 12, y - 39, 24, 5);
    drawBlossomCluster(x - 16, y - 59, 32, "#b97092", "#ec98b8", "#ffc9db", "#fffaf6");
  }

  function drawWeddingArch() {
    for (const x of [335, 601]) {
      ctx.fillStyle = "#b97998";
      ctx.fillRect(x - 4, 237, 32, 179);
      ctx.fillStyle = "#fffcf7";
      ctx.fillRect(x, 235, 24, 181);
      ctx.fillStyle = "#edd4dc";
      ctx.fillRect(x + 17, 235, 7, 181);
      ctx.fillStyle = "#e796b4";
      ctx.fillRect(x - 4, 294, 32, 9);
    }
    drawPixelShape("#fffaf6", [[332, 251], [332, 228], [360, 228], [360, 202], [389, 202],
      [389, 181], [570, 181], [570, 202], [600, 202], [600, 228], [628, 228],
      [628, 251], [602, 251], [602, 244], [577, 244], [577, 219], [550, 219],
      [550, 205], [411, 205], [411, 219], [382, 219], [382, 244], [358, 244], [358, 251]]);
    for (const [x, y] of [[343, 220], [378, 190], [421, 170], [479, 177], [531, 170], [574, 194], [611, 219]]) {
      drawBlossomCluster(x - 19, y, 39, "#b97092", "#e99bb9", "#ffc6d8", "#fff9f7");
    }
  }

  function drawArena() {
    const sky = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    sky.addColorStop(0, "#141829");
    sky.addColorStop(1, "#473846");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "#6c6678";
    ctx.fillRect(0, GROUND_Y, WIDTH, 9);
    ctx.fillStyle = "#34313d";
    ctx.fillRect(0, GROUND_Y + 9, WIDTH, HEIGHT - GROUND_Y);
    if (!dragonIsHidden() && (arena.hp > 0 || state === "dragonDialogue")) {
      ctx.save();
      ctx.translate(arena.x, 0);
      ctx.scale(-arena.facing, 1);
      if (state === "dragonDialogue") ctx.globalAlpha = 0.78;
      const flying = arena.feetY < GROUND_Y - 8;
      const flap = flying ? Math.round(Math.sin(arena.motionTime * 13) * 3) : 0;
      if (arena.enraged) drawEnragedDragon(arena.feetY, flap);
      else drawDragon(0, arena.feetY, HERO_HEIGHT * 2, flap);
      ctx.restore();
      if (arena.hp > 0 && (freezeTime > 0 || arena.nextFire < 0.52)) {
        const box = dragonBody();
        ctx.fillStyle = freezeTime > 0 ? "#a1e8ff50" : "#ff9b5244";
        ctx.fillRect(box.x, box.y, box.w, box.h);
      }
    }
    if (player.invulnerable <= 0 || Math.floor(elapsed * 12) % 2 === 0) {
      drawHero(player, state === "dragonDialogue" ? null : (arena.weapon ?? "sword"));
    }
    if (shieldTime > 0 && arena.hp > 0) {
      ctx.strokeStyle = "#ffde76";
      ctx.lineWidth = 2;
      ctx.strokeRect(player.x - 5, player.y - 5, player.w + 10, player.h + 8);
    }
    drawWhitePet();
    for (const shot of arena.shots) {
      ctx.fillStyle = "#ee513e";
      ctx.fillRect(shot.x - 13, shot.y - 10, 26, 20);
      ctx.fillStyle = "#ffd472";
      ctx.fillRect(shot.x - 7, shot.y - 5, 14, 10);
    }
    for (const attack of arena.attacks) {
      if (attack.type === "bow") {
        ctx.fillStyle = weapons.bow.color;
        ctx.fillRect(attack.x - 10, attack.y - 1, 20, 3);
        const tip = attack.x + Math.sign(attack.vx) * 10;
        ctx.fillRect(tip - 2, attack.y - 3, 4, 7);
      } else {
        drawWeaponIcon(attack.type, attack.x, attack.y);
      }
    }
    if (arena.slash > 0) {
      const x = player.x + player.w / 2 + player.facing * 42;
      drawPixelShape("#e1f4ff", [[x - 20, player.y + 28], [x, player.y + 4],
        [x + 30, player.y + 12], [x + 4, player.y + 16]]);
    }
  }

  function drawEnragedDragon(feetY, flap) {
    const pulse = Math.round(Math.sin(elapsed * 11) * 5);
    drawPixelShape("#aa3449", [[-61, feetY - 27], [-63, feetY - 71], [-43, feetY - 62],
      [-48, feetY - 116 - pulse], [-22, feetY - 93], [-15, feetY - 133 + pulse],
      [5, feetY - 101], [30, feetY - 137 - pulse], [38, feetY - 90], [63, feetY - 112],
      [68, feetY - 52], [55, feetY - 24]]);
    drawPixelShape("#ff742e", [[-54, feetY - 32], [-52, feetY - 72], [-35, feetY - 58],
      [-37, feetY - 101], [-13, feetY - 78], [-11, feetY - 117 + pulse], [8, feetY - 88],
      [27, feetY - 121 - pulse], [34, feetY - 79], [55, feetY - 99], [57, feetY - 40]]);
    drawDragon(0, feetY, 118, flap);
    ctx.fillStyle = "#ffe391";
    ctx.fillRect(-53, feetY - 83 + pulse, 5, 9);
    ctx.fillRect(34, feetY - 103 - pulse, 5, 12);
    ctx.fillRect(56, feetY - 56 + pulse, 5, 8);
  }

  function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    gradient.addColorStop(0, currentLevel.sky[0]);
    gradient.addColorStop(1, currentLevel.sky[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    const weather = currentLevel.weather;
    if (weather === "sun") {
      ctx.fillStyle = "rgba(255, 239, 132, 0.7)";
      ctx.fillRect(770, 68, 62, 62);
      ctx.fillStyle = "rgba(255, 247, 173, 0.45)";
      ctx.fillRect(758, 56, 86, 86);
    }
    if (weather === "summer") {
      const sunlight = ctx.createRadialGradient(794, 84, 34, 794, 84, 190);
      sunlight.addColorStop(0, "#fff4aeaa");
      sunlight.addColorStop(1, "#fff4ae00");
      ctx.fillStyle = sunlight;
      ctx.fillRect(604, 0, 356, 274);
      ctx.fillStyle = "#fff1b4";
      ctx.fillRect(756, 46, 76, 76);
    }
    if (weather === "night") drawNightSky();

    const [farHill, nearHill, farTrees, nearTrees] = seasonWeather[weather].forest;
    drawMountainLayer(0.08, 300, farHill, 95);
    drawMountainLayer(0.16, 360, nearHill, 76);
    if (weather === "spring") {
      drawBlossomGrove(0.25, 415, 128, 3, farTrees, "#cb87ac", "#eaa6c9", "#f6c3d9", "#90637d");
      drawBlossomGrove(0.47, 474, 218, 4, nearTrees, "#d96c9d", "#f5a0c2", "#ffcfdf", "#72445e");
    } else {
      drawTreeLayer(0.27, 380, farTrees, 94);
      drawTreeLayer(0.48, 430, nearTrees, 72);
    }
  }

  function drawNightSky() {
    const moonX = Math.round(758 - cameraX * 0.018);
    const moonY = 96;
    const halo = ctx.createRadialGradient(moonX, moonY, 23, moonX, moonY, 102);
    halo.addColorStop(0, "#c9d9ff66");
    halo.addColorStop(1, "#c9d9ff00");
    ctx.fillStyle = halo;
    ctx.fillRect(moonX - 102, 0, 204, 201);
    for (let index = 0; index < 44; index++) {
      const x = Math.round((index * 179 + 57 - cameraX * 0.045) % WIDTH + WIDTH) % WIDTH;
      const y = 18 + (index * 73) % 178;
      ctx.fillStyle = Math.sin(elapsed * 1.7 + index) > 0.25 ? "#e7edff" : "#96acd8";
      ctx.fillRect(x, y, index % 7 === 0 ? 5 : 2, 2);
      if (index % 7 === 0) ctx.fillRect(x + 2, y - 2, 1, 6);
    }
    drawPixelShape("#fdf3da", [[moonX - 19, moonY - 28], [moonX + 20, moonY - 28],
      [moonX + 28, moonY - 19], [moonX + 28, moonY + 19], [moonX + 19, moonY + 28],
      [moonX - 19, moonY + 28], [moonX - 28, moonY + 18], [moonX - 28, moonY - 19]]);
    ctx.fillStyle = "#ddd8cb";
    ctx.fillRect(moonX - 13, moonY + 7, 11, 6);
    ctx.fillRect(moonX + 11, moonY - 14, 8, 5);
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
    for (let x = offset - spacing; x < WIDTH + spacing; x += spacing) {
      const sway = ((Math.floor((x + cameraX * factor) / spacing) % 3) + 3) % 3;
      const crownY = baseY - 130 - sway * 12;
      ctx.fillStyle = color;
      ctx.fillRect(x + 34, baseY - 78 - sway * 12, 15, 90 + sway * 12);
      ctx.fillRect(x + 12, baseY - 105 - sway * 12, 60, 40);
      ctx.fillRect(x + 21, crownY, 42, 40);
      if (currentLevel.weather === "winter") {
        ctx.fillStyle = "#deedf0";
        ctx.fillRect(x + 21, crownY, 42, 7);
        ctx.fillRect(x + 12, crownY + 25, 15, 5);
        ctx.fillRect(x + 61, crownY + 25, 11, 5);
      } else if (currentLevel.weather === "autumn") {
        ctx.fillStyle = sway === 1 ? "#eaa04b" : "#d7793e";
        ctx.fillRect(x + 21, crownY + 4, 42, 12);
        ctx.fillRect(x + 13, crownY + 28, 48, 9);
        ctx.fillStyle = "#f6b964";
        ctx.fillRect(x + 25, crownY + 4, 16, 5);
        ctx.fillRect(x + 49, crownY + 29, 10, 4);
      }
    }
  }

  function drawBlossomGrove(factor, baseY, spacing, pixel, shade, bloom, light, glint, bark) {
    const scroll = cameraX * factor;
    const first = Math.floor(scroll / spacing) - 1;
    const last = Math.ceil((scroll + WIDTH) / spacing);
    for (let index = first; index <= last; index++) {
      const variant = ((index % 3) + 3) % 3;
      const x = Math.round(index * spacing - scroll + variant * 11);
      ctx.save();
      ctx.translate(x, baseY + variant * 7);
      ctx.scale(pixel, pixel);
      drawPixelShape(bark, [[18, 0], [19, -25], [15, -33], [8, -38], [10, -42], [20, -36],
        [22, -48], [26, -46], [24, -31], [32, -37], [37, -37], [26, -25], [24, 0]]);
      ctx.fillStyle = shade;
      ctx.fillRect(22, -24, 2, 21);
      drawBlossomCluster(2, -51, 24, shade, bloom, light, glint);
      drawBlossomCluster(24, -50 + variant * 3, 24, shade, bloom, light, glint);
      drawBlossomCluster(10, -63 - variant * 4, 29, shade, bloom, light, glint);
      ctx.restore();
    }
  }

  function drawBlossomCluster(x, y, width, shade, bloom, light, glint) {
    ctx.fillStyle = shade;
    ctx.fillRect(x + 4, y, width - 8, 3);
    ctx.fillRect(x, y + 3, width, 11);
    ctx.fillRect(x + 3, y + 14, width - 6, 4);
    ctx.fillStyle = bloom;
    ctx.fillRect(x + 3, y + 3, width - 6, 10);
    ctx.fillRect(x + 5, y + 13, width - 10, 2);
    ctx.fillStyle = light;
    ctx.fillRect(x + 5, y + 2, width - 10, 4);
    ctx.fillRect(x + 2, y + 6, 8, 4);
    ctx.fillRect(x + width - 11, y + 6, 8, 3);
    ctx.fillStyle = glint;
    ctx.fillRect(x + 8, y + 3, 5, 2);
    ctx.fillRect(x + width - 8, y + 6, 2, 2);
    ctx.fillRect(x + 12, y + 10, 4, 2);
  }

  function drawPetCage() {
    if (currentLevelIndex !== PET_CAGE_LEVEL) return;
    const x = PET_CAGE_X;
    const top = PET_CAGE_Y - 84;
    const open = petRescued || (state === "petDialogue" && petDialogueIndex > 0);
    ctx.fillStyle = "#334657";
    ctx.fillRect(x - 44, top, 88, 6);
    ctx.fillRect(x - 44, PET_CAGE_Y - 7, 88, 7);
    ctx.fillStyle = "#607e8c";
    ctx.fillRect(x - 41, top + 6, 4, 71);
    ctx.fillRect(x + 37, top + 6, 4, 71);
    if (!petRescued) drawDragon(x, PET_CAGE_Y - 12, 48, Math.sin(elapsed * 5), whiteDragonColors);
    ctx.fillStyle = "#9bb1bd";
    if (open) {
      // The hinged door swings clear of the dragon.
      ctx.fillRect(x + 42, top + 6, 22, 4);
      ctx.fillRect(x + 42, PET_CAGE_Y - 11, 22, 4);
      for (let offset = 42; offset <= 62; offset += 10) ctx.fillRect(x + offset, top + 6, 3, 70);
    } else {
      for (let offset = -27; offset <= 27; offset += 18) ctx.fillRect(x + offset, top + 6, 4, 71);
      ctx.fillRect(x - 38, top + 38, 76, 4);
      ctx.fillStyle = "#ffd774";
      ctx.fillRect(x - 6, top + 36, 14, 15);
      ctx.fillStyle = "#5e503a";
      ctx.fillRect(x, top + 40, 3, 7);
    }
    ctx.save();
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#203f49";
    ctx.fillRect(x - 92, top - 30, 184, 23);
    ctx.fillStyle = "#f1fbff";
    ctx.fillText(open ? "Rồng Trắng đã tự do!" : "Lại gần để cứu Rồng Trắng", x, top - 14);
    ctx.restore();
  }

  function whitePetPose() {
    if (!petFlight) {
      petFlight = {
        x: player.x + player.w / 2 - player.facing * 60,
        y: Math.max(48, player.y - 40), vx: 0, vy: 0, facing: player.facing,
      };
    }
    return petFlight;
  }

  function updatePetFlight(dt) {
    const pet = whitePetPose();
    const phase = elapsed * 1.8;
    const targetX = player.x + player.w / 2 + Math.sin(phase) * 86;
    const targetY = Math.max(48, player.y - 30 - Math.cos(phase * 2) * 13);
    // Independent position, acceleration and speed keep the dragon from snapping
    // up and down with Hero's jumps, while still catching up during a run.
    pet.vx += ((targetX - pet.x) * 10 - pet.vx * 5) * dt;
    pet.vy += ((targetY - pet.y) * 9 - pet.vy * 5) * dt;
    pet.vx = Math.max(-340, Math.min(340, pet.vx));
    pet.vy = Math.max(-190, Math.min(190, pet.vy));
    pet.x += pet.vx * dt;
    pet.y += pet.vy * dt;
    pet.x = Math.max(24, Math.min((arena ? WIDTH : currentLevel.worldWidth) - 24, pet.x));
    pet.y = Math.max(48, Math.min(GROUND_Y - 25, pet.y));
    if (Math.abs(pet.vx) > 8) pet.facing = Math.sign(pet.vx);
  }

  function positionPetSpeech() {
    petSpeech.hidden = !petRescued || !petWarningActive || state !== "playing";
    if (petSpeech.hidden) return;
    const pet = whitePetPose();
    const x = pet.x - (arena ? 0 : Math.round(cameraX));
    petSpeech.style.setProperty("--speech-x", `${x / WIDTH * 100}%`);
    petSpeech.style.top = `max(60px, ${(pet.y - 48) / HEIGHT * 100}%)`;
  }

  function drawWhitePet() {
    if (!petRescued || !player) return;
    const { x, y, facing } = whitePetPose();
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(-facing, 1);
    drawDragon(0, 0, 42, Math.sin(elapsed * 13) * 3, whiteDragonColors);
    ctx.restore();
    if (petShieldTime <= 0) return;
    const centerX = player.x + player.w / 2;
    const centerY = player.y + player.h / 2;
    ctx.save();
    ctx.fillStyle = "#b2eeff30";
    ctx.strokeStyle = "#d6f8ff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, player.w / 2 + 15, player.h / 2 + 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    for (let i = 0; i < 4; i++) {
      const angle = elapsed * 4 + i * Math.PI / 2;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(centerX + Math.cos(angle) * 33 - 2, centerY + Math.sin(angle) * 37 - 2, 4, 4);
    }
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#203f49";
    ctx.fillRect(centerX - 50, player.y + player.h + 10, 100, 20);
    ctx.fillStyle = "#e4faff";
    ctx.fillText(`Bảo hộ ${petShieldTime.toFixed(1)}s`, centerX, player.y + player.h + 24);
    ctx.restore();
  }

  function drawWorld() {
    ctx.save();
    ctx.translate(-Math.round(cameraX), 0);

    for (const [kind, x] of currentLevel.structures ?? []) {
      if (x >= cameraX - 120 && x <= cameraX + WIDTH + 120) drawStructure(kind, x);
    }
    for (const block of currentLevel.platforms) drawPlatform(block);
    for (const obstacle of currentLevel.hazards) drawHazard(obstacle);
    drawCheckpoint();
    drawPetCage();
    drawWeaponPickups();
    drawGoal(currentLevel.goal);
    for (const coin of levelCoins) if (!coin.collected) drawCoin(coin);
    for (const enemy of enemies) {
      drawEnemy(enemy);
      if (freezeTime > 0) {
        const box = enemyRect(enemy);
        ctx.fillStyle = "#a1e8ff60";
        ctx.fillRect(box.x, box.y, box.w, box.h);
      }
    }
    for (const shot of enemyShots) {
      ctx.fillStyle = shot.kind === "fire" ? "#b3374c" : "#658bb1";
      ctx.fillRect(shot.x - 8, shot.y - 6, 16, 12);
      ctx.fillStyle = shot.kind === "fire" ? "#ff944e" : "#d5edfc";
      ctx.fillRect(shot.x - 5, shot.y - 5, 10, 10);
      ctx.fillStyle = shot.kind === "fire" ? "#ffe493" : "#fffaff";
      ctx.fillRect(shot.x - 3, shot.y - 3, 5, 5);
    }

    if (player && (player.invulnerable <= 0 || Math.floor(elapsed * 12) % 2 === 0)) {
      drawHero(player);
    }
    if (shieldTime > 0) {
      ctx.strokeStyle = "#ffde76";
      ctx.lineWidth = 2;
      ctx.strokeRect(Math.round(player.x - 5), Math.round(player.y - 5), player.w + 10, player.h + 8);
    }
    drawWhitePet();
    if (activeMathFence) drawMathFence();
    if (state === "rescuing") drawRescueHeart(currentLevel.goal);

    ctx.restore();
  }

  function drawMathFence() {
    const x = Math.round(player.x + player.w / 2) - 36;
    const height = Math.round(Math.min(1, (performance.now() - activeMathFence.raisedAt) / 220) * 85);
    const top = GROUND_Y - height;
    ctx.fillStyle = "#232234";
    ctx.fillRect(x - 3, GROUND_Y - 7, 81, 8);
    for (let offset = 0; offset <= 72; offset += 12) {
      ctx.fillStyle = "#35374d";
      ctx.fillRect(x + offset, top, 6, height);
      ctx.fillStyle = "#a2a6c3";
      ctx.fillRect(x + offset + 1, top, 2, height);
    }
    ctx.fillStyle = "#666486";
    ctx.fillRect(x - 2, top, 81, 5);
    ctx.fillStyle = "#f6cd76";
    ctx.fillRect(x + 33, GROUND_Y - Math.round(height * 0.55), 10, 9);
  }

  function drawStructure(kind, x) {
    const floor = GROUND_Y;
    if (kind === "house") {
      const snow = currentLevel.weather === "winter";
      ctx.fillStyle = "#564556";
      ctx.fillRect(x - 57, floor - 99, 114, 99);
      ctx.fillStyle = "#ad836f";
      ctx.fillRect(x - 50, floor - 91, 100, 91);
      drawPixelShape("#7e4e5d", [[x - 70, floor - 90], [x - 34, floor - 128], [x - 21, floor - 128],
        [x - 4, floor - 150], [x + 11, floor - 150], [x + 69, floor - 90]]);
      if (snow) {
        drawPixelShape("#dceff4", [[x - 64, floor - 94], [x - 34, floor - 128], [x - 21, floor - 128],
          [x - 4, floor - 150], [x + 11, floor - 150], [x + 29, floor - 132], [x + 10, floor - 135],
          [x - 26, floor - 111], [x - 39, floor - 112], [x - 51, floor - 94]]);
      }
      ctx.fillStyle = "#614858";
      ctx.fillRect(x - 13, floor - 52, 27, 52);
      for (const side of [-37, 24]) {
        ctx.fillStyle = "#efc181";
        ctx.fillRect(x + side, floor - 66, 16, 20);
        ctx.fillStyle = "#825963";
        ctx.fillRect(x + side + 7, floor - 66, 2, 20);
      }
      ctx.fillStyle = "#deb57c";
      ctx.fillRect(x + 7, floor - 27, 4, 4);
      return;
    }
    if (kind === "waterfall") {
      drawPixelShape("#506f82", [[x - 78, floor + 20], [x - 78, floor - 130], [x - 68, floor - 130],
        [x - 68, floor - 187], [x - 56, floor - 187], [x - 56, floor - 226], [x - 43, floor - 226],
        [x - 43, floor - 239], [x + 43, floor - 239], [x + 43, floor - 219], [x + 60, floor - 219],
        [x + 60, floor - 167], [x + 74, floor - 167], [x + 74, floor + 20]]);
      ctx.fillStyle = "#6c8a94";
      ctx.fillRect(x - 57, floor - 216, 16, 8);
      ctx.fillRect(x + 43, floor - 188, 17, 7);
      ctx.fillRect(x - 65, floor - 120, 28, 8);
      ctx.fillStyle = "#5398ac";
      ctx.fillRect(x - 34, floor - 224, 68, 245);
      ctx.fillStyle = "#86d1d6";
      ctx.fillRect(x - 30, floor - 222, 19, 237);
      ctx.fillRect(x + 16, floor - 215, 14, 226);
      ctx.fillStyle = "#d1f2e8";
      for (let index = 0; index < 13; index++) {
        const offset = (index * 41 + elapsed * (112 + index * 3)) % 216;
        ctx.fillRect(x - 29 + index * 21 % 59, floor - 221 + offset, 4, 12 + index % 4 * 4);
      }
      ctx.fillRect(x - 48, floor - 3, 96, 5);
      ctx.fillRect(x - 34, floor - 8, 23, 6);
      ctx.fillRect(x + 18, floor - 7, 18, 5);
      return;
    }
    if (kind === "lantern") {
      ctx.fillStyle = "#49374d";
      ctx.fillRect(x - 5, floor - 120, 10, 120);
      ctx.fillRect(x - 4, floor - 120, 28, 6);
      drawLantern(x + 20, floor - 100);
      return;
    }
    if (kind === "pier") {
      ctx.fillStyle = "#44374d";
      ctx.fillRect(x - 52, floor - 48, 13, 104);
      ctx.fillRect(x + 40, floor - 48, 13, 104);
      ctx.fillRect(x - 52, floor - 47, 105, 8);
      drawLantern(x - 46, floor - 64);
      drawLantern(x + 46, floor - 64);
      return;
    }

    const top = kind === "tower" ? floor - 225 : floor - 160;
    ctx.fillStyle = "#485374";
    for (const side of [x - 58, x + 35]) {
      ctx.fillRect(side, top, 23, floor - top);
      ctx.fillStyle = "#687296";
      ctx.fillRect(side, top, 5, floor - top);
      for (let y = top + 14; y < floor; y += 20) ctx.fillRect(side + 5, y, 18, 2);
      ctx.fillStyle = "#485374";
    }
    ctx.fillRect(x - 65, top, 130, 24);
    for (let i = x - 65; i < x + 64; i += 29) ctx.fillRect(i, top - 12, 14, 13);
    ctx.fillStyle = "#69779b";
    ctx.fillRect(x - 65, top + 23, 130, 4);
    if (kind === "tower") {
      ctx.fillStyle = "#303c60";
      ctx.fillRect(x - 35, top + 27, 70, 91);
      drawLantern(x, top + 60);
    }
    drawLantern(x - 31, floor - 81);
    drawLantern(x + 31, floor - 81);
  }

  function drawLantern(x, y) {
    ctx.fillStyle = "#ffbd6240";
    ctx.fillRect(x - 15, y - 12, 30, 26);
    ctx.fillStyle = "#513b4a";
    ctx.fillRect(x - 7, y - 9, 14, 18);
    ctx.fillStyle = "#ffd78e";
    ctx.fillRect(x - 4, y - 5, 8, 10);
  }

  function drawWeaponPickups() {
    for (const pickup of currentLevel.weapons ?? []) {
      if (collectedWeapons.has(pickup.type)) continue;
      const y = GROUND_Y - 43 + Math.round(Math.sin(elapsed * 4 + pickup.x) * 4);
      ctx.fillStyle = "#1c3647";
      ctx.fillRect(pickup.x - 18, y - 17, 36, 34);
      ctx.strokeStyle = "#ffd989";
      ctx.lineWidth = 2;
      ctx.strokeRect(pickup.x - 18, y - 17, 36, 34);
      drawWeaponIcon(pickup.type, pickup.x, y);
    }
  }

  function drawWeaponIcon(type, x, y) {
    ctx.fillStyle = weapons[type].color;
    if (type === "dart") {
      ctx.fillRect(x - 11, y - 2, 22, 4);
      ctx.fillRect(x - 2, y - 10, 4, 20);
      ctx.fillRect(x - 5, y - 5, 10, 10);
    } else if (type === "sword") {
      ctx.fillRect(x - 2, y - 12, 4, 17);
      ctx.fillStyle = "#ecb459";
      ctx.fillRect(x - 7, y + 4, 14, 3);
      ctx.fillRect(x - 2, y + 7, 4, 5);
    } else {
      ctx.fillRect(x - 5, y - 11, 7, 3);
      ctx.fillRect(x + 1, y - 9, 5, 5);
      ctx.fillRect(x + 5, y - 5, 4, 11);
      ctx.fillRect(x + 1, y + 5, 5, 5);
      ctx.fillRect(x - 5, y + 9, 7, 3);
      ctx.fillStyle = "#f5ecd3";
      ctx.fillRect(x - 6, y - 9, 2, 20);
    }
  }

  function drawCheckpoint() {
    const point = currentLevel.checkpoint;
    ctx.fillStyle = "#3e3025";
    ctx.fillRect(point.x, GROUND_Y - 66, 5, 66);
    ctx.fillStyle = respawnPoint === point ? "#ffd34d" : "#b6d2c7";
    ctx.fillRect(point.x + 5, GROUND_Y - 64, 33, 20);
    ctx.fillStyle = "#29423a";
    ctx.fillRect(point.x + 17, GROUND_Y - 59, 9, 9);
  }

  function drawHazard(obstacle) {
    const { kind, x, w } = obstacle;
    if (kind === "mathFence") return;
    if (kind === "swamp") {
      ctx.fillStyle = "#353f27";
      ctx.fillRect(x, GROUND_Y - 3, w, 27);
      ctx.fillStyle = "#5b713b";
      ctx.fillRect(x + 3, GROUND_Y, w - 6, 14);
      ctx.fillStyle = "#89964b";
      for (let i = 8; i < w - 6; i += 22) {
        const bob = Math.round(Math.sin(elapsed * 2 + i) * 2);
        ctx.fillRect(x + i, GROUND_Y + 4 + bob, 12, 2);
      }
      for (const edge of [x + 4, x + w - 8]) {
        ctx.fillStyle = "#405b37";
        ctx.fillRect(edge, GROUND_Y - 19, 3, 21);
        ctx.fillRect(edge + 4, GROUND_Y - 12, 2, 15);
        ctx.fillStyle = "#b59755";
        ctx.fillRect(edge - 1, GROUND_Y - 23, 5, 8);
      }
      return;
    }
    if (kind === "flame") {
      const cycle = (elapsed + obstacle.phase) % 4;
      const warning = cycle >= 1.8 && cycle < 2.4;
      const height = hazardHeight(obstacle);
      ctx.fillStyle = "#423839";
      ctx.fillRect(x, GROUND_Y - 8, w, 12);
      ctx.fillStyle = warning ? "#ffb24f" : "#7c5350";
      ctx.fillRect(x + 4, GROUND_Y - 6, w - 8, 5);
      for (let i = 7; i < w - 8; i += 13) {
        const flicker = Math.round(Math.sin(elapsed * 24 + i) * 5);
        if (height > 4) {
          drawPixelShape("#e85432", [[x + i - 4, GROUND_Y - 5], [x + i - 2, GROUND_Y - height * 0.6],
            [x + i + 3, GROUND_Y - height + flicker], [x + i + 9, GROUND_Y - height * 0.5], [x + i + 10, GROUND_Y - 5]]);
          drawPixelShape("#ffd16b", [[x + i, GROUND_Y - 5], [x + i + 4, GROUND_Y - height * 0.65], [x + i + 7, GROUND_Y - 5]]);
        } else if (warning) {
          ctx.fillStyle = "#ffda80";
          ctx.fillRect(x + i, GROUND_Y - 15 - Math.abs(flicker), 3, 4);
        }
      }
      return;
    }
    if (kind === "arrow" || kind === "fallingRock") {
      const cycle = (elapsed + obstacle.phase) % 3.6;
      ctx.fillStyle = cycle >= 0.65 && cycle < 1.4 ? "#ffd37e" : "#657295";
      ctx.fillRect(x, GROUND_Y - 4, w, 5);
      const projectile = trapProjectile(obstacle);
      if (!projectile) return;
      if (kind === "arrow") {
        ctx.fillStyle = "#f9e7ba";
        ctx.fillRect(projectile.x + 4, projectile.y + 4, 4, 18);
        ctx.fillRect(projectile.x + 2, projectile.y + 4, 8, 4);
        ctx.fillRect(projectile.x + 5, projectile.y, 2, 5);
      } else {
        ctx.fillStyle = "#807a96";
        ctx.fillRect(projectile.x + 4, projectile.y, 20, 4);
        ctx.fillRect(projectile.x, projectile.y + 4, 28, 16);
        ctx.fillRect(projectile.x + 5, projectile.y + 20, 18, 4);
        ctx.fillStyle = "#ae9db3";
        ctx.fillRect(projectile.x + 6, projectile.y + 4, 10, 5);
      }
      return;
    }
    if (kind === "trapdoor") {
      if (openTrapdoors.has(x)) {
        ctx.fillStyle = "#241e25";
        ctx.fillRect(x, GROUND_Y, w, HEIGHT - GROUND_Y);
        for (let i = x + 2; i + 11 < x + w; i += 12) {
          drawPixelShape("#d5c5bc", [[i, HEIGHT], [i + 5, TRAPDOOR_SPIKE_Y], [i + 11, HEIGHT]]);
        }
      } else {
        ctx.fillStyle = "#593f35";
        ctx.fillRect(x, GROUND_Y - 5, w, 11);
        ctx.fillStyle = "#b98a61";
        for (let i = x + 7; i + 13 < x + w; i += 22) ctx.fillRect(i, GROUND_Y - 4, 13, 2);
      }
      return;
    }
    if (kind === "steam") {
      ctx.fillStyle = "#5d5150";
      ctx.fillRect(x, GROUND_Y - 5, w, 11);
      const height = hazardHeight(obstacle);
      ctx.fillStyle = "#ffd293";
      for (let i = x + 6; i + 7 < x + w; i += 12) {
        ctx.fillRect(i, GROUND_Y - 6, 7, 4);
        if (height > 4) ctx.fillRect(i, GROUND_Y - height, 5, height - 4);
      }
      return;
    }
    if (kind === "spikes" || kind === "trap") {
      const height = spikeHeight(obstacle);
      ctx.fillStyle = kind === "trap" ? "#b86e3c" : "#40313b";
      ctx.fillRect(x, GROUND_Y - 5, w, 5);
      if (kind === "trap") {
        ctx.fillStyle = "#ffe087";
        for (let i = x + 6; i < x + w - 5; i += 12) ctx.fillRect(i, GROUND_Y - 4, 6, 2);
      }
      if (height <= 4) return;
      for (let i = x; i < x + w; i += 14) {
        const end = Math.min(i + 14, x + w);
        const peak = (i + end) / 2;
        drawPixelShape("#302d39", [[i, GROUND_Y - 4], [peak, GROUND_Y - height], [end, GROUND_Y - 4]]);
        drawPixelShape("#e2dfd7", [[i + 2, GROUND_Y - 6], [peak, GROUND_Y - height + 4], [peak + 2, GROUND_Y - 6]]);
      }
      return;
    }

    const colors = {
      water: ["#174761", "#4b9fc0", "#90d9dc"],
      crevasse: ["#162d43", "#48667a", "#a3dbe7"],
      lava: ["#ac352a", "#f18136", "#ffca58"],
    }[kind];
    const surface = GROUND_Y + 14;
    ctx.fillStyle = colors[0];
    ctx.fillRect(x, GROUND_Y, w, HEIGHT - GROUND_Y);
    ctx.fillStyle = colors[1];
    ctx.fillRect(x, surface, w, 5);
    ctx.fillStyle = colors[2];
    for (let i = x + 6; i + 18 < x + w; i += 24) {
      const y = surface + 6 + Math.round(Math.sin(elapsed * 4 + i) * 3);
      ctx.fillRect(i, y, 14, 2);
    }
  }

  function drawRescueHeart(goal) {
    const x = Math.round((player.x + player.w / 2 + goal.x + 44) / 2);
    const y = GROUND_Y - HERO_HEIGHT - 44 - Math.round(Math.sin(rescueTime * 6) * 4);
    drawHeart(x, y);
  }

  function drawHeart(x, y) {
    drawPixelShape("#51263f", [[x, y + 5], [x + 5, y], [x + 13, y], [x + 17, y + 5], [x + 17, y + 13],
      [x, y + 28], [x - 17, y + 13], [x - 17, y + 5], [x - 13, y], [x - 5, y]]);
    drawPixelShape("#f77593", [[x, y + 9], [x + 6, y + 3], [x + 12, y + 3], [x + 14, y + 7],
      [x + 14, y + 12], [x, y + 24], [x - 14, y + 12], [x - 14, y + 7], [x - 11, y + 3], [x - 6, y + 3]]);
    ctx.fillStyle = "#ffd4dc";
    ctx.fillRect(x - 11, y + 6, 5, 3);
  }

  function drawPlatform(block) {
    const isSnow = currentLevel.weather === "winter";
    const isSpringBank = currentLevel.weather === "spring" && block.kind === "ground";
    const colors = {
      log: ["#be8855", "#804c36", "#5c382f"],
      stone: ["#b3ae9e", "#756e70", "#514750"],
      bridge: ["#d4ab75", "#77523c", "#8e6747"],
      brick: ["#ba9b84", "#7b635c", "#695451"],
      ice: ["#e8faff", "#7dbece", "#56889d"],
    }[block.kind];
    const [topColor, edgeColor, soilColor] = colors ?? (isSnow
      ? ["#edf6e5", "#b6d3cf", "#76523b"]
      : isSpringBank ? ["#a3c88e", "#688559", "#78566b"]
        : currentLevel.weather === "autumn" ? ["#dc984d", "#a76a36", "#7d543e"]
        : currentLevel.weather === "night" ? ["#688b87", "#405e6d", "#494760"]
        : ["#67cf4f", "#2a7b3f", "#76523b"]);

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
    if (isSpringBank) {
      const origin = block.x + 18;
      const start = origin + Math.max(0, Math.floor((cameraX - origin) / 96)) * 96;
      const end = Math.min(block.x + block.w - 12, cameraX + WIDTH + 12);
      for (let x = start; x < end; x += 96) {
        ctx.fillStyle = "#647b55";
        ctx.fillRect(x + 2, block.y - 6, 2, 7);
        ctx.fillRect(x + 9, block.y - 3, 2, 4);
        ctx.fillStyle = "#f7a9c8";
        ctx.fillRect(x, block.y - 8, 6, 4);
        ctx.fillRect(x + 8, block.y - 4, 5, 3);
        ctx.fillStyle = "#ffe2eb";
        ctx.fillRect(x + 2, block.y - 7, 2, 2);
      }
    }
  }

  function drawCoin(coin) {
    const bob = Math.sin(elapsed * 5 + coin.x * 0.03) * 4;
    const x = Math.round(coin.x);
    const y = Math.round(coin.y + bob);
    ctx.fillStyle = "#4f3a14";
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffcc35";
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff08a";
    ctx.fillRect(x - 5, y - 5, 3, 8);
    ctx.fillStyle = "#c58324";
    ctx.fillRect(x + 3, y - 3, 3, 8);
  }

  function drawGoal(goal) {
    if (goal.princess) {
      const towerX = goal.x - 24;
      const roofY = 268;
      const towerWidth = 134;
      const doorX = goal.x + 12;
      ctx.fillStyle = "#251b24";
      ctx.fillRect(towerX, roofY, towerWidth, GROUND_Y - roofY);
      ctx.fillStyle = "#705455";
      ctx.fillRect(towerX + 6, roofY + 12, towerWidth - 12, GROUND_Y - roofY - 12);
      ctx.fillStyle = "#493841";
      for (let row = 0; row < 7; row++) {
        const y = roofY + 29 + row * 26;
        ctx.fillRect(towerX + 6, y, towerWidth - 12, 2);
        for (let x = towerX + 20 + (row % 2) * 16; x < towerX + towerWidth - 8; x += 32) {
          ctx.fillRect(x, y - 17, 2, 17);
        }
      }
      ctx.fillStyle = "#31232c";
      ctx.fillRect(towerX - 5, roofY, towerWidth + 10, 15);
      ctx.fillRect(towerX - 5, roofY - 14, 19, 14);
      ctx.fillRect(towerX + towerWidth - 14, roofY - 14, 19, 14);
      ctx.fillStyle = "#a17a70";
      ctx.fillRect(towerX + 14, roofY, towerWidth - 28, 4);
      ctx.fillStyle = "#28232a";
      ctx.fillRect(towerX + 56, roofY + 43, 22, 36);
      ctx.fillRect(doorX + 8, GROUND_Y - 104, 48, 104);
      ctx.fillRect(doorX, GROUND_Y - 94, 64, 94);
      ctx.fillStyle = "#3d2a32";
      ctx.fillRect(doorX + 10, GROUND_Y - 85, 44, 85);
      drawPrincess(goal.x + 44, GROUND_Y);
      drawDragon(towerX + towerWidth / 2, roofY);
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

  function drawPrincess(x, feetY, bridal = false) {
    const y = feetY - HERO_HEIGHT;
    if (bridal) {
      ctx.fillStyle = "#c995ad";
      ctx.fillRect(x - 17, y + 4, 34, 31);
      ctx.fillStyle = "#fff8f6";
      ctx.fillRect(x - 15, y + 4, 30, 29);
    }
    ctx.fillStyle = "#241b25";
    ctx.fillRect(x - 12, y + 8, 24, 32);
    ctx.fillRect(x - 15, y + 32, 30, 14);
    ctx.fillStyle = "#f5c89b";
    ctx.fillRect(x - 8, y + 10, 16, 14);
    ctx.fillStyle = "#f3cc49";
    ctx.fillRect(x - 9, y + 4, 18, 5);
    ctx.fillRect(x - 9, y, 4, 4);
    ctx.fillRect(x - 2, y, 4, 4);
    ctx.fillRect(x + 5, y, 4, 4);
    ctx.fillStyle = "#39272b";
    ctx.fillRect(x - 5, y + 15, 2, 3);
    ctx.fillRect(x + 3, y + 15, 2, 3);
    ctx.fillStyle = bridal ? "#fff6f2" : "#cf5b79";
    ctx.fillRect(x - 9, y + 24, 18, 12);
    ctx.fillRect(x - 13, y + 35, 26, 10);
    ctx.fillStyle = bridal ? "#eebdd2" : "#f6a7bb";
    ctx.fillRect(x - 4, y + 26, 8, 17);
    ctx.fillStyle = "#26342d";
    ctx.fillRect(x - 10, feetY - 3, 8, 3);
    ctx.fillRect(x + 2, feetY - 3, 8, 3);
  }

  function drawDragon(x, feetY, size = HERO_HEIGHT * 2, wingLift = 0, colors = redDragonColors) {
    ctx.save();
    ctx.translate(x - size / 2, feetY - size);
    ctx.scale(size / 32, size / 32);

    ctx.save();
    ctx.translate(0, wingLift);
    drawPixelShape(colors.outline, [[13, 17], [13, 10], [17, 5], [23, 2], [22, 9], [28, 7], [26, 15], [30, 14], [26, 23], [19, 25]]);
    drawPixelShape(colors.wing, [[15, 16], [15, 11], [21, 5], [20, 12], [25, 10], [23, 17], [27, 17], [24, 21], [19, 22]]);
    drawPixelShape(colors.wingLight, [[16, 14], [20, 8], [18, 16], [23, 13], [21, 19], [17, 21]]);
    ctx.restore();
    drawPixelShape(colors.outline, [[19, 23], [25, 27], [28, 25], [29, 20], [32, 18], [32, 26], [29, 30], [24, 32], [17, 31]]);
    drawPixelShape(colors.tail, [[21, 25], [25, 29], [29, 27], [31, 22], [31, 26], [28, 29], [24, 31], [19, 30]]);

    // Horned head, long muzzle, curved neck and tucked legs.
    drawPixelShape(colors.outline, [[2, 10], [5, 8], [6, 5], [6, 0], [10, 4], [12, 3], [14, 0], [14, 6], [16, 10], [16, 16], [20, 18], [23, 22], [23, 28], [20, 32], [5, 32], [5, 28], [8, 25], [9, 17], [5, 16], [1, 15], [0, 12]]);
    drawPixelShape(colors.body, [[2, 12], [7, 9], [8, 6], [12, 5], [14, 9], [14, 17], [20, 20], [21, 24], [20, 29], [17, 30], [7, 30], [10, 26], [11, 15], [5, 14], [2, 14]]);
    drawPixelShape(colors.belly, [[11, 16], [13, 16], [12, 23], [15, 27], [12, 29], [8, 29], [10, 26]]);
    drawPixelShape(colors.horn, [[7, 1], [10, 5], [8, 6], [7, 5]]);
    drawPixelShape(colors.horn, [[13, 2], [13, 6], [11, 5]]);
    ctx.fillStyle = colors.eye;
    ctx.fillRect(8, 8, 4, 3);
    ctx.fillStyle = colors.outline;
    ctx.fillRect(8, 8, 1, 3);
    ctx.fillRect(3, 11, 2, 1);
    ctx.fillRect(4, 14, 6, 1);
    ctx.fillRect(16, 25, 5, 2);
    ctx.fillStyle = colors.foot;
    ctx.fillRect(15, 29, 5, 2);
    ctx.restore();
  }

  function drawPixelShape(color, points) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(...points[0]);
    for (const point of points.slice(1)) ctx.lineTo(...point);
    ctx.closePath();
    ctx.fill();
  }

  function drawHero(hero, heldWeapon = "sword") {
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
    ctx.fillRect(x + 5, y + 45 + Math.min(0, step), 12, 3);
    ctx.fillRect(x + 18, y + 45 - Math.max(0, step), 12, 3);
    if (hero.inSwamp) {
      ctx.fillStyle = "#68783d";
      ctx.fillRect(x + 5, y + 44, 25, 4);
    }

    if (!heldWeapon) return;
    ctx.save();
    ctx.translate(x + (hero.facing > 0 ? 27 : 7), y + 34);
    ctx.scale(hero.facing, 1);
    if (heldWeapon !== "sword") {
      ctx.translate(9, -5);
      ctx.scale(1.2, 1.2);
      drawWeaponIcon(heldWeapon, 0, 0);
      ctx.fillStyle = "#f1c39d";
      ctx.fillRect(-6, 1, 5, 4);
      ctx.restore();
      return;
    }
    const swinging = hero === player && !arena && hero.swingTime > 0;
    const swingPhase = swinging ? 1 - hero.swingTime / MAP_SWING_DURATION : 0;
    const swordAngle = Math.PI / 5 + (swinging ? Math.sin(swingPhase * Math.PI * 2) * 1.35 : 0);
    if (swinging) {
      ctx.strokeStyle = "#dcfaff99";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 34, swordAngle - Math.PI / 2 - 0.6, swordAngle - Math.PI / 2 + 0.1);
      ctx.stroke();
    }
    ctx.rotate(swordAngle);
    ctx.fillStyle = "#16272b";
    ctx.fillRect(-4, -29, 8, 28);
    ctx.fillRect(-2, -32, 4, 3);
    ctx.fillRect(-8, -6, 16, 6);
    ctx.fillRect(-3, 0, 6, 10);
    ctx.fillStyle = "#cce5e9";
    ctx.fillRect(-2, -27, 4, 22);
    ctx.fillRect(-1, -30, 2, 3);
    ctx.fillStyle = "#86aebb";
    ctx.fillRect(1, -25, 1, 20);
    ctx.fillStyle = "#eab659";
    ctx.fillRect(-6, -4, 12, 3);
    ctx.fillRect(-2, 7, 4, 2);
    ctx.fillStyle = "#955c39";
    ctx.fillRect(-1, -1, 2, 8);
    ctx.restore();
  }

  function drawEnemy(enemy) {
    ctx.save();
    if (enemy.facing < 0) {
      ctx.translate(Math.round(enemy.x) * 2, 0);
      ctx.scale(-1, 1);
    }
    drawEnemySprite(enemy);
    ctx.restore();
  }

  function drawEnemySprite(enemy) {
    const x = Math.round(enemy.x);
    const y = Math.round(enemy.y);

    if (enemy.type === "snowman") {
      ctx.fillStyle = "#5d7591";
      ctx.fillRect(x - 14, y - 19, 28, 19);
      ctx.fillRect(x - 11, y - 37, 23, 20);
      ctx.fillStyle = "#eef9fc";
      ctx.fillRect(x - 11, y - 17, 22, 14);
      ctx.fillRect(x - 8, y - 34, 17, 13);
      ctx.fillStyle = "#2d374f";
      ctx.fillRect(x - 8, y - 44, 16, 8);
      ctx.fillRect(x - 12, y - 37, 24, 4);
      ctx.fillRect(x + 5, y - 30, 3, 3);
      ctx.fillRect(x + 2, y - 13, 3, 3);
      ctx.fillStyle = "#ee9160";
      ctx.fillRect(x + 7, y - 26, 9, 3);
      ctx.fillStyle = "#c45469";
      ctx.fillRect(x - 10, y - 22, 21, 5);
      ctx.fillRect(x - 9, y - 17, 5, 9);
      if (enemy.windup > 0) {
        ctx.fillStyle = "#88afca";
        ctx.fillRect(x + 11, y - 36, 13, 12);
        ctx.fillStyle = "#fffaff";
        ctx.fillRect(x + 13, y - 34, 9, 8);
      }
      return;
    }

    if (enemy.type === "spider") {
      const step = Math.floor(enemyTime * 10) % 2 * 3;
      ctx.fillStyle = "#777ca1";
      for (let leg = 0; leg < 3; leg++) {
        const offset = leg * 4;
        ctx.fillRect(x - 21 + offset, y - 9 - offset, 5, 7 + step);
        ctx.fillRect(x + 16 - offset, y - 8 - offset, 5, 10 - step);
      }
      ctx.fillStyle = "#19182b";
      ctx.fillRect(x - 14, y - 20, 23, 15);
      ctx.fillRect(x + 4, y - 14, 13, 10);
      ctx.fillStyle = "#525471";
      ctx.fillRect(x - 10, y - 18, 12, 4);
      ctx.fillStyle = "#fb7287";
      ctx.fillRect(x + 10, y - 12, 3, 3);
      ctx.fillRect(x + 14, y - 11, 2, 2);
      return;
    }

    if (enemy.type === "plant") {
      const jaw = enemy.windup > 0 || Math.sin(enemyTime * 5) > 0 ? 4 : 0;
      ctx.fillStyle = "#204631";
      ctx.fillRect(x - 13, y - 7, 26, 7);
      ctx.fillRect(x - 4, y - 27, 9, 25);
      ctx.fillStyle = "#65a357";
      ctx.fillRect(x - 10, y - 15, 10, 5);
      ctx.fillRect(x + 4, y - 11, 12, 5);
      ctx.fillStyle = "#513249";
      ctx.fillRect(x - 14, y - 42, 29, 16);
      ctx.fillRect(x - 9, y - 28 + jaw, 24, 8);
      ctx.fillStyle = "#cf6583";
      ctx.fillRect(x - 11, y - 39, 24, 8);
      ctx.fillRect(x - 6, y - 25 + jaw, 18, 4);
      ctx.fillStyle = "#f9e4b8";
      ctx.fillRect(x + 1, y - 30, 4, 5);
      ctx.fillRect(x + 9, y - 30, 4, 4);
      if (enemy.windup > 0) {
        ctx.fillStyle = "#ff9e55";
        ctx.fillRect(x + 11, y - 34, 8, 7);
        ctx.fillStyle = "#ffe493";
        ctx.fillRect(x + 14, y - 33, 4, 4);
      }
      return;
    }

    if (enemy.type === "boar") {
      const step = Math.floor(enemyTime * 8) % 2 * 3;
      ctx.fillStyle = "#352631";
      ctx.fillRect(x - 22, y - 25, 39, 19);
      ctx.fillRect(x - 12, y - 29, 24, 8);
      ctx.fillRect(x - 17, y - 9, 7, 9 - step);
      ctx.fillRect(x + 9, y - 9, 7, 6 + step);
      ctx.fillStyle = "#9b684e";
      ctx.fillRect(x - 18, y - 22, 29, 12);
      ctx.fillRect(x + 12, y - 18, 11, 9);
      ctx.fillStyle = "#f1e1b7";
      ctx.fillRect(x + 15, y - 12, 4, 9);
      ctx.fillRect(x + 19, y - 14, 3, 3);
      ctx.fillStyle = "#ffbb71";
      ctx.fillRect(x + 11, y - 20, 3, 3);
      return;
    }

    if (enemy.type === "ghost") {
      ctx.fillStyle = "#a6badb65";
      ctx.fillRect(x - 18, y - 15, 36, 32);
      ctx.fillStyle = "#ece4f6";
      ctx.fillRect(x - 10, y - 19, 20, 5);
      ctx.fillRect(x - 15, y - 14, 30, 28);
      ctx.fillRect(x - 14, y + 12, 6, 6);
      ctx.fillRect(x - 3, y + 10, 6, 6);
      ctx.fillRect(x + 8, y + 12, 6, 6);
      ctx.fillStyle = "#514663";
      ctx.fillRect(x - 8, y - 5, 4, 6);
      ctx.fillRect(x + 4, y - 5, 4, 6);
      ctx.fillRect(x - 2, y + 5, 4, 4);
      return;
    }

    if (enemy.type === "zombie") {
      const step = Math.sin(enemyTime * 7 + enemy.phase) > 0 ? 3 : 0;
      ctx.fillStyle = "#262736";
      ctx.fillRect(x - 11, y - 40, 23, 20);
      ctx.fillRect(x - 10, y - 23, 20, 14);
      ctx.fillRect(x - 11, y - 11, 8, 11 - step);
      ctx.fillRect(x + 3, y - 11, 8, 8 + step);
      ctx.fillStyle = "#839d60";
      ctx.fillRect(x - 8, y - 36, 17, 13);
      ctx.fillRect(x + 3, y - 24, 16, 6);
      ctx.fillStyle = "#a17074";
      ctx.fillRect(x - 8, y - 22, 14, 12);
      ctx.fillStyle = "#eff1b7";
      ctx.fillRect(x + 3, y - 33, 4, 3);
      return;
    }

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

    const pulse = Math.round(Math.sin(enemyTime * 7 + enemy.phase) * 3);
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
    ctx.fillRect(x + 9, y - 9, 4, 3);
  }

  function drawWeather(weather = currentLevel.rain ? "rain" : currentLevel.weather) {
    if (weather === "autumn") {
      ctx.save();
      ctx.strokeStyle = "#fff1cf";
      ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        const progress = (elapsed * 0.25 + i * 0.21) % 1;
        const x = -180 + progress * (WIDTH + 360);
        const y = 94 + i * 73 + Math.sin(elapsed + i) * 14;
        ctx.globalAlpha = Math.sin(progress * Math.PI) * 0.3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + 60, y - 12, x + 128, y);
        ctx.quadraticCurveTo(x + 165, y + 7, x + 153, y - 12);
        ctx.stroke();
      }
      ctx.restore();
    }
    for (const particle of particles) {
      const x = Math.round(particle.x);
      const y = Math.round(particle.y);
      const size = Math.ceil(particle.size);
      ctx.fillStyle = particle.color;
      if (weather === "rain") {
        // Short slanted streaks leave the platforms and hazards readable.
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = particle.size > 3 ? 1.5 : 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 3, y + 8 + size * 2);
        ctx.stroke();
        if (y > GROUND_Y && y < GROUND_Y + 15) {
          ctx.fillRect(x - 4, GROUND_Y + 2, 3, 1);
          ctx.fillRect(x + 2, GROUND_Y + 1, 3, 1);
        }
      } else if (weather === "spring") {
        ctx.fillRect(x, y, size + 2, 3);
        ctx.fillRect(x + 1, y - 2, size, 6);
      } else if (weather === "summer") {
        const pulse = Math.round(2 + Math.sin(elapsed * 3 + particle.phase));
        ctx.fillRect(x - pulse, y, pulse * 2 + 1, 1);
        ctx.fillRect(x, y - pulse, 1, pulse * 2 + 1);
      } else if (weather === "autumn") {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(elapsed * 1.7 + particle.phase);
        drawPixelShape(particle.color, [[-size - 1, 0], [-2, -size], [size + 2, -2], [size, 3], [-1, size]]);
        ctx.fillStyle = "#81502d";
        ctx.fillRect(-size - 3, 0, size + 5, 1);
        ctx.restore();
      } else if (weather === "winter") {
        ctx.fillRect(x, y, size, size);
        if (size >= 4) {
          ctx.fillRect(x - 2, y + 1, size + 4, 2);
          ctx.fillRect(x + 1, y - 2, 2, size + 4);
        }
      } else if (weather === "night") {
        ctx.fillRect(x, y, 2, 2);
      } else {
        ctx.fillRect(x, y, 2, 5);
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
    if (state === "playing") jumpBuffer = 0.13;
  }

  function requestSwordSwing() {
    if (state !== "playing" || arena || player.swingTime > 0) return;
    // Cosmetic only: no hitbox, projectile, enemy damage or weapon purchase.
    player.swingTime = MAP_SWING_DURATION;
  }

  function handleKeyDown(event) {
    if (shopDialog.open || chatDialog.open || dragonDialogue.open || petDialogue.open || mathDialog.open) return;
    if (event.target.closest?.("input, textarea, [contenteditable='true']")) return;
    if ((event.code === "Enter" || event.code === "NumpadEnter") && state === "playing" &&
        !event.target.closest?.("button, a")) {
      event.preventDefault();
      if (!event.repeat) requestSwordSwing();
      return;
    }
    if (event.code === "KeyC" && state === "playing" && !event.repeat) {
      event.preventDefault();
      openChat();
      return;
    }
    if (arena && weaponKeys[event.code] && !event.repeat) {
      attackDragon(weaponKeys[event.code]);
      return;
    }
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
    const steps = Math.max(1, Math.ceil(dt * 120));
    for (let step = 0; step < steps; step++) update(dt / steps);
    render();
    requestAnimationFrame(gameLoop);
  }

  primaryButton.addEventListener("click", () => {
    if (buttonAction === "start" || buttonAction === "restart") startGame();
    else if (buttonAction === "next") nextLevel();
  });
  shopButton.addEventListener("click", openShop);
  chatButton.addEventListener("click", openChat);
  document.getElementById("cancelChatButton").addEventListener("click", () => chatDialog.close());
  chatForm.addEventListener("submit", sendChat);
  weddingReplay.addEventListener("click", startGame);
  dialogueNext.addEventListener("click", advanceDragonPact);
  petNext.addEventListener("click", advancePetDialogue);
  petDialogue.addEventListener("cancel", (event) => event.preventDefault());
  dragonDialogue.addEventListener("cancel", (event) => event.preventDefault());
  mathForm.addEventListener("submit", submitMathAnswer);
  mathDialog.addEventListener("cancel", (event) => event.preventDefault());
  for (const button of shopItems) {
    button.addEventListener("click", () => buyItem(button.dataset.item));
  }
  for (const button of battleButtons) {
    button.addEventListener("click", () => attackDragon(button.dataset.weapon));
  }

  window.addEventListener("keydown", handleKeyDown, { passive: false });
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener("blur", clearControls);

  bindTouchControls();
  loadLevel(0, false);
  state = "menu";
  requestAnimationFrame(gameLoop);
})();
