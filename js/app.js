let board = document.querySelector('#board')
let arr = []
for (let i = 0; i < 150; i++) {
    let gameCell = document.createElement('div')
    gameCell.className = 'cell'
    board.appendChild(gameCell)
    arr.push(gameCell)
}

console.log(arr[0])