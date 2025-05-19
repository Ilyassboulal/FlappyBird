//Dichiaro la variabile contenente il canvas, ovvero il foglio su cui disegnerò
const canvas = document.getElementById('gameCanvas');
//Il foglio è a 2 dimensioni
const ctx = canvas.getContext('2d');

canvas.width = 320;
canvas.height = 480;

let birdY = 200;
let birdVelocity = 0;
let gravity = 0.5;
let lift = -8;
let isJumping = false;
let obstacles = [];
let gameSpeed = 3;
let gameScore = 0;
let gameOver = false;

let highScore = localStorage.getItem('flappyHighScore') || 0;

//Listner dell'evento keydown. Tutte le volte che viene cliccato un tasto, scatta l'evento.
document.addEventListener('keydown', () => {
  if (!gameOver) {
    birdVelocity = lift;
  }
});

// Crea un ostacolo ogni 2 secondi
setInterval(() => {
  if (!gameOver) createObstacle();
}, 2000);

//Funzione che crea gli ostacoli con un'apertura di 150px
function createObstacle() {
  const gap = 150;
  const topObstacleHeight = Math.floor(Math.random() * (canvas.height - gap - 100)) + 50;
  const bottomObstacleHeight = canvas.height - topObstacleHeight - gap;

//Inserisco ogni ostacolo creato all'interno di un Array
  obstacles.push({
    x: canvas.width,
    topHeight: topObstacleHeight,
    bottomHeight: bottomObstacleHeight,
  });
}

//Aggiorna il gioco
function updateGame() {
  if (gameOver) return;

  //Aggiorna Velocità di caduta e posizione verticale del quadratino che simula l'uccello
  birdVelocity += gravity;
  birdY += birdVelocity;

  //La posizione non può superare i limiti del rettangolo di gioco
  if (birdY < 0) birdY = 0;
  if (birdY > canvas.height - 20) birdY = canvas.height - 20;

  //Ciclo gli ostacoli presenti aggiornando la posizione orizzontale; se l'ostacolo ha superato il limite del rettangolo di gioco, aggiorno il punteggio
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].x -= gameSpeed;

    if (obstacles[i].x + 20 < 0) {
      obstacles.splice(i, 1);
      gameScore++;
      if (gameScore > highScore) {
        highScore = gameScore;
        localStorage.setItem('flappyHighScore', highScore);
      }
    }
  }

  //Se l'uccello tocca un ostacolo termino il gioco
  for (let i = 0; i < obstacles.length; i++) {
    if (birdY < obstacles[i].topHeight || birdY > canvas.height - obstacles[i].bottomHeight) {
      if (obstacles[i].x < 60 && obstacles[i].x + 20 > 40) {
        triggerGameOver();
      }
    }
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //Disegno il rettangolino che rappresenta l'uccello
  ctx.fillStyle = '#FF0';
  ctx.fillRect(40, birdY, 20, 20);

  //Disegno gli ostacoli
  for (let i = 0; i < obstacles.length; i++) {
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(obstacles[i].x, 0, 20, obstacles[i].topHeight);
    ctx.fillRect(obstacles[i].x, canvas.height - obstacles[i].bottomHeight, 20, obstacles[i].bottomHeight);
  }

  //Disegno le info del gioco
  ctx.fillStyle = '#000';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + gameScore, 10, 30);
  ctx.fillText('High Score: ' + highScore, 10, 55);

  //Richiamo la funzione javascript che permette al browser di eseguire l'animazione
  requestAnimationFrame(updateGame);
}

//Termino il gioco visualizzando il punteggio finale
function triggerGameOver() {
  gameOver = true;

  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#FFF';
  ctx.font = '30px Arial';
  ctx.fillText('Game Over!', 80, canvas.height / 2 - 20);
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + gameScore, 110, canvas.height / 2 + 10);
  ctx.fillText('High Score: ' + highScore, 95, canvas.height / 2 + 35);
  ctx.fillText('Restarting...', 95, canvas.height / 2 + 60);

  requestAnimationFrame(triggerGameOver);

  //Ricarico la pagina e faccio ripartire il gioco dopo 3 secondi
  setTimeout(() => {
    document.location.reload();
  }, 3000);
}

updateGame();
