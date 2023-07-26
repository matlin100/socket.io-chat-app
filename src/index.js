const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { generateMessage } = require('./utils/messages')
const Filter = require('bad-words');
const { addUser, removeUser , getUser, getUserInRoom } = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const filter = new Filter();

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, 'public');

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');
  

  socket.on('location message', (msg, callback) => {
    const user = getUser(socket.id)
    io.to(user.room).emit('broadcast', generateMessage(user.userName , msg));
    callback();
  });
 
  socket.on('join', (params, callback) => {
    const { error, user } = addUser(socket.id, params.userName, params.room);
  
    if (user) {
      // Emit 'room' event to the specific socket of the newly logged-in user
      socket.emit('room', { room: user.room, users: getUserInRoom(user.room) });
  
      // Emit 'room' event to all other users in the room except the newly logged-in user
      socket.to(params.room).emit('room', { room: user.room, users: getUserInRoom(user.room) });
  
      socket.join(params.room);
      socket.broadcast.to(params.room).emit('broadcast', generateMessage(user.userName, `welcome to ${params.userName}`));
      callback(null);
    } else {
      return callback(error);
    }
  });
  
  socket.on('chat message', (msg, callback) => {
    if (filter.isProfane(msg)) {
      return callback('Invalid words are not allowed');
    }
    const user = getUser(socket.id)
    io.to(user.room).emit('broadcast', generateMessage(user.userName,  msg) );
    callback(); 
  });
  
  socket.on('disconnect', () => {
    const user = removeUser(socket.id)
    if(user){
      io.to(user.room).emit('room' , { room : user.room,  users: getUserInRoom( user.room) }) 
      io.to(user.room).emit('broadcast', generateMessage(user.userName  ,'left') );
    }
    });

});


server.listen(port, () => {
  console.log('Server running on port ' + port);
});
