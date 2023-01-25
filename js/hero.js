'use strict'

const LASER_SPEED = 60
var gShootInterval
var gHero

// creates the hero and place it on board
function createHero(board) {
  gHero = { pos: { i: 12, j: 5 }, isShoot: false }
  board[gHero.pos.i][gHero.pos.j] = createCell(HERO)
  console.log(board)
}
// Handle game keys
function onKeyDown(ev) {
  if (ev.code === 'ArrowLeft') {
    if (gHero.pos.j === 0) return
    moveHero(-1)
  } else if (ev.code === 'ArrowRight') {
    if (gHero.pos.j === 13) return
    moveHero(1)
  } else if (ev.code === 'Space') {
    shoot()
    console.log('SHOOT ')
  }
}
// Move the hero right (1) or left (-1)
function moveHero(dir) {
  if (!gGame.isOn) return
  var currentPos = { i: gHero.pos.i, j: gHero.pos.j }
  var nextPos = { i: gHero.pos.i, j: (gHero.pos.j += dir) }
  updateCell(currentPos)
  updateCell(nextPos, HERO)
}
// Sets an interval for shutting (blinking) the laser up towards aliens
function shoot() {
  var position = { ...gHero.pos }
  if (gHero.isShoot) return
  gShootInterval = setInterval(() => {
    blinkLaser(position)
  }, LASER_SPEED)
}
// renders a LASER at specific cell for short time and removes it
function blinkLaser(pos) {
  gHero.isShoot = true
  var nextCell = (pos.i -= 1)
  var prevCell = pos.i + 1
  if (nextCell < 0) {
    handleOutOfRange(pos, prevCell)
    return
  }

  if (gBoard[nextCell][pos.j].type === ALIEN) {
    handleAlienHit(pos, nextCell)
    updateCell({ i: nextCell, j: pos.j })
  } else {
    updateCell({ i: nextCell, j: pos.j }, LASER)
  }

  if (prevCell === gHero.pos.i) return
  updateCell({ i: prevCell, j: pos.j })

  ///////////
}

function handleOutOfRange(pos, prevCell) {
  console.log('OUT OF RANGE')
  clearInterval(gShootInterval)
  updateCell({ i: prevCell, j: pos.j })
  gHero.isShoot = false
}
