let WORD_DURATION = 900;
let PAUSE_DURATION = 350;
let DIT_DURATION = 140;

const ALPHABET = {
	'А': '.-',
	'Б': '-...',
	'В': '.--',
	'Г': '--.',
	'Д': '-..',
	'Е': '.',
	'Ж': '...-',
	'З': '--..',
	'И': '..',
	'Й': '.---',
	'К': '-.-',
	'Л': '.-..',
	'М': '--',
	'Н': '-.',
	'О': '---',
	'П': '.--.',
	'Р': '.-.',
	'С': '...',
	'Т': '-',
	'У': '..-',
	'Ф': '..-.',
	'Х': '....',
	'Ц': '-.-.',
	'Ч': '---.',
	'Ш': '----',
	'Щ': '--.-',
	'Ь': '-..-',
	'Ы': '-.--',
	'Э': '..-..',
	'Ю': '..--',
	'Я': '.-.-',
  
	'1': '.----',
	'2': '..---',
	'3': '...--',
	'4': '....-',
	'5': '.....',
	'6': '-....',
	'7': '--...',
	'8': '---..',
	'9': '----.',
	'0': '-----',
  
	'.': '......',
}

const REVERSED = Object.entries(ALPHABET)
	.reduce((res, [key, value]) => {
  	res[value] = key;
		return res;
  }, {});

result.value = '';

let keyDownTime = Date.now()
let keyUpTime = Date.now()
let isPressed = false;

let buffer = [];
let word = [];
let text = [];

function finishChar(spaceTime, isNextWord) {
	if (buffer.length) {
    const code = buffer.join('');
    let char = REVERSED[code];
    if (char) {
    	word.push(char);
    } else {
      char = '???';
    }
    
    output.innerHTML = `${char} ${code} <br/>` + output.innerHTML;
    buffer.length = 0;
    console.log('delimeter:', spaceTime);
  }
  
  if (isNextWord && word.length) {
  	const str = word.join('');
    if (output.innerHTML.length > 200) {
    	output.innerHTML = output.innerHTML.substring(0, 100);
    }
    if (str !== ' ') {
    	result.value  += ` ${str}`; 	    
    }
  	word.length = 0;
    text.push(str);
  }
}

function pressDown() {
	if (isPressed) {
  	return;
  }
  isPressed = true;

  const now = Date.now();
  const spaceTime = now - keyUpTime;
  keyDownTime = now;
  
  if (spaceTime > PAUSE_DURATION) {
  	finishChar(spaceTime, spaceTime > WORD_DURATION);
  } else {
		console.log('space:', spaceTime);
  }
}

function pressUp() {
	if (!isPressed) {
  	return;
  }
  isPressed = false;

  const now = Date.now();
  const signalTime = now - keyDownTime;
  keyUpTime = now;
  
  const char = signalTime > DIT_DURATION ? '-' : '.';
	console.log('signal:', signalTime, char);
  buffer.push(char);
}

document.body.onkeydown = pressDown;
pressButton.onmousedown = pressDown;
pressButton.ontouchstart = pressDown;

document.body.onkeyup = pressUp;
pressButton.onmouseup = pressUp;
pressButton.ontouchEnd = pressUp;

setInterval(() => {
	if (isPressed) {
  	return;
  }

  const spaceTime = Date.now() - keyUpTime;
  if (spaceTime > PAUSE_DURATION) {
  	finishChar(spaceTime, spaceTime > WORD_DURATION);
  }
}, 100);


function copyToClipboard (str) {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

clearButton.onclick = () => {
  text.length = 0;
  buffer.length = 0;
  word.length = 0;
  result.value = '';
  output.innerText = '';
}

copyButton.onclick = () => {
	copyToClipboard(text.join(''));
}

wordDurationInput.value = WORD_DURATION;
pauseDurationInput.value = PAUSE_DURATION;
ditDurationInput.value = DIT_DURATION;

wordDurationInput.onchange = (e) => {
  const val = parseInt(e.target.value);
  console.log('WORD_DURATION:', val);
  if (val) {
  	WORD_DURATION = val;
  } else {
  	wordDurationInput.value = WORD_DURATION;
  }
}
pauseDurationInput.onchange = (e) => {
  const val = parseInt(e.target.value);
  console.log('PAUSE_DURATION:', val);
  if (val) {
  	PAUSE_DURATION = val;
  } else {
  	wordDurationInput.value = PAUSE_DURATION;
  }
}
ditDurationInput.onchange = (e) => {
  const val = parseInt(e.target.value);
  console.log('DIT_DURATION:', val);
  if (val) {
  	DIT_DURATION = val;
  } else {
  	wordDurationInput.value = DIT_DURATION;
  }
}








