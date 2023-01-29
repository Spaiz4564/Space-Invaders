'use strict'

const BOARD_SIZE = 14
const HERO = `<img class="hero" src="imgs/player.png"></img>`
const ALIEN = `<img class="alien" src="imgs/enemy1.png"></img>`
const ALIEN2 = `<img class="alien" src="imgs/enemy2.png"></img>`
const ALIEN3 = `<img class="alien" src="imgs/enemy3.png"></img>`
const LASER = `<img class="laser" src="imgs/laser.png"></img>`
const SPACE_SHIP = `<img class="space-ship wiggle" src="imgs/spaceShip.png"></img>`
const SONIC_LASER = `<img class="laser" src="imgs/sonicLazer.png"></img>`
const LASER_BOMB = `<img class="laser" src="imgs/rocket.png"></img>`
var ALIENS_ROW_LENGTH = 8
const ALIENS_ROW_COUNT = 3
var gBoard
var gSpaceShipInterval
var gMusic
var gSpaceShipTimeOut
var gGame = {
  isOn: false,
  aliensCount: 0,
  score: 0,
}

// Called when game loads
function init() {
  gBoard = createBoard()
  resetGame()
  createHero(gBoard)
  createAliens(gBoard)
  renderBoard(gBoard, '.board-container')
  moveAliens()
  gMusic.play()
}

// Create and returns the board with aliens on top, ground at bottom
// use the functions: createCell, createHero, createAliens
function createBoard() {
  let board = []
  for (let i = 0; i < BOARD_SIZE; i++) {
    board[i] = []
    for (let j = 0; j < BOARD_SIZE; j++) {
      board[i][j] = createCell()
    }
  }
  return board
}

// Render the board as a <table> to the page
function renderBoard(board, selector) {
  let strHTML = '<table border="0"><tbody>'
  for (let i = 0; i < board.length; i++) {
    strHTML += `<tr>\n`
    for (let j = 0; j < board[i].length; j++) {
      const cell = board[i][j]
      const className = `cell cell-${i}-${j}`

      strHTML += `<td class="${className}">${
        !cell.gameObject ? '' : cell.gameObject
      }</td>`
    }
    strHTML += `</tr>`
  }
  document.querySelector(selector).innerHTML = strHTML
}

// position such as: {i: 2, j: 7}
function updateCell(
  pos,
  gameObject = null,
  type = '',
  isAlien = false,
  alienColor
) {
  gBoard[pos.i][pos.j].gameObject = gameObject
  gBoard[pos.i][pos.j].isAlien = isAlien
  gBoard[pos.i][pos.j].type = type
  gBoard[pos.i][pos.j].alienColor = alienColor
  var elCell = getElCell(pos)
  elCell.innerHTML = gameObject || ''
}

// Updates score
function updateScore(diff) {
  gGame.score += diff
  document.querySelector('.score span').innerText = gGame.score
}

// Resets game
function resetGame() {
  gGame.score = 0
  gMusic = new Audio('sounds/music.wav')
  gIntervalsCount = 0
  gGame.aliensCount = 24
  gAliensTopRowIdx = 0
  gGame.isOn = true
  gAliensBottomRowIdx = ALIENS_ROW_COUNT - 1
  gSpecialLasers = {
    laserBomb: false,
    laserBombCount: 1,
    sonicLazer: false,
    sonicLazerCount: 3,
  }
  document.querySelector('.modal').style.display = 'none'
  // document.querySelector('.bomb-count').style.display = 'block'
  document.querySelector('canvas').style.opacity = '1'
  document.querySelector('.restart').style.display = 'none'
  document.querySelector('.victory').style.display = 'none'
  document.querySelector('.victory').src = 'imgs/victory.png'
  document.querySelector('.victory').classList.remove('gameover')
  document.querySelector('.score span').innerText = gGame.score

  updatesLaserCount()
}

// Updates laser count
function updatesLaserCount() {
  let bombCount = gSpecialLasers.laserBombCount
  let laserCount = gSpecialLasers.sonicLazerCount
  document.querySelector('.rocket').innerText = bombCount
  document.querySelector('.blue-laser-span').innerText = laserCount
}

// Freeze intervals
function freezeIntervals() {
  clearInterval(gIntervalAliensDown)
  clearInterval(gIntervalAliensRight)
  clearInterval(gIntervalAliensLeft)
}

// Check victory
function checkVictory(board) {
  if (!gGame.aliensCount) {
    handleGameOver(true)
    console.log('hello')
    showModal('victory')
  }

  // Game is sometimes buggy, this function makes sure winning isnt bugged, it runs through the board
  // making sure there are no invaders, tho it only runs if the first check was not enough.

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      if (board[i][j].gameObject === ALIEN || gBoard[i][j].type === ALIEN) {
        return true
      }
    }
  }

  return false
}

// Handle game over result
function handleGameOver(results) {
  gGame.isOn = false
  gMusic.pause()
  gMusic.currentTime = 0
  document.querySelector('.restart').style.display = 'block'
  document.querySelector('.victory').style.display = 'block'
  document.querySelector('table').style.display = 'none'
  freezeIntervals()
  clearInterval(gSpaceShipInterval)
  clearTimeout(gSpaceShipTimeOut)
  if (!results) {
    var audio = new Audio('sounds/lose.mp3')
    audio.play()
    document.querySelector('.victory').classList.add('gameover')
    document.querySelector('.victory').src = 'imgs/game-over.png'
  } else {
    playSound('win')
  }
}

// Show modal
function showModal(action) {
  var modalEl = document.querySelector('.modal')
  if (action !== 'intro') {
    var h1Condition = action === 'victory' ? 'VICTORY' : 'GAME OVER'
    modalEl.innerHTML = `<h1 class="game-over-h1">${h1Condition}</h1>
  <button onclick="init()" class="restart">Restart Game</button>`
  }
}

// Handling arrow colors
function handleArrows(dir) {
  const arrowsImg = document.querySelector('.arrows')
  let action = 'not-pressed'
  if (dir === 'ArrowLeft') {
    action = 'left-pressed'
    arrowsImg.src = `imgs/${action}.png`
    arrowsTimeOut()
  } else if (dir === 'ArrowRight') {
    action = 'right-pressed'
    arrowsImg.src = `imgs/${action}.png`
    arrowsTimeOut()
  }
}

// Handling arrows timeout
function arrowsTimeOut() {
  setTimeout(() => {
    document.querySelector('.arrows').src = `imgs/not-pressed.png`
  }, 200)
}

// Handling Game Pad
function handleGamePad(key) {
  var blueCircle = document.querySelector('.circle-blue')
  var redCircle = document.querySelector('.circle-red')
  var yellowCircle = document.querySelector('.circle-yellow')
  let action
  let src
  if (key === 'KeyN') {
    action = 'red'
    src = `imgs/${action}.png`
    blueCircle.src = src
  } else if (key === 'KeyX') {
    action = 'blue'
    src = `imgs/${action}.png`
    yellowCircle.src = src
  } else if (key === 'Space') {
    action = 'yellow'
    src = `imgs/${action}.png`
    redCircle.src = src
  }
}

// Clearing game pad colors
function clearGamePadButtons() {
  var gamePadButtons = document.querySelectorAll('.circle')
  for (let i = 0; i < gamePadButtons.length; i++) {
    gamePadButtons[i].src = 'imgs/gray.png'
  }
}

// Returns a new cell object. e.g.: {type: SKY, gameObject: ALIEN}
function createCell(
  gameObject = null,
  type = null,
  isAlien = false,
  location = null,
  alienColor
) {
  return {
    type: type,
    gameObject,
    isAlien,
    location,
    alienColor,
  }
}

// Adding space ship
function addSpaceShip(board) {
  var randomNum = Math.floor(Math.random() * board[0].length)
  gBoard[0][randomNum] = createCell(SPACE_SHIP, SPACE_SHIP)
  updateCell({ i: 0, j: randomNum }, SPACE_SHIP, SPACE_SHIP)

  gSpaceShipTimeOut = setTimeout(() => {
    updateCell({ i: 0, j: randomNum })
  }, 5000)
}
