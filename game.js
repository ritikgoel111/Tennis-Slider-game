var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedHorizontal = 10;
var ballSpeedVertical = 4;

var playerScore = 0;
var computerScore = 0;
const WINNING_SCORE = 5;

var showingWinScreen = false;

var playerPaddleY = 250;
var computerPaddleY = 250;
const paddleWidth = 10;
const paddleHeight = 100;

function calculateMousePos(evt) {
	let rect = canvas.getBoundingClientRect();
	let root = document.documentElement;
	let mouseX = evt.clientX - rect.left - root.scrollLeft;
	let mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x : mouseX,
		y : mouseY
	};
}

function handleMouseClick(evt) {
	if(showingWinScreen) {
		playerScore = 0;
		computerScore = 0;
		showingWinScreen = false;
	}
}

window.onload = () => {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	let framesPerSecond = 30;
	setInterval(() => {
			move();
			draw();	
		}, 1000 / framesPerSecond);

	canvas.addEventListener('mousedown', handleMouseClick);

	canvas.addEventListener('mousemove', evt => {
			let mousePos = calculateMousePos(evt);
			playerPaddleY = mousePos.y - (paddleHeight / 2);
		});
}

function ballReset() {
	if(playerScore >= WINNING_SCORE || computerScore >= WINNING_SCORE) {
		showingWinScreen = true;
	}

	ballSpeedHorizontal = -ballSpeedHorizontal;
	ballX = canvas.width / 2;
	ballY = canvas.height / 2;
}

function computerMovement() {
	let computerPaddleYCenter = computerPaddleY + (paddleHeight / 2);
	if(computerPaddleYCenter < ballY - 35) {
		computerPaddleY = computerPaddleY + 6;
	} else if(computerPaddleYCenter > ballY + 35) {
		computerPaddleY = computerPaddleY - 6;
	}
}

function move() {
	if(showingWinScreen) {
		return;
	}

	computerMovement();

	ballX += ballSpeedHorizontal;
	ballY += ballSpeedVertical;
	
	if(ballX < paddleWidth) {
		if(ballY > playerPaddleY && ballY < playerPaddleY + paddleHeight) {
			ballSpeedHorizontal = -ballSpeedHorizontal;
			let deltaY = ballY - (playerPaddleY + paddleHeight / 2);
			ballSpeedVertical = deltaY * 0.35;
		} else {
			computerScore++;
			ballReset();
		}
	}
	if(ballX > canvas.width - paddleWidth) {
		if(ballY > computerPaddleY && ballY < computerPaddleY + paddleHeight) {
			ballSpeedHorizontal = -ballSpeedHorizontal;

			let deltaY = ballY - (computerPaddleY + paddleHeight / 2);
			ballSpeedVertical = deltaY * 0.35;
		} else {
			playerScore++;
			ballReset();	
		}
	}
	if(ballY < 0) {
		ballSpeedVertical = -ballSpeedVertical;
	}
	if(ballY > canvas.height) {
		ballSpeedVertical = -ballSpeedVertical;
	}
}

function drawNetLine() {
	for(let i = 0; i < canvas.height; i += 40) {
		colorRect((canvas.width / 2) -1, i, 2, 20, 'white');
	}
}

function draw() {
	colorRect(0, 0, canvas.width, canvas.height, 'black');

	if(showingWinScreen) {
		canvasContext.fillStyle = 'yellow';

		if(playerScore >= WINNING_SCORE) {
			canvasContext.fillText("You Won!", canvas.width / 2, 200);
		} else if(computerScore >= WINNING_SCORE) {
			canvasContext.fillText("Computer Won!", canvas.width / 2, 200);
		}

		canvasContext.fillText("Click to Play Again", canvas.width / 2 - 5, 500);
		return;
	}

	drawNetLine();

	colorRect(0, playerPaddleY, paddleWidth, paddleHeight, 'white');

	colorRect(canvas.width - paddleWidth, computerPaddleY, paddleWidth, paddleHeight, 'white');

	colorCircle(ballX, ballY, 10, 'white');

	canvasContext.fillStyle = 'yellow';
	canvasContext.fillText("Your Score  " + playerScore, canvas.width / 4, 100);
	canvasContext.fillText("Computer's Score  " + computerScore, 3 * canvas.width / 4, 100);
}
function colorCircle(centerX, centerY, radius, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
	canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX, topY, width, height);
}
