var host = 'cpsc484-01.yale.internal:8888';
$(document).ready(function () {
	frames.start();
	twod.start();
});
var positions = [];

var frames = {
	socket: null,

	start: function () {
		var url = 'ws://' + host + '/frames';
		frames.socket = new WebSocket(url);
		frames.socket.onmessage = function (event) {
			var command = frames.get_left_wrist_command(JSON.parse(event.data));
			// if (command !== null) {
			// 	sendWristCommand(command);
			// }
		};
        this.timer_function();
	},

	timer_function: function () {
		var command = 0;
		// no people break

        var score = 0;
        var list = ["pics/opt3.png", "pics/opt3.png"];
        var total_stretches = 2;
        var num = 0;

		var timer_run = false;
		var timer;
		// we check if the user has both of his hands in the air!

        if (!timer_run) {
            var count = 10;
            var succeeded = false;
            timer_run = true;
            timer = setInterval(function () {
                if (positions.length < 1) {
                    return null;
                }
                count--;
                command = -1;
                // console.log("ticking down");
                // Normalize by subtracting the root (pelvis) joint coordinates
                var chest_x = positions.joints[2].position.x;
                var chest_y = positions.joints[2].position.y;
                var chest_z = positions.joints[2].position.z;
                var nose_x = positions.joints[27].position.x;
                var nose_y = positions.joints[27].position.y;
                var nose_z = positions.joints[27].position.z;
                var left_elbow_x = positions.joints[6].position.x;
                var left_elbow_y = positions.joints[6].position.y;
                var left_elbow_z = positions.joints[6].position.z;
                var left_wrist_x = positions.joints[7].position.x;
                var left_wrist_y = positions.joints[7].position.y;
                var left_wrist_z = positions.joints[7].position.z;

                var left_knee_x = positions.joints[19].position.x;
                var left_knee_y = positions.joints[19].position.y;
                var left_knee_z = positions.joints[19].position.z;

                var pelvis_x = positions.joints[0].position.x;
                var pelvis_y = positions.joints[0].position.y;
                var pelvis_z = positions.joints[0].position.z;

                var right_knee_x = positions.joints[23].position.x;
                var right_knee_y = positions.joints[23].position.y;
                var right_knee_z = positions.joints[23].position.z;

                var right_elbow_x = positions.joints[13].position.x;
                var right_elbow_y = positions.joints[13].position.y;
                var right_elbow_z = positions.joints[13].position.z;
                var right_wrist_x = positions.joints[14].position.x;
                var right_wrist_y = positions.joints[14].position.y;
                var right_wrist_z = positions.joints[14].position.z;

                var left_ear_x = positions.joints[29].position.x;
                var right_ear_x = positions.joints[31].position.x;

                var left_ankle_x = positions.joints[20].position.x;
                var left_ankle_y = positions.joints[20].position.y;
                var right_ankle_x = positions.joints[24].position.x;
                var right_ankle_y = positions.joints[24].position.y;

                console.log(left_ankle_y + " " + right_ankle_y);
                // Lower body 1                
                if(nose_x < left_ear_x && nose_x < right_ear_x) {
                    if(
                    (
                        left_ankle_x > right_knee_x && 
                        left_ankle_y < right_knee_y
                    ) ||
                    (
                        right_ankle_x > left_knee_x &&
                        right_ankle_y < left_knee_y
                    )
                    ){
                    console.log("stretch 1");
                    command = 0;
                    }
                }
                else if(nose_x > left_ear_x && nose_x > right_ear_x) {
                    if(
                    (
                        left_ankle_x < right_knee_x && 
                        left_ankle_y > right_knee_y
                    ) ||
                    (
                        right_ankle_x < left_knee_x &&
                        right_ankle_y > left_knee_y
                    )
                    ){
                    console.log("stretch 1");
                    command = 0;
                    }
                }
                
                // console.log(left_wrist_y + " " + left_knee_y + " " + pelvis_y);

                // Lower body 2
                if(nose_x < left_ear_x && nose_x < right_ear_x) {
                    if(
                    (
                        left_knee_y < (right_knee_y - 100)
                    ) ||
                    (
                        right_knee_y < (left_knee_y - 100)
                    )
                    ){
                    console.log("stretch 2");
                    command = 0;
                    }
                }
                else if(nose_x > left_ear_x && nose_x > right_ear_x) {
                    if(
                    (
                        left_knee_y < (right_knee_y - 100)
                    ) ||
                    (
                        right_knee_y < (left_knee_y - 100)
                    )
                    ){
                    console.log("stretch 2");
                    command = 0;
                    }
                }

                  
                if (count === 0) {
                    console.log('DONE');
                    num = num + 1;
                    if (num < total_stretches) {
                        document.getElementById('demo-img').src = list[num];
                        succeeded = false;
                        count = 10;
                        document.getElementById('stretch-timer').innerHTML = count;
                        document.getElementById('stretch-text').innerHTML = "Complete the stretch before time runs out!";
                    } else {
                        timer = 0;
                        clearInterval(timer);
                        timer_run = false;
                        console.log("GG!");
                        // Jump to the next page (page 6)
                        // 
                        // 

                    };
                } else if (count < 0) {
                    clearInterval(timer); // stop the interval
                    timer_run = false;
                } else {
                    document.getElementById('stretch-timer').innerHTML = count;
                    if (command == num) {
                        document.getElementById('stretch-timer').innerHTML = count;
                        document.getElementById('stretch-text').innerHTML = "You did it! Now keep the stretch for 10 more seconds!";
                        if (succeeded == false) {
                            succeeded = true;
                            score = score + count;
                            count = 10;
                            document.getElementById('stretch-timer').innerHTML = count;
                    }
                    } else {
                    // When the timer is equal to 0 we will redirect to a tutorial page
                        }
                }
            }, 1000);
            console.log('TIMER IS STARTED!');
        } else {
            console.log('TIMER IS ALREADY RUNNING!');
        }
	},
    get_left_wrist_command: function (frame) {
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