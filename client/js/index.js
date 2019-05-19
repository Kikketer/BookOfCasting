const socket = io()
const phraseElements = []
let blobTimeout

document.querySelector('#fullscreen-block').addEventListener('click', function() {
  const elem = document.documentElement
  if (elem.requestFullscreen) {
    elem.requestFullscreen()
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen()
  }
})

socket.on('cast', function(phrase) {
  clearScreen()
  clearTimeout(blobTimeout)

  const blob = document.querySelector('.blur-blob')
  blob.classList.remove('hide')
  // Remove the blob
  blobTimeout = setTimeout(() => {
    blob.classList.add('hide')
  }, 15000)

  const phraseBlock = document.querySelector('.phrase-block')
  const phraseElement = document.createElement('div')
  phraseElement.innerHTML = phrase
  phraseElement.id = `phrase-${Math.floor(Math.random() * 1000)}`
  phraseElement.className = 'phrase'

  const pos = Math.floor(Math.random() * 10) + 10
  const rot = Math.floor(Math.random() * 10) + 5

  TweenLite.fromTo(phraseElement, 3, {opacity: 0, rotation: -5, top: `${pos}%`, left: `${pos}%`}, {opacity: 1})
  TweenLite.to(phraseElement, 20, {top: `${pos + 20}%`, left: `${pos + 20}%`, ease: 'Power1.easeInOut'})
  const line = new TimelineLite({onComplete: () => clearElement(phraseElement)})
  line.add(TweenLite.to(phraseElement, 8, {rotation: rot, ease: 'Power2.easeOut', opacity: 0.7}))
  line.add(TweenLite.to(phraseElement, 8, {rotation: -rot, ease: 'Power2.easeIn', opacity: 0.9}))
  line.add(TweenLite.to(phraseElement, 2, {opacity: 0}))

  phraseElements.push({phraseElement, line})
  phraseBlock.append(phraseElement)
})

function clearScreen() {
  phraseElements.forEach(({phraseElement, line}) => {
    TweenLite.to(phraseElement, 1, {opacity: 0})
    line.kill()
  })
}

function clearElement(phraseElement) {
  const phraseBlock = document.querySelector('.phrase-block')
  phraseBlock.removeChild(phraseElement)
  const elemIndex = phraseElements.findIndex(function (e) {
    return e === phraseElement
  })
  if(elemIndex >= 0) {
    phraseElements.splice(elemIndex, 1)
  }
}