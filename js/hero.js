'use strict'

var laserSpeed = 80
var gShootInterval
var gHero
var gSpecialLasers

// creates the hero and place it on board
function createHero(board) {
  gHero = { pos: { i: 12, j: 5 }, isShoot: false }
  board[gHero.pos.i][gHero.pos.j] = createCell(HERO)
  console.log(board)
}
// Handle game keys
function onKeyDown(ev) {
  if (ev.code === 'Enter' && !gGame.isOn) init()
  if (!gGame.isOn) return

  if (ev.code === 'ArrowLeft') {
    if (gHero.pos.j === 0) return
    moveHero(-1)
  } else if (ev.code === 'ArrowRight') {
    if (gHero.pos.j === 13) return
    moveHero(1)
  } else if (ev.code === 'Space' && !gHero.isShoot) {
    playSound('shoot')
    shoot()
  } else if (ev.code === 'KeyN' && gSpecialLasers.laserBombCount === 1) {
    gSpecialLasers.laserBomb = true
    gSpecialLasers.laserBombCount--
    updatesLaserCount()
    shoot()
  } else if (ev.code === 'KeyX' && gSpecialLasers.sonicLazerCount > 0) {
    console.log('X')
    gSpecialLasers.sonicLazer = true
    gSpecialLasers.sonicLazerCount--
    updatesLaserCount()
    shoot()
  }
}
// Move the hero right (1) or left (-1)
function moveHero(dir) {
  var currentPos = { i: gHero.pos.i, j: gHero.pos.j }
  var nextPos = { i: gHero.pos.i, j: (gHero.pos.j += dir) }
  updateCell(currentPos)
  updateCell(nextPos, HERO)
}
// Sets an interval for shutting (blinking) the laser up towards aliens
function shoot() {
  var position = { ...gHero.pos }
  if (gHero.isShoot) return
  gShootInterval = setInterval(
    () => {
      blinkLaser(position)
    },
    gSpecialLasers.sonicLazer ? 30 : laserSpeed
  )
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
    if (gSpecialLasers.laserBomb) {
      console.log('LAZER BOMB')
      bombNegs(gBoard, nextCell, pos.j)
      handleAlienHit(pos, nextCell)
      updateCell({ i: nextCell, j: pos.j })
    } else {
      handleAlienHit(pos, nextCell)
      updateCell({ i: nextCell, j: pos.j })
    }
  } else {
    updateCell({ i: nextCell, j: pos.j }, handleLaserColor())
  }

  if (prevCell === gHero.pos.i) return
  updateCell({ i: prevCell, j: pos.j })

  ///////////
}

// Handle shot out of range
function handleOutOfRange(pos, prevCell) {
  clearInterval(gShootInterval)
  updateCell({ i: prevCell, j: pos.j })
  gHero.isShoot = false
}

// Bomb negs
function bombNegs(board, rowIdx, colIdx) {
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue

    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= board[i].length) continue
      if (i === rowIdx && j === colIdx) continue

      var currCell = board[i][j]
      if (currCell.type === ALIEN) {
        updateCell({ i, j })
        gGame.aliensCount--
        updateScore(10)
      }
    }
  }
  gSpecialLasers.laserBomb = false
}

// Handling laser color
function handleLaserColor() {
  let laserCondition
  if (gSpecialLasers.sonicLazer) {
    laserCondition = SONIC_LASER
  } else if (gSpecialLasers.laserBomb) {
    laserCondition = LASER_BOMB
  } else {
    laserCondition = LASER
  }
  return laserCondition
}
