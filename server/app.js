var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path')
var names = require('./names')
var phrases = require('./phrases')
var _ = require('lodash')

let currentEggIndex = 0
const specificSpellTypes = ['egg', 'fail', 'unexpected', 'generic', 'wandyes', 'wandno']
let castPerWizard = {}
names.forEach(name => castPerWizard[name] = {})
const finalPhrase = 'You have mastered this spell ${name}'

app.use(express.static(path.resolve('client')))

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

  if(!castPerWizard[name][type]) {
    castPerWizard[name][type] = []
  }

  // Don't do special logic for the specific spell types
  if(specificSpellTypes.includes(type)) {
    phrase = phrases[type][Math.floor(Math.random() * phrases[type].length)]
  } else {
    const availablePhrases = _.difference(phrases[type], castPerWizard[name][type])

    if (availablePhrases.length) {
      phrase = availablePhrases[Math.floor(Math.random() * availablePhrases.length)]
      castPerWizard[name][type].push(phrase)
    } else {
      phrase = finalPhrase
    }
  }

  phrase = phrase.replace(/\$\{name\}/gi, name)

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