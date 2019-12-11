const savedSpeed = Number(localStorage.getItem('speed'))
const savedVolume = Number(localStorage.getItem('volume'))
const sound = {
  autoplay: false,
  enabled: (localStorage.getItem('sound') || 'true') === 'true',
  volume: savedVolume && savedVolume > 0 && savedVolume <= 100 ? savedVolume : 20
}

let DIT_DURATION = savedSpeed && savedSpeed > 30 && savedSpeed < 1000 ? savedSpeed : 120
let PAUSE_DURATION = DIT_DURATION * 3
let WORD_DURATION = DIT_DURATION * 7
let alphabetName = localStorage.getItem('alphabet')
if (!alphabetName || !REVERSED[alphabetName]) {
  alphabetName = 'RUS'
}
let reversed = REVERSED[alphabetName]
result.value = ''

let audioContext
let oscillator
let gainNode

let keyDownTime = Date.now()
let keyUpTime = Date.now()
let isPressed = false

let buffer = []
let word = []
let text = []

function playSound() {
  if (!sound.autoplay) {
    return
  }

  if (!audioContext) {
    audioContext = new AudioContext()
    oscillator = audioContext.createOscillator()
    oscillator.type = "sine"

    gainNode = audioContext.createGain()

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination)
    oscillator.start()
  }
  gainNode.gain.value = sound.volume / 100
}

function stopSound () {
  if (gainNode) {
    gainNode.gain.value = 0
  }
}

function finishChar (spaceTime, isNextWord) {
  if (buffer.length) {
    const code = buffer.join('')
    let char = reversed[code]
    if (char) {
      word.push(char)
    } else {
      char = '???'
    }

    logArea.innerHTML = `${char} ${code} <br/>` + logArea.innerHTML
    buffer.length = 0
    console.log('delimeter')
  }

  if (isNextWord && word.length) {
    const str = word.join('')
    if (logArea.innerHTML.length > 100) {
      logArea.innerHTML = logArea.innerHTML.substring(0, 80)
    }
    if (str !== ' ') {
      result.value += ` ${str}`
    }
    word.length = 0
    text.push(str)
  }
}

function pressDown () {
  if (isPressed) {
    return
  }
  isPressed = true

  const now = Date.now()
  const spaceTime = now - keyUpTime
  keyDownTime = now

  if (!!sound.enabled) {
    playSound()
  }
  if (spaceTime > PAUSE_DURATION) {
    finishChar(spaceTime, spaceTime > WORD_DURATION)
  } else {
    console.log('space:', spaceTime)
  }
}

function pressUp () {
  if (!isPressed) {
    return
  }
  isPressed = false

  const now = Date.now()
  const signalTime = now - keyDownTime
  keyUpTime = now
  stopSound()

  const char = signalTime > DIT_DURATION ? '-' : '.'
  console.log('signal:', signalTime, char)
  buffer.push(char)
}

setInterval(() => {
  if (isPressed) {
    return
  }

  const spaceTime = Date.now() - keyUpTime
  if (spaceTime > PAUSE_DURATION) {
    finishChar(spaceTime, spaceTime > WORD_DURATION)
  }
}, 10)

function handleCopyClick () {
  const str = text.join('')
  const el = document.createElement('textarea')
  el.value = str
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}

function handleClearClick() {
  text.length = 0
  buffer.length = 0
  word.length = 0
  result.value = ''
  logArea.innerText = ''
}

ditDurationLabel.innerText = DIT_DURATION + ' ms'
speedInput.value = DIT_DURATION
function handleSpeedChange(e) {
  const val = parseInt(e.target.value)
  DIT_DURATION = val
  ditDurationLabel.innerText = val + ' ms'
  PAUSE_DURATION = val * 3
  WORD_DURATION = val * 7
  localStorage.setItem('speed', val)
}

volumeInput.value = sound.volume
function handleVolumeChange(e) {
  sound.volume = parseInt(e.target.value)
  localStorage.setItem('volume', sound.volume)
}

let isSettingsPopupOpen = false
function handleTogglePopup() {
  isSettingsPopupOpen = !isSettingsPopupOpen
  settingsPopup.style.visibility = isSettingsPopupOpen ?  'visible' : 'hidden';
}

alphabetSelect.value = alphabetName
function handleAlphabetChange(e) {
  const val = e.target.value
  reversed = REVERSED[val]
  localStorage.setItem('alphabet', val)
}

soundButton.style.textDecoration = sound.enabled ? 'none' : 'line-through'
function handleToggleSound() {
  sound.enabled = !sound.enabled
  localStorage.setItem('sound', String(sound.enabled))
  soundButton.style.textDecoration = sound.enabled ? 'none' : 'line-through'
}

function handleAllowAutoplay() {
  sound.autoplay = true
  console.log('asddasdsd');
  document.body.removeEventListener('click', handleAllowAutoplay)
  document.body.removeEventListener('keyDown', handleAllowAutoplay)
  document.body.removeEventListener('touchStart', handleAllowAutoplay)
}
