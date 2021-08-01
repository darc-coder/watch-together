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
    console.log(socket.id)

    socket.on('myplaySeconds', playSeconds => {
        socket.broadcast.emit('playSeconds', playSeconds);
    })

    socket.on('playerState', (currentState, id) => {
        socket.broadcast.emit('playerState', currentState, id);
    })
});


// use params
app.get('/watch', (req, res) => {
    res.sendFile(path.join(__dirname + "/public/watch.html"))
})

server.listen(port, () => {
    console.log(`listening on localhost:${port}`);
});