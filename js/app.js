/*------------------------ Cached Element References ------------------------*/
let board = document.querySelector('#board')
let loseMssg = document.querySelector('h2')
let holdImg = document.querySelector('#holdImg')
let nextImg = document.querySelector('#nextImg')
/*-------------------------------- Initiators --------------------------------*/
createGameBoard()
/*-------------------------------- Tetromino Class --------------------------------*/
class Tetromino {
    constructor(name, color, positions, startX, startY) {
        this.name = name
        this.color = color;
        this.positions = positions
        this.current = 0
        this.startX = startX
        this.startY = startY
        this.currentX = startX
        this.currentY = startY
    }
}
/*-------------------------------- Constants --------------------------------*/
const game = {
    board: linkCells(listToMatrix(board.children, 10)),
    lose: null,
    live: false,
    started: false,
    currentPiece: null,
}
//Holder for all game piece positions
const allPositions = {}
//Holder for all game pieces
const allBlocks = []
//Block Queue
const blockQueue = []
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
allPositions.l = [[[0, 0, 1], [1, 1, 1], [0, 0, 0]], [[1, 1, 0], [0, 1, 0], [0, 1, 0]]]
allPositions.l.push([[0, 0, 0], [1, 1, 1], [1, 0, 0]])
allPositions.l.push([[0, 1, 0], [0, 1, 0], [0, 1, 1]])

/*---------------------------- Blocks ----------------------------*/
const tBlock = new Tetromino('tBlock', 'darkviolet', allPositions.t, 5, 2)
allBlocks.push(tBlock)

const zBlock = new Tetromino('zBlock', 'red', allPositions.z, 5, 2)
allBlocks.push(zBlock)

const sBlock = new Tetromino('sBlock', 'chartreuse', allPositions.s, 5, 2)
allBlocks.push(sBlock)

const oBlock = new Tetromino('oBlock', 'gold', allPositions.o, 6, 2)
allBlocks.push(oBlock)

const lBlock = new Tetromino('lBlock', 'orange', allPositions.l, 5, 2)
allBlocks.push(lBlock)

const jBlock = new Tetromino('jBlock', 'blue', allPositions.j, 5, 2)
allBlocks.push(jBlock)

const iBlock = new Tetromino('iBlock', 'cyan', allPositions.i, 6, 3)
allBlocks.push(iBlock)
/*---------------------------- Intervals ----------------------------*/
// let dropTimer = setInterval(moveDown, 1000)
// let reInsertTimer = setInterval(reInsertLive, 1000)
// let clearTimer = setInterval(checkLines, 10)
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
                    if (!game.lose) {
                        renderTetromino(blockQueue.shift())
                        blockQueue.push(getRandomBlock())
                        nextImg.src = `./images/${blockQueue[0].name}.png`
                        nextImg.className = `${blockQueue[0].name}`
                    }
                    return
                }
                cell.below.style.backgroundColor = cell.style.backgroundColor
                cell.holdsLivePiece = false
                cell.style.backgroundColor = ''
            }
        }
    }
    if (game.currentPiece.currentY < 14) game.currentPiece.currentY += 1
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
    for (let y = game.board.length - 1; y > -1; y--) {
        let row = game.board[y]
        for (let x = row.length - 1; x > -1; x--) {
            let cell = row[x]
            if (cell.holdsLivePiece) {
                if (!canMoveRight()) return
                cell.next.style.backgroundColor = cell.style.backgroundColor
                cell.holdsLivePiece = false
                cell.style.backgroundColor = ''
            }
        }
    }
    if (game.currentPiece.currentX < 9) game.currentPiece.currentX += 1
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
    if (game.currentPiece.currentX > 0) game.currentPiece.currentX -= 1
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
    if (canMoveDown() && canMoveLeft() && canMoveRight()) {
        if (piece.positions[piece.current + 1]) {
            piece.current += 1
        } else {
            piece.current = 0
        }

        clearBoard()
        renderRotate(piece)
    }
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

function clearBoard() {
    for (let row of game.board) {
        for (let cell of row) {
            if (!cell.locked) {
                cell.style.backgroundColor = ''
            }
        }
    }

}
/*-------------------------------- Tetromino Functions  --------------------------------*/
function renderTetromino(piece) {
    game.currentPiece = piece
    game.currentPiece.currentY = piece.startY
    game.currentPiece.currentX = piece.startX
    game.currentPiece.current = 0
    let refX = game.currentPiece.startX
    let refY = game.currentPiece.startY
    let num = 0

    for (let y = piece.positions[piece.current].length - 1; y > -1; y--) {
        let row = piece.positions[piece.current][y]
        for (let x = row.length - 1; x > -1; x--) {
            let current = row[x]
            if (num === row.length) {
                num = 0
                refX = piece.startX
                refY > 0 ? refY-- : null
            }

            let start = game.board[refY][refX]

            if (start.style.backgroundColor) {
                clearBoard()
                if (start.above) start = start.above
                addColor(current, start, piece)
            } else {
                addColor(current, start, piece)
            }

            refX > 0 ? refX-- : null
            num++
        }
    }
}

function addColor(current, start, piece) {
    if (current) {
        if (!start.style.backgroundColor) {
            start.style.backgroundColor = piece.color
            start.holdsLivePiece = true
        }
    }
}

function renderRotate(piece) {
    game.currentPiece = piece
    let refX = game.currentPiece.currentX
    let refY = game.currentPiece.currentY
    let num = 0

    for (let y = piece.positions[piece.current].length - 1; y > -1; y--) {
        let row = piece.positions[piece.current][y]
        for (let x = row.length - 1; x > -1; x--) {
            let current = row[x]

            if (num === row.length) {
                num = 0
                refX = piece.currentX
                refY > 0 ? refY-- : null
            }

            let start = game.board[refY][refX]

            if (current) {
                if (!start.locked) {
                    start.style.backgroundColor = piece.color
                    start.holdsLivePiece = true
                }
            }
            refX > 0 ? refX-- : null
            num++
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
                if (!cell.above && cell.x >= 3 && cell.y <= 5) {
                    game.lose = true
                    loseMssg.style.color = 'red'
                }
            }
        })
    })
}

function renderFirstBlock() {
    if (!game.started) {
        blockQueue.push(getRandomBlock())
        blockQueue.push(getRandomBlock())
        renderTetromino(blockQueue.shift())
        nextImg.src = `./images/${blockQueue[0].name}.png`
        nextImg.className = `${blockQueue[0].name}`
        blockQueue.push(getRandomBlock())
    }
    game.started = true
}

renderFirstBlock()