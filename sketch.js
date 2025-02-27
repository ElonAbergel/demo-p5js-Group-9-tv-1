// Adapted from https://p5js.org/examples/interaction-snake-game.html
//
var host = 'cpsc484-01.yale.internal:8888';
$(document).ready(function () {
	frames.start();
	twod.start();
});

var frames = {
	socket: null,

	start: function () {
		var url = 'ws://' + host + '/frames';
		frames.socket = new WebSocket(url);
		frames.socket.onmessage = function (event) {
			var command = frames.timer_function(JSON.parse(event.data));
			if (command !== null) {
				sendWristCommand(command);
			}
		};
	},

	timer_function: function (frame) {
		var command = null;
		// no people break
		if (frame.people.length < 1) {
			return command;
		}

		var left_elbow_y = frame.people[0].joints[6].position.y * -1;
		var chest_y = frame.people[0].joints[2].position.y;
		var left_wrist_y = frame.people[0].joints[7].position.y * -1;
		var nose_y = frame.people[0].joints[27].position.y * -1;
		var left_elbow_y = frame.people[0].joints[13].position.y * -1;
		var left_wrist_y = frame.people[0].joints[14].position.y * -1;

		console.log(left_elbow_y, chest_y);
		if (
			left_elbow_y > chest_y &&
			left_wrist_y > nose_y &&
			right_elbow_y > chest_y &&
			right_wrist_y > nose_y
		) {
			var count = 5;
			var timer = setInterval(function () {
				count--;
				if (count === 0) {
					clearInterval(timer);
				}
				document.getElementById('timer').innerHTML = count;
			}, 1000);
		} else {
			console.log('in the else !');
		}
	},
	get_left_wrist_command: function (frame) {
		var command = null;
		if (frame.people.length < 1) {
			return command;

			// Both hands of user are above head-
			// if this is the case- start trigger timmer to go down 5 to 0
			// else, rest the timer
		}

		// Normalize by subtracting the root (pelvis) joint coordinates
		var chest_x = frame.people[0].joints[2].position.x;
		var chest_y = frame.people[0].joints[2].position.y;
		var chest_z = frame.people[0].joints[2].position.z;
		var nose_x = (frame.people[0].joints[27].position.x - pelvis_x) * -1;
		var nose_y = (frame.people[0].joints[27].position.y - pelvis_y) * -1;
		var nose_z = (frame.people[0].joints[27].position.z - pelvis_z) * -1;
		var left_elbow_x = (frame.people[0].joints[6].position.x - pelvis_x) * -1;
		var left_elbow_y = (frame.people[0].joints[6].position.y - pelvis_y) * -1;
		var left_elbow_z = (frame.people[0].joints[6].position.z - pelvis_z) * -1;
		var left_wrist_x = (frame.people[0].joints[7].position.x - pelvis_x) * -1;
		var left_wrist_y = (frame.people[0].joints[7].position.y - pelvis_y) * -1;
		var left_wrist_z = (frame.people[0].joints[7].position.z - pelvis_z) * -1;

		if (left_wrist_z < 100) {
			return command;
		}

		if (
			left_elbow_y > chest_y &&
			left_wrist_y > nose_y &&
			left_wrist_x > left_elbow_x
		) {
			console.log('yeeeahaa');
		}

		if (left_wrist_x < 200 && left_wrist_x > -200) {
			if (left_wrist_y > 500) {
				command = 73; // UP
			} else if (left_wrist_y < 100) {
				command = 75; // DOWN
			}
		} else if (left_wrist_y < 500 && left_wrist_y > 100) {
			if (left_wrist_x > 200) {
				command = 76; // RIGHT
			} else if (left_wrist_x < -200) {
				command = 74; // LEFT
			}
		}
		return command;
	},
};

var twod = {
	socket: null,

	start: function () {
		var url = 'ws://' + host + '/twod';
		twod.socket = new WebSocket(url);
		twod.socket.onmessage = function (event) {
			twod.show(JSON.parse(event.data));
		};
	},

	show: function (twod) {
		$('.twod').attr('src', 'data:image/pnjpegg;base64,' + twod.src);
	},
};
// // the snake is divided into small segments, which are drawn and edited on each 'draw' call
// let numSegments = 10;
// let direction = 'right';

// const xStart = 0; //starting x coordinate for snake
// const yStart = 250; //starting y coordinate for snake
// const diff = 10;

// let xCor = [];
// let yCor = [];

// let xFruit = 0;
// let yFruit = 0;
// let scoreElem;
// let scoreContainer = document.getElementById('score-container');
// let handContainer = document.getElementById('hand-container');

// let leftArrow = document.getElementById('left-arrow');
// let rightArrow = document.getElementById('right-arrow');
// let upArrow = document.getElementById('up-arrow');
// let downArrow = document.getElementById('down-arrow');

// let startButton = document.getElementById('start-button');
// startButton.addEventListener('click', () => {
// 	window.location.reload();
// });

// function setup() {
// 	let snakeCanvas = createCanvas(windowWidth / 2, windowHeight / 2);
// 	snakeCanvas.parent('canvas-container');
// 	frameRate(3);
// 	stroke(255);
// 	strokeWeight(10);
// 	updateFruitCoordinates();

// 	scoreElem = createDiv('Score = 0');
// 	scoreElem.parent('score-container');
// 	scoreElem.id = 'score';

// 	for (let i = 0; i < numSegments; i++) {
// 		xCor.push(xStart + i * diff);
// 		yCor.push(yStart);
// 	}
// }

// function draw() {
// 	background('#b1d1fc');
// 	for (let i = 0; i < numSegments - 1; i++) {
// 		line(xCor[i], yCor[i], xCor[i + 1], yCor[i + 1]);
// 		stroke('#c1f80a');
// 	}
// 	updateSnakeCoordinates();
// 	updateHandContainer();
// 	checkGameStatus();
// 	checkForFruit();
// }

// /*
//  The segments are updated based on the direction of the snake.
//  All segments from 0 to n-1 are just copied over to 1 till n, i.e. segment 0
//  gets the value of segment 1, segment 1 gets the value of segment 2, and so on,
//  and this results in the movement of the snake.

//  The last segment is added based on the direction in which the snake is going,
//  if it's going left or right, the last segment's x coordinate is increased by a
//  predefined value 'diff' than its second to last segment. And if it's going up
//  or down, the segment's y coordinate is affected.
// */
// function updateSnakeCoordinates() {
// 	for (let i = 0; i < numSegments - 1; i++) {
// 		xCor[i] = xCor[i + 1];
// 		yCor[i] = yCor[i + 1];
// 	}
// 	switch (direction) {
// 		case 'right':
// 			xCor[numSegments - 1] = xCor[numSegments - 2] + diff;
// 			yCor[numSegments - 1] = yCor[numSegments - 2];
// 			break;
// 		case 'up':
// 			xCor[numSegments - 1] = xCor[numSegments - 2];
// 			yCor[numSegments - 1] = yCor[numSegments - 2] - diff;
// 			break;
// 		case 'left':
// 			xCor[numSegments - 1] = xCor[numSegments - 2] - diff;
// 			yCor[numSegments - 1] = yCor[numSegments - 2];
// 			break;
// 		case 'down':
// 			xCor[numSegments - 1] = xCor[numSegments - 2];
// 			yCor[numSegments - 1] = yCor[numSegments - 2] + diff;
// 			break;
// 	}
// }

// function updateHandContainer() {
// 	// set all arrows to white
// 	leftArrow.className = 'left-arrow';
// 	upArrow.className = 'up-arrow';
// 	rightArrow.className = 'right-arrow';
// 	downArrow.className = 'down-arrow';

// 	switch (direction) {
// 		case 'right':
// 			rightArrow.className += ' active-right';
// 			break;
// 		case 'up':
// 			upArrow.className += ' active-up';
// 			break;
// 		case 'left':
// 			leftArrow.className += ' active-left';
// 			break;
// 		case 'down':
// 			downArrow.className += ' active-down';
// 			break;
// 	}
// }

// /*
//  I always check the snake's head position xCor[xCor.length - 1] and
//  yCor[yCor.length - 1] to see if it touches the game's boundaries
//  or if the snake hits itself.
// */
// function checkGameStatus() {
// 	if (
// 		xCor[xCor.length - 1] > width ||
// 		xCor[xCor.length - 1] < 0 ||
// 		yCor[yCor.length - 1] > height ||
// 		yCor[yCor.length - 1] < 0 ||
// 		checkSnakeCollision()
// 	) {
// 		noLoop();
// 		const scoreVal = parseInt(scoreElem.html().substring(8));
// 		scoreElem.html('Game ended! Your score was : ' + scoreVal);
// 	}
// }

// /*
//  If the snake hits itself, that means the snake head's (x,y) coordinate
//  has to be the same as one of its own segment's (x,y) coordinate.
// */
// function checkSnakeCollision() {
// 	const snakeHeadX = xCor[xCor.length - 1];
// 	const snakeHeadY = yCor[yCor.length - 1];
// 	for (let i = 0; i < xCor.length - 1; i++) {
// 		if (xCor[i] === snakeHeadX && yCor[i] === snakeHeadY) {
// 			return true;
// 		}
// 	}
// }

// /*
//  Whenever the snake consumes a fruit, I increment the number of segments,
//  and just insert the tail segment again at the start of the array (basically
//  I add the last segment again at the tail, thereby extending the tail)
// */
// function checkForFruit() {
// 	point(xFruit, yFruit);
// 	if (xCor[xCor.length - 1] === xFruit && yCor[yCor.length - 1] === yFruit) {
// 		const prevScore = parseInt(scoreElem.html().substring(8));
// 		scoreElem.html('Score = ' + (prevScore + 1));
// 		xCor.unshift(xCor[0]);
// 		yCor.unshift(yCor[0]);
// 		numSegments++;
// 		updateFruitCoordinates();
// 	}
// }

// function updateFruitCoordinates() {
// 	/*
//     The complex math logic is because I wanted the point to lie
//     in between 100 and width-100, and be rounded off to the nearest
//     number divisible by 10, since I move the snake in multiples of 10.
//   */

// 	xFruit = floor(random(10, (width - 100) / 10)) * 10;
// 	yFruit = floor(random(10, (height - 100) / 10)) * 10;
// }

// function sendWristCommand(command) {
// 	switch (command) {
// 		case 74:
// 			if (direction !== 'right') {
// 				direction = 'left';
// 			}
// 			break;
// 		case 76:
// 			if (direction !== 'left') {
// 				direction = 'right';
// 			}
// 			break;
// 		case 73:
// 			if (direction !== 'down') {
// 				direction = 'up';
// 			}
// 			break;
// 		case 75:
// 			if (direction !== 'up') {
// 				direction = 'down';
// 			}
// 			break;
// 	}
// 	console.log(direction);
// }
