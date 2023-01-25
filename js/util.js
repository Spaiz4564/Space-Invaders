'use strict'

function getElCell(pos) {
  return document.querySelector(`.cell-${pos.i}-${pos.j}`)
}

// Returns a new cell object. e.g.: {type: SKY, gameObject: ALIEN}
function createCell(gameObject = null, type = SKY, isAlien = false) {
  return {
    type: type,
    gameObject: gameObject,
    isAlien,
  }
}
