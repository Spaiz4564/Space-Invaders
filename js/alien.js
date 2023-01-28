'use strict'

const ALIEN_SPEED = 800
var gIntervalAliensRight
var gIntervalAliensDown
var gIntervalAliensLeft
var gAliensTopRowIdx
var gAliensBottomRowIdx
var gIsAlienFreeze
var gIntervalsCount
var gLatestInterval

// Creates aliens
function createAliens(board) {
  var alienImg
  var color
  for (let i = 0; i < ALIENS_ROW_COUNT; i++) {
    if (i === 0) (color = 'orange'), (alienImg = ALIEN)
    else if (i === 1) (color = 'green'), (alienImg = ALIEN2)
    else if (i === 2) (color = 'blue'), (alienImg = ALIEN3)
    for (let j = 0; j < ALIENS_ROW_LENGTH; j++) {
      board[i][j] = createCell(alienImg, alienImg, true, { i, j }, color)
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
      if (gBoard[i][j].isAlien) {
        var alien = gBoard[i][j]
        var alienImg = checkAlienColor(alien)
        updateCell({ i, j: j + 1 }, alienImg, alienImg, true, alien.alienColor)
        updateCell({ i, j })
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
      var alien = gBoard[i][j]
      var alienImg = checkAlienColor(alien)
      if (gBoard[i][j].isAlien) {
        updateCell({ i, j: j - 1 }, alienImg, alienImg, true, alien.alienColor)
        updateCell({ i, j }, '')
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
      var alien = gBoard[i][j]
      var alienImg = checkAlienColor(alien)
      if (gBoard[i][j].isAlien) {
        updateCell({ i: i + 1, j }, alienImg, alienImg, true, alien.alienColor)
        updateCell({ i, j }, '')
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
  gSpaceShipInterval = setInterval(() => {
    console.log('hello')
    addSpaceShip(gBoard)
  }, 10000)
}

// Checking alien color
function checkAlienColor(alien, alienImg) {
  if (alien.alienColor === 'orange') alienImg = ALIEN
  if (alien.alienColor === 'green') alienImg = ALIEN2
  if (alien.alienColor === 'blue') alienImg = ALIEN3
  return alienImg
}
