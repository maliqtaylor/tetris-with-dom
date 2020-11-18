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
blocks.push(zBlock)
/*---------------------------- Variables (state) ----------------------------*/

let testBlock = new Tetromino('red',
    [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
    [[0, 1, 0], [1, 1, 0], [1, 0, 0]],
)

let testBlock2 = new Tetromino('gold', [[1, 1, 0], [1, 1, 0], [0, 0, 0]])
/*----------------------------- Event Listeners -----------------------------*/
document.body.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        for (let row of game.board) {
            for (let cell of row) {
                if (cell.holdsLivePiece) {
                    if (!cell.prev) return
                    cell.prev.style.backgroundColor = cell.style.backgroundColor
                    cell.prev.holdsLivePiece = true
                    cell.holdsLivePiece = false
                    cell.style.backgroundColor = ''
                }
            }
        }
    }
});

document.body.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        for (let i = game.board.length - 1; i > -1; i--) {
            let row = game.board[i]
            for (let j = row.length - 1; j > -1; j--) {
                let cell = row[j]
                if (cell.holdsLivePiece) {
                    if (!cell.next) return
                    cell.next.style.backgroundColor = cell.style.backgroundColor
                    cell.next.holdsLivePiece = true
                    cell.holdsLivePiece = false
                    cell.style.backgroundColor = ''
                }
            }
        }
    }
});

document.body.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
        for (let i = game.board.length - 1; i > -1; i--) {
            let row = game.board[i]
            for (let j = row.length - 1; j > -1; j--) {
                let cell = row[j]
                if (cell.holdsLivePiece) {
                    if (!cell.below) return
                    cell.below.style.backgroundColor = cell.style.backgroundColor
                    cell.below.holdsLivePiece = true
                    cell.holdsLivePiece = false
                    cell.style.backgroundColor = ''
                }
            }
        }
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

        for (let y = 0; y < row.length; y++) {
            let current = row[y]
            if (current) {
                game.board[x][y + 4].style.backgroundColor = piece.color
                game.board[x][y + 4].holdsLivePiece = true
            }
        }
    }
}
renderTetromino(testBlock2)

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