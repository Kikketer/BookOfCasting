var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path')
var names = require('./names')
var phrases = require('./phrases')

let currentEggIndex = 0

app.use(express.static(path.resolve('public')))

app.post('/cast', function(req, res) {
  let phrase = ''
  let type = req.query.type
  const name = req.query.name
  if(type === 'egg') {
    phrase = phrases.egg[currentEggIndex]
    io.emit('cast', phrase)
    currentEggIndex++
    if(currentEggIndex > phrases.egg.length - 1) {
      currentEggIndex = 0
    }
    return
  }
  if(!phrases[type] || !phrases[type].length) {
    console.log('Got an unexpected spell: ', type)
    type = 'unexpected'
  }

  phrase = phrases[type][Math.floor(Math.random() * phrases[type].length)]
  phrase = phrase.replace(/\$\{name\}/gi, name)
  // {spell: req.query.spell, name: req.query.name}
  io.emit('cast', phrase)
  res.send(`Cast ${phrase}`)
})

app.get('/configuration', function(req, res) {
  res.send({
    phrases: Object.keys(phrases).filter(val => phrases[val].length),
    names: names
  })
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