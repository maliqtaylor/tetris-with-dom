/*------------------------ Cached Element References ------------------------*/
let board = document.querySelector('#board')
/*-------------------------------- Initiators --------------------------------*/
createGameBoard()
/*-------------------------------- Tetromino Class --------------------------------*/
class Tetromino {
    constructor(color, positions) {
        this.color = color;
        this.positions = positions
        this.current = 0
    }
}
/*-------------------------------- Constants --------------------------------*/
const game = {
    board: linkCells(listToMatrix(board.children, 10)),
    lose: null,
    live: false,
    currentPiece: null,
}
//Holder for all game piece positions
const allPositions = {}
//Holder for all game pieces
const allBlocks = []
/*---------------------------- Positions ----------------------------*/
//All z-block positions
allPositions.z = [[[1, 1, 0], [0, 1, 1], [0, 0, 0]], [[0, 1, 0], [1, 1, 0], [1, 0, 0]]]

//All o-block positions
allPositions.o = [[[0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]]]

//All i-block positions
allPositions.i = [[[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]]
allPositions.i.push([[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]])

//All s-block positions
allPositions.s = [[[0, 1, 1], [1, 1, 0], [0, 0, 0]], [[1, 0, 0], [1, 1, 0], [0, 1, 0]]]

//All t-block positions
allPositions.t = [[[0, 1, 0], [1, 1, 1], [0, 0, 0]], [[0, 1, 0], [0, 1, 1], [0, 1, 0]]]
allPositions.t.push([[0, 0, 0], [1, 1, 1], [0, 1, 0]])
allPositions.t.push([[0, 1, 0], [1, 1, 0], [0, 1, 0]])

//All j-block positions
allPositions.j = [[[1, 0, 0], [1, 1, 1], [0, 0, 0]], [[0, 1, 1], [0, 1, 0], [0, 1, 0]]]
allPositions.j.push([[0, 0, 0], [1, 1, 1], [0, 0, 1]])
allPositions.j.push([[0, 1, 0], [0, 1, 0], [1, 1, 0]])

//All l-block positions
allPositions.l = [[[0, 0, 1], [1, 1, 1], [0, 0, 0]], [[0, 1, 0], [0, 1, 0], [0, 1, 1]]]
allPositions.l.push([[1, 1, 0], [0, 1, 0], [0, 1, 0]])
allPositions.l.push([[0, 0, 0], [1, 1, 1], [1, 0, 0]])
/*---------------------------- Blocks ----------------------------*/
const tBlock = new Tetromino('darkviolet', allPositions.t)
allBlocks.push(tBlock)

const zBlock = new Tetromino('red', allPositions.z)
allBlocks.push(zBlock)

const sBlock = new Tetromino('green', allPositions.s)
allBlocks.push(sBlock)

const oBlock = new Tetromino('gold', allPositions.o)
allBlocks.push(oBlock)

const lBlock = new Tetromino('orange', allPositions.l)
allBlocks.push(lBlock)

const jBlock = new Tetromino('blue', allPositions.j)
allBlocks.push(jBlock)

const iBlock = new Tetromino('cyan', allPositions.i)
allBlocks.push(iBlock)
/*---------------------------- Intervals ----------------------------*/
let dropTimer = setInterval(moveDown, 1000)
let reInsertTimer = setInterval(reInsertLive, 1000)
let clearTimer = setInterval(checkLines, 10)
/*----------------------------- Event Listeners -----------------------------*/
document.body.addEventListener('keydown', (e) => {
    e.preventDefault()
    if (e.key === 'ArrowLeft') {
        moveLeft()
        reInsertLive()
    }
});

document.body.addEventListener('keydown', (e) => {
    e.preventDefault()
    if (e.key === 'ArrowRight') {
        moveRight()
        reInsertLive()
    }
});

document.body.addEventListener('keydown', (e) => {
    e.preventDefault()
    if (e.key === 'ArrowDown') {
        moveDown()
        reInsertLive()
    }
})

document.body.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        e.preventDefault()
        rotate(game.currentPiece)
    }
})
/*-------------------------------- Block Movement Functions --------------------------------*/
function moveDown() {
    for (let y = game.board.length - 1; y > -1; y--) {
        const row = game.board[y]
        for (let x = row.length - 1; x > -1; x--) {
            const cell = row[x]
            if (cell.holdsLivePiece) {
                if (!canMoveDown()) {
                    lockBlock()
                    return
                }
                cell.below.style.backgroundColor = cell.style.backgroundColor
                cell.holdsLivePiece = false
                cell.style.backgroundColor = ''
            }
        }
    }
}

function canMoveDown() {
    for (let y = 0; y < game.board.length; y++) {
        const row = game.board[y];
        for (let x = 0; x < row.length; x++) {
            const cell = row[x];
            if (cell.holdsLivePiece) {
                if (!cell.below) return false
                if (cell.below.locked) return false
            }
        }
    }
    return true
}

function moveRight() {
    for (let i = game.board.length - 1; i > -1; i--) {
        let row = game.board[i]
        for (let j = row.length - 1; j > -1; j--) {
            let cell = row[j]
            if (cell.holdsLivePiece) {
                if (!canMoveRight()) return
                cell.next.style.backgroundColor = cell.style.backgroundColor
                cell.holdsLivePiece = false
                cell.style.backgroundColor = ''
            }
        }
    }
}

function canMoveRight() {
    for (let y = game.board.length - 1; y > -1; y--) {
        const row = game.board[y];
        for (let x = row.length - 1; x > -1; x--) {
            const cell = row[x];
            if (cell.holdsLivePiece) {
                if (!cell.next) return false
                if (cell.next.locked) return false
            }
        }
    }
    return true
}

function moveLeft() {
    for (let row of game.board) {
        for (let cell of row) {
            if (cell.holdsLivePiece) {
                if (!canMoveLeft()) return
                cell.prev.style.backgroundColor = cell.style.backgroundColor
                cell.holdsLivePiece = false
                cell.style.backgroundColor = ''
            }
        }
    }
}

function canMoveLeft() {
    for (let y = 0; y < game.board.length; y++) {
        const row = game.board[y];
        for (let x = 0; x < row.length; x++) {
            const cell = row[x];
            if (cell.holdsLivePiece) {
                if (!cell.prev) return false
                if (cell.prev.locked) return false
            }
        }
    }
    return true
}

function rotate(piece) {
    for (let y = game.board.length - 1; y > -1; y--) {
        const row = game.board[y];
        for (let x = row.length - 1; x > -1; x--) {
            const cell = row[x];
            if (cell.holdsLivePiece) {
                console.log(cell.x, cell.y)
            }
        }
    }
    return true

}
/*-------------------------------- Game Board Functions  --------------------------------*/
function createGameBoard() {
    for (let i = 0; i < 150; i++) {
        let gameCell = document.createElement('div')
        gameCell.className = 'cell'
        gameCell.locked = false
        board.appendChild(gameCell)
    }
}

function listToMatrix(list, elementsPerSubArray) {
    let matrix = [], i, k;
    for (i = 0, k = -1; i < list.length; i++) {
        if (i % elementsPerSubArray === 0) {
            k++;
            matrix[k] = [];
        }
        matrix[k].push(list[i]);
    }
    return matrix;
}

function linkCells(matrix) {
    let prev = null

    for (let y = 0; y < matrix.length; y++) {
        const row = matrix[y];
        for (let x = 0; x < row.length; x++) {
            const cell = row[x];
            cell.x = x
            cell.y = y

            //Linking Previous Cells
            if (row[x + 1]) {
                cell.prev = prev
                prev = cell
            } else {
                cell.prev = prev
                prev = null
            }

            //Linking Next Cells
            cell.next = row[x + 1]

            //Linking Cells Below
            matrix[y + 1] ? cell.below = matrix[y + 1][x] : cell.below = null

            //Linking Cells Above
            matrix[y - 1] ? cell.above = matrix[y - 1][x] : cell.above = null
        }
    }
    return matrix
}

function reInsertLive() {
    for (let row of game.board) {
        for (let cell of row) {
            if (cell.style.backgroundColor && !cell.locked) {
                cell.holdsLivePiece = true
            }
        }
    }
}

function checkLines() {
    let amount = 0
    for (let y = game.board.length - 1; y > -1; y--) {
        const row = game.board[y];
        for (let x = row.length - 1; x > -1; x--) {
            const cell = row[x];
            if (x === 9) amount = 0
            if (cell.locked) amount++
            if (amount === 10) {
                clearLines(y)
            }
        }
    }
}

function clearLines(num) {
    num = Number(num) * 10
    let child = board.childNodes[num]
    for (let i = num; i < num + 10; i++) {
        board.removeChild(child)
        child = child.next
    }
    addLine()
    game.board = linkCells(listToMatrix(board.children, 10))
}

function addLine() {
    for (let i = 0; i < 10; i++) {
        let gameCell = document.createElement('div')
        gameCell.className = 'cell'
        gameCell.locked = false
        board.prepend(gameCell)
    }
}
/*-------------------------------- Tetromino Functions  --------------------------------*/
function renderTetromino(piece) {
    game.currentPiece = piece

    for (let x = 0; x < piece.positions[piece.current].length; x++) {
        let row = piece.positions[piece.current][x]

        for (let y = 0; y < row.length; y++) {

            let current = row[y]
            if (current) {
                let start = game.board[x][y + 3]

                if (!start.style.backgroundColor) {
                    start.style.backgroundColor = piece.color
                    start.holdsLivePiece = true
                }
            }
        }
    }
}

function getRandomBlock() {
    let block = allBlocks[Math.floor(Math.random() * allBlocks.length)];
    return block
}

function lockBlock() {
    game.board.forEach(row => {
        row.forEach((cell) => {
            if (cell.holdsLivePiece) {
                cell.locked = true
                cell.holdsLivePiece = false
                if (!cell.above) {
                    game.lose = true
                }
            }
        })
    })
    if (!game.lose) renderTetromino(getRandomBlock())
}

renderTetromino(getRandomBlock())