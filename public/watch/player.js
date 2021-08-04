
// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

height = window.innerHeight - 160;
width = window.innerWidth - 24;

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
var videoplayer;
var newvideoloaded = false;

function createPlayer(videoId) {
    player = new YT.Player('player', {
        height: height,
        width: width,
        videoId: videoId,
        playerVars: {
            'playsinline': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        },
        playerVars: {
            'origin': 'localhost:3000',
            'enablejsapi': 1
        }
    });
}

function onYouTubeIframeAPIReady() {

    createPlayer('M7lc1UVf-VE'); // youtube developer video for example

}

window.onresize = (event) => {
    videoplayer.player.setSize(window.innerWidth - 24, window.innerHeight - 160);
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();

    videoplayer = {

        // data property
        firstName: 'myname',
        player: player,

        // accessor property(getter)
        get currentTime() {
            return this.player.getCurrentTime()
        },

        //accessor property(setter)
        set currentTime(playSeconds) {
            return this.player.seekTo(playSeconds)
        },

        get videoData() {
            return this.player.getVideoData()
        },

        set videoURL(uri) {
            return this.player.loadVideoByUrl(uri)
        },

        set videoID(ID) {
            return this.player.loadVideoById(ID)
        },

        get play() {
            return this.player.playVideo()
        },

        get pause() {
            return this.player.pauseVideo()
        }
    };
    // videoplayer object ends here
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        playerState("playing");
        if (newvideoloaded) { // everything after new video loaded will be done here.
            setTitles();
            activateDeactivateInfo(true);
            chatArea.classList.toggle("active");
            setTimeout(() => {
                chatIcon.classList.toggle("active");
            }, 500);
            setTimeout(() => {
                activateDeactivateInfo(false);
                chatArea.classList.toggle("active");
                setTimeout(() => {
                    chatIcon.classList.toggle("active");
                }, 500);
            }, 5000);
            newvideoloaded = false;
        }
    }
    else if (event.data == YT.PlayerState.PAUSED) {
        playerState("paused");
        activateDeactivateInfo(true);
        setTimeout(() => {
            activateDeactivateInfo(false);
        }, 5000);
    }
    else if (event.data == YT.PlayerState.BUFFERING) {
        playerState("buffering");
    }
    else if (event.data == YT.PlayerState.UNSTARTED) {
        newvideoloaded = true;
    }
    else if (event.data == YT.PlayerState.ENDED) {
        activateDeactivateInfo(true);
    }
}