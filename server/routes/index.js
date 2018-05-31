import express from 'express';
import socket from 'socket.io';


export default (server) => {
    const router = new express.Router();
    const io = socket(server);

    router.get('/', function (req, res) {
        res.render('index', {
            title: 'chat'
        });
    });
    router.get('/react', function (req, res) {
        res.render('react', {
            title: 'chat'
        });
    });

    const tech = io.of('/tech');
    tech.on('connection', (socket) => {
        console.log("connected")
        socket.on('join', (data) => {
            console.log(data)
            socket.userName = data.user;
            socket.join(data.room);
            tech.in(data.room).emit('message', `${data.user} joined ${data.room} room!`);
        })
        socket.on('message', (data) => {
            console.log(`message: ${data.msg}`);
            tech.in(data.room).emit('message', socket.userName+' : '+data.msg);
        });
        socket.on('typing', (data) => {
            console.log(`message: ${data}`);
            socket.broadcast.to(data.room).emit('typing', socket.userName+' : typing...');
        });

        socket.on('user', (data) => {
            console.log(`message: ${data.msg}`);
            tech.in(data.room).emit('message', socket.userName+' : '+data.msg);
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
            tech.emit('message', 'user disconnected');
        })
    })
    return router;
}