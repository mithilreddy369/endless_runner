const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const stats = {
    highScore: 0,
    todayHighScore: 0,
    lastScore: 0,
    gamesPlayed: 0
};

let player = {
    x: 50,
    y: canvas.height - 30,
    width: 30,
    height: 30,
    color: '#0095DD',
    speed: 2
};

let obstacles = [];
const obstacleSpeed = 2;

let liveScore = 0; // Variable to track live score

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
    ctx.fillStyle = '#FF0000';
    for (const obstacle of obstacles) {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
}

function movePlayer() {
    player.x += player.speed;

    if (player.x > canvas.width) {
        player.x = 0 - player.width;
    }
}

function moveObstacles() {
    for (const obstacle of obstacles) {
        obstacle.y += obstacleSpeed;
        if (obstacle.y > canvas.height) {
            obstacle.y = 0 - obstacle.height;
            obstacle.x = Math.random() * (canvas.width - obstacle.width);
        }
    }
}

function checkCollision() {
    for (const obstacle of obstacles) {
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            endGame();
        }
    }
}

function updateStats() {
    document.getElementById('highScore').textContent = formatNumberWithCommas(stats.highScore);
    document.getElementById('gamesPlayed').textContent = formatNumberWithCommas(stats.gamesPlayed);
}

// Helper function to format numbers with commas
function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function endGame() {
    // Update stats
    stats.lastScore = liveScore; // Update with live score
    stats.gamesPlayed++;
    if (liveScore > stats.highScore) {
        stats.highScore = liveScore;
    }
    if (liveScore > stats.todayHighScore) {
        stats.todayHighScore = liveScore;
    }

    // Update the stats display
    updateStats();

    // Reset player and obstacles
    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height - 50;
    liveScore = 0; // Reset live score

    // Trigger a new game immediately
    startNewGame();
}

function startNewGame() {
    // Create initial obstacles
    obstacles = [];
    for (let i = 0; i < 15; i++) {
        obstacles.push({
            x: Math.random() * (canvas.width - 20),
            y: Math.random() * -canvas.height, // Reset y-coordinate to a position above the canvas
            width: 20,
            height: 20
        });
    }

    // Update stats
    stats.lastScore = 0;

    // Update the stats display
    updateStats();
}


function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movePlayer();
    moveObstacles();
    drawPlayer();
    drawObstacles();
    checkCollision();

    // Update live score based on player's movement
    liveScore += Math.abs(player.speed); // Adjust as needed

    // Update live score display
    document.getElementById('currentScore').textContent = liveScore;

    // Continue the game loop
    requestAnimationFrame(gameLoop);
}

// Resize canvas when the window is resized
window.addEventListener('resize', resizeCanvas);

// Start the game
resizeCanvas();
startNewGame();
gameLoop();
