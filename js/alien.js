'use strict'

const ALIEN_SPEED = 800
var gIntervalAliensRight
var gIntervalAliensDown
var gIntervalAliensLeft
var gAliensTopRowIdx
var gAliensBottomRowIdx
var gIsAlienFreeze
var gIntervalsCount

// Creates aliens
function createAliens(board) {
  for (let i = 0; i < ALIENS_ROW_COUNT; i++) {
    for (let j = 0; j < ALIENS_ROW_LENGTH; j++) {
      board[i][j] = createCell(ALIEN, ALIEN, true, { i, j })
      // gGame.aliensCount++
    }
  }
}

// Handle alien hit
function handleAlienHit(pos, nextCell) {
  playSound('enemy-dead')
  updateScore(10)
  gGame.aliensCount--
  gHero.isShoot = false
  gSpecialLasers.sonicLazer = false
  gBoard[nextCell][pos.j].type = null
  updateCell({ i: nextCell, j: pos.j })
  clearInterval(gShootInterval)
  var results = checkVictory(gBoard)
  if (!results) {
    handleGameOver(true)
  }
}

// Shift board right
function shiftBoardRight() {
  if (gIntervalsCount === 5) {
    freezeIntervals()
    gIntervalAliensDown = setInterval(shiftBoardDown, ALIEN_SPEED, gBoard)
  }
  for (var i = gAliensTopRowIdx; i <= gAliensBottomRowIdx; i++) {
    for (var j = gBoard[0].length - 1; j >= 0; j--) {
      if (gBoard[i][j].type === ALIEN) {
        updateCell({ i, j }, '')
        updateCell({ i, j: j + 1 }, ALIEN, ALIEN, true)
      }
    }
  }
  gIntervalsCount++
}

// Shift board left
function shiftBoardLeft() {
  if (gIntervalsCount === 12) {
    freezeIntervals()
    gIntervalAliensDown = setInterval(shiftBoardDown, ALIEN_SPEED, gBoard)
  }
  for (var i = gAliensTopRowIdx; i <= gAliensBottomRowIdx; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].type === ALIEN) {
        updateCell({ i, j }, '')
        updateCell({ i, j: j - 1 }, ALIEN, ALIEN, true)
      }
    }
  }
  gIntervalsCount++
}

// Shift board down
function shiftBoardDown() {
  if (gIntervalsCount === 6) {
    freezeIntervals()
    gIntervalAliensLeft = setInterval(shiftBoardLeft, ALIEN_SPEED, gBoard)
  } else if (gIntervalsCount === 13) {
    freezeIntervals()
    gIntervalsCount = -1
    gIntervalAliensRight = setInterval(shiftBoardRight, ALIEN_SPEED, gBoard)
  }
  for (var i = gAliensBottomRowIdx; i >= gAliensTopRowIdx; i--) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].type === ALIEN) {
        updateCell({ i, j }, '')
        updateCell({ i: i + 1, j }, ALIEN, ALIEN, true)
      }
      if (i === gBoard.length - 3) handleGameOver(false)
    }
  }
  gIntervalsCount++
  gAliensTopRowIdx++
  gAliensBottomRowIdx++
}

// runs the interval for moving aliens side to side and down
// it re-renders the board every time
// when the aliens are reaching the hero row - interval stops
function moveAliens() {
  gIntervalAliensRight = setInterval(shiftBoardRight, ALIEN_SPEED, gBoard)
}

function checkIfDead(gBoard) {
  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard[i].length; j++) {}
  }
}
