const socket = io('/');

const offsetDisplay = document.querySelector("#offset-display");

let offset = 2; // number of seconds video delay before reseting

let videoState = '';
let lastPlaySeconds = null;


socket.on('connect', () => {
    console.log("connected to server")
})

var play_sec;

socket.on('playSeconds', playSeconds => {
    id = socket.id
    play_sec = playSeconds;

    if (Math.abs(lastPlaySeconds - playSeconds) > 1) {
        videoplayer.currentTime = playSeconds
        console.log(playSeconds)
    }
    else
        offsetDisplay.innerText = videoplayer.currentTime - playSeconds + 'S';

    lastPlaySeconds = playSeconds;
})

setInterval(() => {
    if (videoState === "playing")
        socket.emit('myplaySeconds', videoplayer.currentTime);
}, 1000); // every 1 seconds emit my current play time


setInterval(() => {
    timebeforeReEmit = true;
}, 500);

function playerState(currentState) {
    console.log("video state", currentState)
    videoState = currentState;

    if (timebeforeReEmit) { // prevent too frequent sending of state
        if (currentState === "playing") {
            socket.emit('playerState', currentState, socket.id);
            timebeforeReEmit = false;
        }

        else if (currentState === "paused") {
            socket.emit('playerState', currentState, socket.id);
            timebeforeReEmit = false;
        }

        else if (currentState === "buffering") {
            socket.emit('playerState', currentState, socket.id);
            timebeforeReEmit = false;
        }
    }
}

let bufferstart = 0;
let freindCurrentState = '';
socket.on('playerState', (currentState, id) => {
    console.log(id, socket.id)
    if (id != socket.id) {
        console.log("from other", currentState)

        if (currentState === "playing") {
            videoplayer.play;
        }

        else if (currentState === "paused") {
            videoplayer.pause;
        }

        else if (currentState === "buffering") {
            // do nothing since buffering can happen also while the video play
            // if buffering and video is paused all users are paused from the above if else statement
        }
    }
})