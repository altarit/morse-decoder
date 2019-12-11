document.body.addEventListener('click', handleAllowAutoplay)
document.body.addEventListener('keyDown', handleAllowAutoplay)
document.body.addEventListener('touchStart', handleAllowAutoplay)

// click
document.body.onkeydown = pressDown
pressButton.onmousedown = pressDown
pressButton.ontouchstart = pressDown

document.body.onkeyup = pressUp
pressButton.onmouseup = pressUp
pressButton.ontouchEnd = pressUp

// controls
clearButton.onclick = handleClearClick
copyButton.onclick = handleCopyClick

// Settings
speedInput.onchange = handleSpeedChange
settingsButton.onclick = settingsPopupCloseButton.onclick = handleTogglePopup
alphabetButton.onclick = alphabetPopupCloseButton.onclick = handleToggleAlphabetPopup
alphabetSelect.onchange = handleAlphabetChange
soundButton.onclick = handleToggleSound
volumeInput.onchange = handleVolumeChange
