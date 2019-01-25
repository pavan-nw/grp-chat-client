const express = require('express');
const socket = require('socket.io');
const app = express();

app.use(express.static(__dirname + './../build'));
const port = process.env.PORT || 8090
server = app.listen(port, function () {
    console.log('server is running on port ', port)
});

app.get("*", (req, res) => {
    res.sendFile(__dirname + './../build', 'index.html');
});

io = socket(server);

const msgs = [];

io.on('connection', (socket) => {
    // console.log(socket.id);

    socket.on('SEND_MESSAGE', function (data) {
        msgs.push(data);
        io.emit('RECEIVE_MESSAGE', data);
    })

    // console.log(msgs);
    socket.on('SEND_HISTORY', function (author) {
        const index = msgs.findIndex(msg => msg.author === author);
        // console.log(index);
        if (index !== -1) {
            const myMsgs = msgs.slice(index);
            // console.log('sending history ', myMsgs);
            io.emit('RECIEVE_HISTORY' + author, myMsgs);
        }
    })
});