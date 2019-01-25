const express = require('express');
const socket = require('socket.io');

const app = express();

app.use(express.static(__dirname + './../build'));
const port = process.env.PORT || 5001
server = app.listen(port, function () {
    console.log('server is running on port ', port)
});

app.get("*", (req, res) => {
    res.sendFile(__dirname + './../build', 'index.html');
});

io = socket(server);

io.on('connection', (socket) => {
    console.log(socket.id);

    socket.on('SEND_MESSAGE', function (data) {
        io.emit('RECEIVE_MESSAGE', data);
    })
});

