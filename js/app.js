let board = document.querySelector('#board')

for (let i = 0; i < 150; i++) {
    let gameCell = document.createElement('div')
    gameCell.className = 'cell'
    board.appendChild(gameCell)
}