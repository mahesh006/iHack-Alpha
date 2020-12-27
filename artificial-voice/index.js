const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// view engine
app.use(express.static(path.join(__dirname,'public')));

// routes
app.get('/', (req, res) => res.sendFile(__dirname + '/public/services.html'));
app.get('/game', (req, res) => res.sendFile(__dirname + '/public/game.html'));


app.get('/far', (req, res) => res.sendFile(__dirname + '/public/login.html'));
app.get('/near', (req, res) => res.sendFile(__dirname + '/public/near.html'));


app.get('/learn',(req, res) => res.sendFile(__dirname + '/public/learn.html'));
app.get('/Eslate',(req, res) => res.sendFile(__dirname + '/public/Eslate.html'));

app.get('/normalchatlogin',(req, res) => res.sendFile(__dirname + '/public/normalchatlogin.html'));
app.get('/differentchatlogin',(req, res) => res.sendFile(__dirname + '/public/differentchatlogin.html'));


app.get('/normalchat',(req, res) => res.sendFile(__dirname + '/public/chat.html'));
app.get('/differentchat',(req, res) => res.sendFile(__dirname + '/public/blind.html'));

io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);
    socket.broadcast.to(user.room).emit('message', formatMessage(user.username, msg));
  });

});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));



