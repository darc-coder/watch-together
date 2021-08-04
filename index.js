const express = require('express')
const pug = require('pug');
const path = require("path");
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });

const port = process.env.PORT || 3000

var globalSocket = new Set();

app.use(express.static(path.join(__dirname + "/public")))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

io.on('connection', (socket) => {

    socket.on('username', username => {
        socket.username = username;
        console.log(socket.id, socket.username)
    })

    socket.on('myplaySeconds', playSeconds => {
        socket.broadcast.emit('playSeconds', playSeconds);
    })

    socket.on('playerState', (currentState, id) => {
        socket.broadcast.emit('playerState', currentState, id);
    })

    socket.on('sendMsg', (Message) => {
        socket.broadcast.emit('rcvMsg', Message, socket.username);
    })

    socket.on('videoID', (videoID) => {
        socket.broadcast.emit('videoID', videoID);
    })
});


// use params
app.get('/watch', (req, res) => {
    res.sendFile(path.join(__dirname + "/public/watch/watch.html"))
})

server.listen(port, () => {
    console.log(`listening on localhost:${port}`);
});