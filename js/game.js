'use strict'

const BOARD_SIZE = 14
const ALIENS_ROW_COUNT = 3

const HERO = `<img class="hero" src="imgs/player.png"></img>`
const ALIEN = `<img class="alien" src="imgs/enemy2.png"></img>`
const LASER = `<img class="laser" src="imgs/laser.png"></img>`
const SKY = ''

var gAliensRowLength = 8
var gBoard
var gGame

// Called when game loads
function init() {
  gBoard = createBoard()
  resetGame()
  createHero(gBoard)
  createAliens(gBoard)
  renderBoard(gBoard, '.board-container')
  moveAliens()
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
function updateCell(pos, gameObject = null, type = '', isAlien = false) {
  gBoard[pos.i][pos.j].gameObject = gameObject
  gBoard[pos.i][pos.j].isAlien = isAlien
  gBoard[pos.i][pos.j].type = type

  var elCell = getElCell(pos)
  elCell.innerHTML = gameObject || ''
}

function updateScore(diff) {
  gGame.score += diff
  document.querySelector('h2 span').innerText = gGame.score
}

function checkVictory() {
  if (!gGame.aliensCount) {
    console.log('VICTORY')
    gGame.isOn = false
    document.querySelector('.restart').style.display = 'inline-block'
  }
}

function resetGame() {
  document.querySelector('.restart').style.display = 'none'
  gAliensTopRowIdx = 0
  gAliensRowLength = 8
  gGame = {
    isOn: true,
    aliensCount: 0,
    score: 0,
  }
  document.querySelector('h2 span').innerText = 0
}
