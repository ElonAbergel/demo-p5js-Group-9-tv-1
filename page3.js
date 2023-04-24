// in this part we want to record the user hand movment
var host = 'cpsc484-01.yale.internal:8888';
var positions = [];
var started = false;

$(document).ready(function () {
	frames.start();
});

var frames = {
	socket: null,

	start: function () {
		console.log('start');
		var url = 'ws://' + host + '/frames';
		frames.socket = new WebSocket(url);
		frames.socket.onmessage = function (event) {
			var command = frames.data_update(JSON.parse(event.data));
		};
		this.mouse();
	},

	// In this function we need to follow the mouse so the user can "click on each of the images."
	mouse: function (frame) {
		if (frame.people.length < 1) {
			return null;
		}
		// We need to follow the curser to see if it is on one of the images!
		var opt1 = document.querySelector('img[src="pics/opt1.png"]');
		var opt3 = document.querySelector('img[src="pics/opt3.png"]');
		var cursor = document.querySelector('.cursor');

		// Set up event listeners for mouseover and mouseout events
		opt1.addEventListener('mouseover', function () {
			cursor.classList.add('pointer');
			setTimeout(function () {
				window.location.href = 'page5.html';
			}, 2000); // Redirect after 2 seconds
		});

		opt1.addEventListener('mouseout', function () {
			cursor.classList.remove('pointer');
		});

		opt3.addEventListener('mouseover', function () {
			cursor.classList.add('pointer');
			setTimeout(function () {
				window.location.href = 'page5_lower.html';
			}, 2000); // Redirect after 2 seconds
		});

		opt3.addEventListener('mouseout', function () {
			cursor.classList.remove('pointer');
		});

		// var HAND_LEFT_X = positions.joints[8].position.x;
		// var HAND_LEFT_Y = positions.joints[8].position.y;
		var HAND_RIGHT_X = positions.joints[15].position.x;
		var HAND_RIGHT_Y = positions.joints[15].position.y;

		function updateCursor(x, y) {
			cursor.style.top = y + 'px';
			cursor.style.left = x + 'px';
		}
		updateCursor(HAND_RIGHT_X, HAND_RIGHT_Y);

		// If the user
	},

	// In this function we need to pass information to the cursoer function so we can update it every time.
	data_update: function (frame) {
		if (frame.people.length < 1) {
			return null;
		}
		positions = frame.people[0];
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
