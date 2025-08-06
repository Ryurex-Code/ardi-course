# Flappy Bird Game

A classic Flappy Bird game built with HTML5 Canvas, CSS3, and vanilla JavaScript.

## How to Play

1. **Start the Game**: Click the "Start Game" button or press the SPACE bar
2. **Control the Bird**: 
   - Click anywhere on the game area
   - Press the SPACE bar
   - Touch the screen (on mobile devices)
3. **Objective**: Navigate the bird through the pipes without hitting them
4. **Scoring**: Each pipe you pass gives you 1 point
5. **Game Over**: The game ends when you hit a pipe, the ground, or the ceiling

## Features

- **Responsive Design**: Works on desktop and mobile devices
- **High Score Tracking**: Your best score is saved locally
- **Smooth Animations**: 60fps gameplay with smooth bird rotation
- **Beautiful Graphics**: Gradient backgrounds, animated clouds, and detailed sprites
- **Multiple Controls**: Mouse, keyboard, and touch support
- **Game States**: Menu, playing, and game over screens

## Files

- `flappy-bird.html` - Main HTML structure
- `flappy-bird.css` - Styling and responsive design
- `flappy-bird.js` - Game logic and mechanics

## How to Run

1. Open `flappy-bird.html` in any modern web browser
2. The game will load automatically
3. Click "Start Game" to begin playing

## Game Mechanics

- **Bird Physics**: Realistic gravity and jumping mechanics
- **Pipe Generation**: Randomly positioned pipes with consistent gaps
- **Collision Detection**: Precise hit detection for game over conditions
- **Score System**: Points awarded for each pipe passed
- **High Score Persistence**: Uses localStorage to save your best score

## Browser Compatibility

Works in all modern browsers that support:
- HTML5 Canvas
- ES6 Classes
- localStorage API
- requestAnimationFrame

## Controls Summary

- **SPACE** - Jump/Start/Restart
- **Mouse Click** - Jump/Start/Restart  
- **Touch** - Jump/Start/Restart (mobile)

Enjoy playing Flappy Bird! 🐦