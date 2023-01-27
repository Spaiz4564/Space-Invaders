'use strict'

const BOARD_SIZE = 14
const HERO = `<img class="hero" src="imgs/player.png"></img>`
const ALIEN = `<img class="alien" src="imgs/enemy2.png"></img>`
const LASER = `<img class="laser" src="imgs/laser.png"></img>`
const SONIC_LASER = `<img class="laser" src="imgs/sonicLazer.png"></img>`
const LASER_BOMB = `<img class="laser" src="imgs/rocket.png"></img>`
var ALIENS_ROW_LENGTH = 8
const ALIENS_ROW_COUNT = 3
var gBoard
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
}

var gAliensInterval
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
function updateCell(pos, gameObject = null, type = '', isAlien = false) {
  gBoard[pos.i][pos.j].gameObject = gameObject
  gBoard[pos.i][pos.j].isAlien = isAlien
  gBoard[pos.i][pos.j].type = type

  var elCell = getElCell(pos)
  elCell.innerHTML = gameObject || ''
}

// Updates score
function updateScore(diff) {
  gGame.score += diff
  document.querySelector('h2 span').innerText = gGame.score
}

// Resets game
function resetGame() {
  document.querySelector('.modal').style.display = 'none'
  document.querySelector('canvas').style.opacity = '1'
  document.querySelector('h2 span').innerText = 0
  gIntervalsCount = 0
  gGame.aliensCount = 24
  gAliensTopRowIdx = 0
  gGame.isOn = true
  gSpecialLasers = {
    laserBomb: false,
    laserBombCount: 1,
    sonicLazer: false,
    sonicLazerCount: 3,
  }
  updatesLaserCount()
  gAliensBottomRowIdx = ALIENS_ROW_COUNT - 1
}

// Updates laser count
function updatesLaserCount() {
  let bombCount = gSpecialLasers.laserBombCount
  let laserCount = gSpecialLasers.sonicLazerCount
  document.querySelector('h3 span').innerText = bombCount
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

  // Game is buggy, this function makes sure winning isnt bugged, it runs through the board
  // making sure there are no invaders, it only runs if the first check was not enough.

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
  document.querySelector('.modal').style.display = 'block'
  document.querySelector('.modal').style.width = '19rem'
  document.querySelector('.modal').style.height = '19rem'
  document.querySelector('table').style.position = 'absolute'
  freezeIntervals()
  showModal(results ? 'victory' : 'lose')
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
