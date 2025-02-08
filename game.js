// Used for capturing real-time user input
const readline = require("readline");


const WIDTH = 20;
const HEIGHT = 20;
const EMPTY = " ";
const PLANE = "^";
const BULLET = "|";
const ALIEN = "W";

let planeX = Math.floor(WIDTH / 2);
let bullets = [];
let aliens = [{ x: Math.floor(Math.random() * WIDTH), y: 0 }];
let gameOver = false;

// Setup Readline for Keypress Events
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

// Draw Game
function draw() {
    console.clear();
    let screen = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(EMPTY));

    // Draw Bullets
    bullets.forEach((bullet) => {
        if (bullet.y >= 0) screen[bullet.y][bullet.x] = BULLET;
    });

    // Draw Aliens
    aliens.forEach((alien) => {
        if (alien.y < HEIGHT) screen[alien.y][alien.x] = ALIEN;
    });

    // Draw Fighter Plane
    screen[HEIGHT - 1][planeX] = PLANE;

    // Render Screen
    screen.forEach((row) => console.log(row.join("")));
    console.log("\nMove: A/D | Fire: Space | Exit: Ctrl+C");
}

// Update Game State
function update() {
    // Move bullets
    bullets = bullets.map((bullet) => ({ ...bullet, y: bullet.y - 1 })).filter((bullet) => bullet.y >= 0);

    // Move aliens
    aliens.forEach((alien) => alien.y++);

    // Collision Detection
    bullets.forEach((bullet, bulletIndex) => {
        aliens.forEach((alien, alienIndex) => {
            if (bullet.x === alien.x && bullet.y === alien.y) {
                // Remove alien & bullet on collision
                aliens.splice(alienIndex, 1);
                bullets.splice(bulletIndex, 1);
            }
        });
    });

    // Check if an alien reaches the bottom (Game Over)
    if (aliens.some((alien) => alien.y >= HEIGHT - 1)) {
        console.clear();
        console.log("💀 GAME OVER! The aliens invaded! 💀");
        process.exit();
    }

    // Add new aliens randomly
    if (Math.random() < 0.1) {
        aliens.push({ x: Math.floor(Math.random() * WIDTH), y: 0 });
    }
}

// Handle Key Presses
process.stdin.on("keypress", (str, key) => {
    // Move left
    if (key.name === "a" && planeX > 0) planeX--; 
     // Move right
    if (key.name === "d" && planeX < WIDTH - 1) planeX++;
     // Fire bullet
    if (key.name === "space") bullets.push({ x: planeX, y: HEIGHT - 2 });
    // Exit game
    if (key.ctrl && key.name === "c") process.exit(); 
});

// Game Loop
function gameLoop() {
    if (gameOver) return;
    update();
    draw();
    setTimeout(gameLoop, 200);
}

gameLoop();
