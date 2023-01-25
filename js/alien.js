'use strict'

const ALIEN_SPEED = 500
var gIntervalAliens
var gAliensTopRowIdx = 0
var gAliensBottomRowIdx = 2
var gIsAlienFreeze = true

// The following two variables represent the part of the matrix (some rows)
// that we should shift (left, right, and bottom)
// We need to update those when:
// (1) shifting down and (2) last alien was cleared from row

function createAliens(board) {
  for (let i = 0; i < ALIENS_ROW_COUNT; i++) {
    for (let j = 0; j < gAliensRowLength; j++) {
      board[i][j] = createCell(ALIEN, ALIEN, true)
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
    // console.log(board[i][toI])
    for (let j = fromI; j < toI; j++) {
      if (fromI > 0) updateCell({ i, j: fromI - 1 })
      //   board[i][j] = createCell(ALIEN, ALIEN, true)
      updateCell({ i, j }, ALIEN, ALIEN, true)
      if (fromI === 6) clearInterval(gIntervalAliens)

      //   console.log(board[i][j].isAlien)
    }
  }
  gAliensTopRowIdx++
  gAliensRowLength++
}
function shiftBoardLeft(board, fromI, toI) {}
function shiftBoardDown(board, fromI, toI) {}

// runs the interval for moving aliens side to side and down
// it re-renders the board every time
// when the aliens are reaching the hero row - interval stops
function moveAliens() {
  console.log(gBoard)
  gIntervalAliens = setInterval(() => {
    shiftBoardRight(gBoard, gAliensTopRowIdx, gAliensRowLength)
  }, ALIEN_SPEED)
}
