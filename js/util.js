'use strict'

function getElCell(pos) {
  return document.querySelector(`.cell-${pos.i}-${pos.j}`)
}

function playSound(audio) {
  var audio = new Audio(`sounds/${audio}.wav`)
  audio.play()
}
