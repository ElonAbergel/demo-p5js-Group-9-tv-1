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
		var command = -1;
		// no people break

        var score = 0;
        var list = ["pics/upper1.png", "pics/upper2.png", "pics/upper3.png"];
        var total_stretches = 3;
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

                var head_x = positions.joints[26].position.x;
                var head_y = positions.joints[26].position.y;
                var neck_x = positions.joints[3].position.x;
                var left_hand_y = positions.joints[8].position.y;
                var right_hand_y = positions.joints[15].position.y;

                //           (-700)
                // <-- (1000)      (-1000) -->
                //           (700)

                // Upper body 1
                if (left_elbow_y < chest_y && left_wrist_y < nose_y && left_wrist_x < left_elbow_x) {
                console.log("stretch 1");
                command = 0;
                } else if (right_elbow_y < chest_y && right_wrist_y < nose_y && right_wrist_x > right_elbow_x) {
                console.log("stretch 1");
                command = 0;
                }

                // console.log(left_elbow_y + " " + chest_y + " " + left_wrist_y + " " + nose_y + " " + left_wrist_x + " " + left_elbow_x);
                // console.log(left_wrist_x);
                
                // Upper body 2
                if(nose_x < left_ear_x && nose_x < right_ear_x) {
                    if(
                    left_elbow_x < pelvis_x &&
                    right_elbow_x < pelvis_x &&
                    left_wrist_x < pelvis_x &&
                    right_wrist_x < pelvis_x &&
                    left_elbow_y > chest_y &&
                    right_elbow_y > chest_y &&
                    left_wrist_y > chest_y &&
                    right_wrist_y > chest_y &&
                    left_wrist_x < left_elbow_x &&
                    right_wrist_x < right_ear_x
                    ) {
                    console.log("stretch 2");
                    command = 1;
                    }
                }
                else if (nose_x > left_ear_x && nose_x > right_ear_x) {
                    if(
                    left_elbow_x > pelvis_x &&
                    right_elbow_x > pelvis_x &&
                    left_wrist_x > pelvis_x &&
                    right_wrist_x > pelvis_x &&
                    left_elbow_y < chest_y &&
                    right_elbow_y < chest_y &&
                    left_wrist_y < chest_y &&
                    right_wrist_y < chest_y &&
                    left_wrist_x > left_elbow_x &&
                    right_wrist_x > right_ear_x
                    ) {
                    console.log("stretch 2");
                    command = 1;
                    }
                }

                // upper body 3
                    console.log("1");
                if((head_x < neck_x && right_hand_y < head_y) || (head_x > neck_x && left_hand_y < head_y)){
                    console.log("stretch 3");
                    command = 2;
                }

                // console.log(head_x + " " + neck_x + " " + right_hand_y + " " + head_y);

                if((head_x < neck_x && right_hand_y < head_y) || (head_x > neck_x && left_hand_y < head_y)){
                    console.log("stretch 3");
                    command = 2;
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
                        var old = null;
                            gitDownload({
                                owner: 'ElonAbergel',
                                repo: 'demo-p5js-Group-9-tv-1',
                                name: 'ranking_data.txt',
                                token: TOKEN
                            }).then(res => {
                                old = atob(res.content);
                                old = JSON.parse(old);
                                // $('#rank-list').html(
                                //     old.map((item, index) => {
                                //         return `<li>${item}</li>`;
                                //     }).join('')
                                // );
                                console.log("score: " + score);
                                old.push(score);
                                gitUpload({
                                    owner: 'ElonAbergel',
                                    repo: 'demo-p5js-Group-9-tv-1',
                                    name: 'ranking_data.txt',
                                    content: btoa(JSON.stringify(old)),
                                    token: TOKEN
                                });
                            });
                        window.location.href = "page8.html";
                        // Jump to the next page (page 6)
                        // 
                        // 
                    };
                } else if (count < 0) {
                    console.log('Counter should not go below 0');
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
                            document.getElementById('player-score').innerHTML = score;
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

var TOKEN = "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"
import { Octokit } from "https://cdn.skypack.dev/@octokit/rest";

function gitUpload(data) {

    // Octokit.js
    // https://github.com/octokit/core.js#readme
    const octokit = new Octokit({
        auth: TOKEN
    });

    gitDownload({
        owner: data.owner,
        repo: data.repo,
        name: data.name,
        token: TOKEN
    }).then(res => {
        
        octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
            owner: data.owner,
            repo: data.repo,
            path: data.name,
            message: "upload score from api",
            branch: 'score_rank',
            content: data.content,
            sha: res.sha,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        }).then(res => {
            console.log(res);
        });
    });
    
}

function gitDownload(data) {
    const queryParams = new URLSearchParams({ ref: "score_rank" }).toString();
    return fetch(
        `https://api.github.com/repos/${data.owner}/${data.repo}/contents/${data.name}?${queryParams}`,
        {
            method: "GET",
            cache: "no-store",
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer ${data.token}`
            },
        }
    ).then((res) => res.json());

}