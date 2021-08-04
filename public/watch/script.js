const socket = io('/');

const offsetDisplay = document.querySelector("#offset-display");
const videoTitle = document.querySelector('.title .video-title');
const videoAuthor = document.querySelector('.title .video-author');
const searchButton = document.querySelector('#searchButton');
const searchBar = document.querySelector('#search');
const iconBG = document.querySelector('.icon-bg');
const infoBody = document.querySelector('.info-body');
const chatArea = document.querySelector('#chatArea');
const chatIcon = document.querySelector('#chatIcon');
const chatBox = document.querySelector('.chat-box');
const msgInput = document.querySelector('#chatInput');


let offset = 2; // number of seconds video delay before reseting

let videoState = '';
let lastPlaySeconds = null;


socket.on('connect', () => {
    console.log("connected to server");

})

socket.emit('username', localStorage.getItem('username') || "Me")


var play_sec;

socket.on('playSeconds', playSeconds => {
    id = socket.id
    play_sec = playSeconds;

    n = videoplayer.currentTime - playSeconds
    stringn = n.toFixed(5);
    offsetDisplay.innerText = stringn + 's';

    if (Math.abs(lastPlaySeconds - playSeconds) > 1) {
        videoplayer.currentTime = playSeconds
        if (n > 10 || n < -10)
            console.log("jump in time: ", n)
    }
    if (n > 0) {
        offsetDisplay.classList.remove('deactivated');
        offsetDisplay.classList.add('activated');
    }
    else if (n < 0) {
        offsetDisplay.classList.remove('activated');
        offsetDisplay.classList.add('deactivated');
    }

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

    if (id != socket.id) {

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

function setTitles() {
    let videoData = videoplayer.videoData;

    videoTitle.innerText = videoData.title;
    videoAuthor.innerText = videoData.author;
}

function uriParser(uri = "") {
    if (uri.includes("youtube")) {
        // https://www.youtube.com/watch?v=shHTYg-rOAg&pp=sAQA
        let splittedURI = uri.split("watch?v=");
        let ID = splittedURI[1].split('&')[0];

        if (ID)
            return ID;
    }
    else if (uri.includes("tu.be")) { // for short url
        let splittedURI = uri.split('tu.be/');
        let ID = splittedURI[1].split('&')[0];

        if (ID)
            return ID;
    }
}

function searchVideo(events, uri = "") {
    if (uri) {
        if (uri.length > 0) {
            videoplayer.videoURL = uri;
        }
    }
    else {
        uri = searchBar.value;
        id = uriParser(uri)

        if (id.length > 0) {
            videoplayer.videoID = id;

            // emit the video id to be recived and played by the other user
            socket.emit('videoID', id);
        }
    }
}

socket.on('videoID', videoID => {
    videoplayer.videoID = videoID;
});

searchBar.addEventListener('keydown', function (e) {
    if (e.keyCode === 13) {
        if (searchBar.value)
            searchVideo();
    }
});

searchButton.onclick = searchVideo;

function toggleInfo(e) {
    infoBody.classList.toggle("active");
    e.currentTarget.classList.toggle("active");
}
function activateDeactivateInfo(value) {
    if (value === true) {
        infoBody.classList.add("active");
        iconBG.classList.add("active");
    }
    else if (value == false) {
        infoBody.classList.remove("active");
        iconBG.classList.remove("active");
    }
}

function createMessageElement() {
    let otherMsgSpan = document.createElement('span');
    let usernameSpan = document.createElement('span');
    usernameSpan.className = "username";
    let messageSpan = document.createElement('span');
    messageSpan.className = "msg";

    return [otherMsgSpan, usernameSpan, messageSpan];
}

function sendMessage(Message) {

    socket.emit('sendMsg', Message);

    msgInput.classList.add('sent');
    setTimeout(() => {
        msgInput.classList.remove('sent');
    }, 500);

    [otherMsgSpan, usernameSpan, messageSpan] = createMessageElement();

    otherMsgSpan.classList.add("chat", "me");

    usernameSpan.textContent = localStorage.getItem("username") || "Me";
    messageSpan.innerText = Message;

    otherMsgSpan.append(usernameSpan, messageSpan);
    chatBox.appendChild(otherMsgSpan);
}

msgInput.addEventListener('keydown', function (e) {
    if (e.keyCode === 13) {
        if (msgInput.value)
            sendMessage(msgInput.value);
        msgInput.value = "";
    }
})

//  Recieve Message
socket.on('rcvMsg', (Message, Username) => {

    [otherMsgSpan, usernameSpan, messageSpan] = createMessageElement();

    otherMsgSpan.classList.add("chat", "other");

    usernameSpan.textContent = Username;
    messageSpan.innerText = Message;

    otherMsgSpan.append(usernameSpan, messageSpan);
    chatBox.appendChild(otherMsgSpan);

    // show chat chatBox
    chatArea.classList.add("active");
    setTimeout(() => {
        chatIcon.classList.add("active");
    }, 500);
});

chatIcon.onclick = (e) => {
    chatArea.classList.toggle("active");
    setTimeout(() => {
        chatIcon.classList.toggle("active");
    }, 500);
}