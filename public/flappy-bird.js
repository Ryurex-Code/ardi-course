class FlappyBird {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('highScore');
        this.startBtn = document.getElementById('startBtn');
        this.restartBtn = document.getElementById('restartBtn');
        
        // Game state
        this.gameState = 'menu'; // menu, playing, gameOver
        this.score = 0;
        this.highScore = localStorage.getItem('flappyBirdHighScore') || 0;
        this.highScoreElement.textContent = this.highScore;
        
        // Bird properties
        this.bird = {
            x: 80,
            y: this.canvas.height / 2,
            width: 30,
            height: 30,
            velocity: 0,
            gravity: 0.5,
            jumpPower: -8,
            rotation: 0
        };
        
        // Pipe properties
        this.pipes = [];
        this.pipeWidth = 60;
        this.pipeGap = 150;
        this.pipeSpacing = 200;
        this.pipeSpeed = 2;
        
        // Game settings
        this.groundY = this.canvas.height - 50;
        this.ceilingY = 50;
        
        // Animation
        this.animationId = null;
        this.lastTime = 0;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.drawMenu();
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.restartBtn.addEventListener('click', () => this.restartGame());
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (this.gameState === 'playing') {
                    this.jump();
                } else if (this.gameState === 'menu') {
                    this.startGame();
                } else if (this.gameState === 'gameOver') {
                    this.restartGame();
                }
            }
        });
        
        // Mouse/touch controls
        this.canvas.addEventListener('click', () => {
            if (this.gameState === 'playing') {
                this.jump();
            } else if (this.gameState === 'menu') {
                this.startGame();
            } else if (this.gameState === 'gameOver') {
                this.restartGame();
            }
        });
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.gameState === 'playing') {
                this.jump();
            } else if (this.gameState === 'menu') {
                this.startGame();
            } else if (this.gameState === 'gameOver') {
                this.restartGame();
            }
        });
    }
    
    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.scoreElement.textContent = this.score;
        this.pipes = [];
        this.resetBird();
        this.startBtn.style.display = 'none';
        this.restartBtn.style.display = 'none';
        this.gameLoop();
    }
    
    restartGame() {
        this.startGame();
    }
    
    resetBird() {
        this.bird.y = this.canvas.height / 2;
        this.bird.velocity = 0;
        this.bird.rotation = 0;
    }
    
    jump() {
        this.bird.velocity = this.bird.jumpPower;
    }
    
    updateBird() {
        this.bird.velocity += this.bird.gravity;
        this.bird.y += this.bird.velocity;
        
        // Update rotation based on velocity
        this.bird.rotation = Math.min(Math.PI / 2, Math.max(-Math.PI / 4, this.bird.velocity * 0.1));
        
        // Check ground collision
        if (this.bird.y + this.bird.height > this.groundY) {
            this.bird.y = this.groundY - this.bird.height;
            this.gameOver();
        }
        
        // Check ceiling collision
        if (this.bird.y < this.ceilingY) {
            this.bird.y = this.ceilingY;
            this.bird.velocity = 0;
        }
    }
    
    createPipe() {
        const gapY = Math.random() * (this.canvas.height - this.pipeGap - 200) + 100;
        
        this.pipes.push({
            x: this.canvas.width,
            topHeight: gapY,
            bottomY: gapY + this.pipeGap,
            passed: false
        });
    }
    
    updatePipes() {
        // Create new pipes
        if (this.pipes.length === 0 || 
            this.canvas.width - this.pipes[this.pipes.length - 1].x >= this.pipeSpacing) {
            this.createPipe();
        }
        
        // Update existing pipes
        for (let i = this.pipes.length - 1; i >= 0; i--) {
            const pipe = this.pipes[i];
            pipe.x -= this.pipeSpeed;
            
            // Remove pipes that are off screen
            if (pipe.x + this.pipeWidth < 0) {
                this.pipes.splice(i, 1);
                continue;
            }
            
            // Check if bird passed the pipe
            if (!pipe.passed && pipe.x + this.pipeWidth < this.bird.x) {
                pipe.passed = true;
                this.score++;
                this.scoreElement.textContent = this.score;
                
                // Update high score
                if (this.score > this.highScore) {
                    this.highScore = this.score;
                    this.highScoreElement.textContent = this.highScore;
                    localStorage.setItem('flappyBirdHighScore', this.highScore);
                }
            }
        }
    }
    
    checkCollisions() {
        const birdRight = this.bird.x + this.bird.width;
        const birdLeft = this.bird.x;
        const birdTop = this.bird.y;
        const birdBottom = this.bird.y + this.bird.height;
        
        for (const pipe of this.pipes) {
            const pipeLeft = pipe.x;
            const pipeRight = pipe.x + this.pipeWidth;
            
            // Check if bird is within pipe's x range
            if (birdRight > pipeLeft && birdLeft < pipeRight) {
                // Check collision with top pipe
                if (birdTop < pipe.topHeight) {
                    this.gameOver();
                    return;
                }
                
                // Check collision with bottom pipe
                if (birdBottom > pipe.bottomY) {
                    this.gameOver();
                    return;
                }
            }
        }
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        cancelAnimationFrame(this.animationId);
        this.restartBtn.style.display = 'inline-block';
        this.drawGameOver();
    }
    
    drawBird() {
        this.ctx.save();
        this.ctx.translate(this.bird.x + this.bird.width / 2, this.bird.y + this.bird.height / 2);
        this.ctx.rotate(this.bird.rotation);
        
        // Bird body
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillRect(-this.bird.width / 2, -this.bird.height / 2, this.bird.width, this.bird.height);
        
        // Bird eye
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(this.bird.width / 4, -this.bird.height / 4, 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Bird wing
        this.ctx.fillStyle = '#FFA500';
        this.ctx.fillRect(-this.bird.width / 3, 0, this.bird.width / 2, this.bird.height / 3);
        
        this.ctx.restore();
    }
    
    drawPipes() {
        this.ctx.fillStyle = '#228B22';
        
        for (const pipe of this.pipes) {
            // Top pipe
            this.ctx.fillRect(pipe.x, 0, this.pipeWidth, pipe.topHeight);
            
            // Bottom pipe
            this.ctx.fillRect(pipe.x, pipe.bottomY, this.pipeWidth, this.canvas.height - pipe.bottomY);
            
            // Pipe caps
            this.ctx.fillStyle = '#006400';
            this.ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, this.pipeWidth + 10, 20);
            this.ctx.fillRect(pipe.x - 5, pipe.bottomY, this.pipeWidth + 10, 20);
            this.ctx.fillStyle = '#228B22';
        }
    }
    
    drawGround() {
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(0, this.groundY, this.canvas.width, this.canvas.height - this.groundY);
        
        // Grass on top of ground
        this.ctx.fillStyle = '#228B22';
        this.ctx.fillRect(0, this.groundY - 10, this.canvas.width, 10);
    }
    
    drawBackground() {
        // Sky gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#98FB98');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Clouds
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.drawCloud(50, 80, 40);
        this.drawCloud(200, 60, 30);
        this.drawCloud(350, 100, 35);
    }
    
    drawCloud(x, y, size) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.arc(x + size * 0.8, y, size * 0.8, 0, Math.PI * 2);
        this.ctx.arc(x + size * 1.6, y, size * 0.6, 0, Math.PI * 2);
        this.ctx.arc(x + size * 0.4, y - size * 0.3, size * 0.7, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawMenu() {
        this.drawBackground();
        this.drawGround();
        
        // Menu text
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Flappy Bird', this.canvas.width / 2, this.canvas.height / 2 - 50);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText('Click Start or Press SPACE', this.canvas.width / 2, this.canvas.height / 2 + 20);
        
        this.ctx.font = '18px Arial';
        this.ctx.fillText(`High Score: ${this.highScore}`, this.canvas.width / 2, this.canvas.height / 2 + 60);
    }
    
    drawGameOver() {
        // Semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Game over text
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2 - 50);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2);
        
        this.ctx.font = '18px Arial';
        this.ctx.fillText('Click Restart or Press SPACE', this.canvas.width / 2, this.canvas.height / 2 + 40);
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawBackground();
        this.drawPipes();
        this.drawGround();
        this.drawBird();
    }
    
    update() {
        if (this.gameState === 'playing') {
            this.updateBird();
            this.updatePipes();
            this.checkCollisions();
        }
    }
    
    gameLoop(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update();
        this.draw();
        
        if (this.gameState === 'playing') {
            this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new FlappyBird();
});