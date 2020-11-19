/*------------------------ Cached Element References ------------------------*/
let board = document.querySelector('#board')
/*-------------------------------- Initiators --------------------------------*/
createGameBoard()
/*-------------------------------- Classes --------------------------------*/
class Tetromino {
    constructor(color, p1, p2, p3, p4) {
        this.color = color;
        this.position = 0
        this[0] = p1;
        this[1] = p2;
        this[2] = p3;
        this[3] = p4;
        this.current = p1
    }
}
/*-------------------------------- Constants --------------------------------*/
const game = {
    board: linkCells(listToMatrix(board.children, 10)),
    lose: null,
    live: false,
    currentTetromino: null,
}
const blocks = []

const zBlock = {
    name: 'z',
    color: 'red',
    positions: [[[1, 1, 0], [0, 1, 1], [0, 0, 0]], [[0, 1, 0], [1, 1, 0], [1, 0, 0]]]
}

const oBlock = {
    name: 'o',
    color: 'yellow',
    positions: [[[1, 1, 1], [1, 1, 1], [0, 0, 0]]]
}

const iBlock = {
    name: 'i',
    color: 'cyan',
    positions: [[[0, 1, 0], [0, 1, 0], [0, 1, 0]], [[1, 1, 1], [0, 0, 0], [0, 0, 0]]]
}
blocks.push(zBlock)
/*---------------------------- Variables (state) ----------------------------*/

let testBlock = new Tetromino('red',
    [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
    [[0, 1, 0], [1, 1, 0], [1, 0, 0]],
)

let testBlock2 = new Tetromino('gold', [[1, 1, 0], [1, 1, 0], [0, 0, 0]])
let testBlock3 = new Tetromino('cyan', [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], [[1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0][1, 0, 0, 0]])

let drop = setInterval(moveDown, 1000)
let play = setInterval(reInsertLive, 1000)
/*----------------------------- Event Listeners -----------------------------*/
document.body.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        moveLeft()
        reInsertLive()
    }
});

document.body.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        moveRight()
        reInsertLive()
    }
});

document.body.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
        moveDown()
        reInsertLive()
    }
})
/*-------------------------------- Functions --------------------------------*/
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

function renderTetromino(piece) {
    for (let x = 0; x < piece.current.length; x++) {
        let row = piece.current[x]
        game.currentTetromino = piece.current

        for (let y = 0; y < row.length; y++) {
            let current = row[y]
            if (current) {
                game.board[x][y + 3].style.backgroundColor = piece.color
                game.board[x][y + 3].holdsLivePiece = true
            }
        }
    }
}
renderTetromino(testBlock3)

function linkCells(matrix) {
    let prev = null

    for (let y = 0; y < matrix.length; y++) {
        const row = matrix[y];
        for (let x = 0; x < row.length; x++) {
            const cell = row[x];

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

function reInsertLive() {
    for (let row of game.board) {
        for (let cell of row) {
            if (cell.style.backgroundColor && !cell.locked) {
                cell.holdsLivePiece = true
            }
        }
    }
}

function lockBlock() {
    game.board.forEach(row => {
        row.forEach((cell) => {
            if (cell.holdsLivePiece) {
                cell.locked = true
                cell.holdsLivePiece = false
            }
        })
    })
    renderTetromino(testBlock2)
}