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
			var command = frames.mouse(JSON.parse(event.data));
		};
	},

	// In this function we need to follow the mouse so the user can "click on each of the images."
	mouse: function (frame) {
		if (frame.people.length < 1) {
			return null;
		}
		user_x_value = null;
		positions = frame.people[0];

		// We need to follow the curser to see if it is on one of the images!
		var opt1 = document.querySelector('img[src="pics/opt1.png"]');
		var opt3 = document.querySelector('img[src="pics/opt3.png"]');
		var cursor = document.querySelector('.cursor');
		var HAND_RIGHT_X = positions.joints[14].position.x;
		var HAND_RIGHT_Y = positions.joints[14].position.y;

		var pelvis_y = positions.joints[2].position.y;

		var left_elbow_y = positions.joints[6].position.y;
		var chest_y = positions.joints[2].position.y;
		var left_wrist_y = positions.joints[7].position.y;
		var nose_y = positions.joints[27].position.y;
		var right_elbow_y = positions.joints[13].position.y;
		var right_wrist_y = positions.joints[14].position.y;

		if (right_elbow_y < nose_y && right_wrist_y < nose_y) {
			if (HAND_RIGHT_X > 500) {
				// if (HAND_RIGHT_Y > )
				window.location.href = 'page5.html';
			} else if (HAND_RIGHT_X < -70) {
				window.location.href = 'page5_lower.html';
			}
		}
		// function updateCursor(x) {
		// 	cursor.style.left = HAND_RIGHT_X + 'px';
		// }
		// // the user moved his hand to the left
		// if (HAND_RIGHT_X > 0) {
		// 	updateCursor(5);

		// 	// user_x_value = HAND_RIGHT_X;
		// }
		// // the user moved his hand to the right
		// else if (HAND_RIGHT_X > 0) {
		// 	updateCursor(-5);
		// }

		// If the user
	},

	// In this function we need to pass information to the cursoer function so we can update it every time.
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
