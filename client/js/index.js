const socket = io()
const phraseElements = []
let blobTimeout

document.querySelector('#fullscreen-block').addEventListener('click', function(e) {
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
  }, 10000)

  const phraseBlock = document.querySelector('.phrase-block')
  const phraseElement = document.createElement('div')
  phraseElement.innerHTML = phrase
  phraseElement.id = `phrase-${Math.floor(Math.random() * 1000)}`
  phraseElement.className = 'phrase in'
  phraseElements.push({
    id: phraseElement.id,
    clearMe: () => {
      phraseElement.classList.add('out')
      phraseElement.classList.remove('in')
    },
    removeMe: setTimeout(() => {
      phraseBlock.removeChild(phraseElement)
      phraseElements.shift()
    }, 25000)})
  phraseBlock.append(phraseElement)
})

function clearScreen() {
  phraseElements.forEach(ph => {
    ph.clearMe()
  })
}