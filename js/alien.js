'use strict'

const ALIEN_SPEED = 500
var gIntervalAliens

// The following two variables represent the part of the matrix (some rows)
// that we should shift (left, right, and bottom)
// We need to update those when:
// (1) shifting down and (2) last alien was cleared from row
var gAliensTopRowIdx
var gAliensBottomRowIdx

var gIsAlienFreeze = true

function createAliens(board) {
  for (let i = 0; i < ALIENS_ROW_COUNT; i++) {
    for (let j = 0; j < ALIENS_ROW_LENGTH; j++) {
      board[i][j] = createCell(ALIEN, ALIEN)
      gGame.aliensCount++
    }
  }
}
function handleAlienHit(pos, nextCell) {
  updateScore(10)
  gGame.aliensCount--
  gHero.isShoot = false
  gBoard[nextCell][pos.j].type = null
  updateCell({ i: nextCell, j: pos.j })
  clearInterval(gShootInterval)
  checkVictory()
}
function shiftBoardRight(board, fromI, toI) {
  for (let i = 0; i < ALIENS_ROW_COUNT; i++) {
    console.log(board[0])
  }
}
function shiftBoardLeft(board, fromI, toI) {}
function shiftBoardDown(board, fromI, toI) {}

// runs the interval for moving aliens side to side and down
// it re-renders the board every time
// when the aliens are reaching the hero row - interval stops
function moveAliens() {
  setInterval(() => {
    shiftBoardRight(gBoard, 1, 2)
  }, 3000)
}
