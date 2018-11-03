var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path')

app.use(express.static(path.resolve('public')))

app.post('/cast', function(req, res) {
  io.emit('cast', req.query.spell)
  res.send(`Cast ${req.query.spell}`)
})

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function() {
    console.log('the user has disconnected')
  })
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});