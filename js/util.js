'use strict'

function getElCell(pos) {
  return document.querySelector(`.cell-${pos.i}-${pos.j}`)
}

// Returns a new cell object. e.g.: {type: SKY, gameObject: ALIEN}
function createCell(
  gameObject = null,
  type = null,
  isAlien = false,
  location = null
) {
  return {
    type: type,
    gameObject: gameObject,
    isAlien,
    location: location,
  }
}

function playSound(audio) {
  var audio = new Audio(`sounds/${audio}.wav`)
  audio.play()
}
