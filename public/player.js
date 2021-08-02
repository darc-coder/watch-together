
// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
var videoplayer;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '720',
        width: '1080',
        // videoId: '739tFBZngPQ',
        videoId: 'M7lc1UVf-VE', // youtube developer video for example
        playerVars: {
            'playsinline': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });

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

        get play() {
            return this.player.playVideo()
        },

        get pause() {
            return this.player.pauseVideo()
        }

    };
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        playerState("playing");
    }
    else if (event.data == YT.PlayerState.PAUSED) {
        playerState("paused");
    }
    else if (event.data == YT.PlayerState.BUFFERING) {
        playerState("buffering");
    }
}




