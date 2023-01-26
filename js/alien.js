'use strict'

const ALIEN_SPEED = 500
var gIntervalAliensRight
var gIntervalAliensDown
var gIntervalAliensLeft
var gAliensTopRowIdx
var gAliensBottomRowIdx
var gIsAlienFreeze = true
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
  updateScore(10)
  gGame.aliensCount--
  var results = checkVictory()
  if (!results) {
    handleGameOver(true)
  }
  gHero.isShoot = false
  gSpecialLasers.sonicLazer = false
  gBoard[nextCell][pos.j].type = null
  updateCell({ i: nextCell, j: pos.j })
  clearInterval(gShootInterval)
}

// Shift board right
function shiftBoardRight() {
  if (gIntervalsCount === 5) {
    clearInterval(gIntervalAliensRight)
    gIntervalAliensRight = null
    gIntervalAliensDown = setInterval(() => {
      shiftBoardDown(gBoard)
    }, ALIEN_SPEED)
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
    clearInterval(gIntervalAliensLeft)
    gIntervalAliensLeft = null
    gIntervalAliensDown = setInterval(() => {
      shiftBoardDown(gBoard)
    }, ALIEN_SPEED)
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
    clearInterval(gIntervalAliensDown)
    gIntervalAliensDown = null
    gIntervalAliensLeft = setInterval(() => {
      shiftBoardLeft(gBoard)
    }, ALIEN_SPEED)
  } else if (gIntervalsCount === 13) {
    clearInterval(gIntervalAliensDown)
    gIntervalAliensDown = null
    gIntervalsCount = -1
    gIntervalAliensRight = setInterval(() => {
      shiftBoardRight(gBoard)
    }, ALIEN_SPEED)
  }
  for (var i = gAliensBottomRowIdx; i >= gAliensTopRowIdx; i--) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].type === ALIEN) {
        updateCell({ i, j }, '')
        updateCell({ i: i + 1, j }, ALIEN, ALIEN, true)
      }
      if (i === 11) handleGameOver(false)
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
  gIntervalAliensRight = setInterval(() => {
    shiftBoardRight(gBoard)
  }, ALIEN_SPEED)
}
