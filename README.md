# Tetris in the DOM

## Objective
---
A tetris game using DOM Manpulation, Javascript, HTML, and CSS.
## Minimum Requirements
---
* Users should be able to click on a button to play/pause the game.
  
* Once the game starts radomized Tetris pieces should fall from the top of the game board. 
  
* A Tetris piece should become settled once it falls to the 'bottom' of the game board or falls onto another settle piece.

* Once a horizontal line of the game board is occupied by Tetris pieces it should clear and the other elements in the board should cascade down.

* Users should be able to hold a Tetris piece for later. If they choose to hold, they must settle a new piece before they are able to hold again.

* If the a Tetris pieces hit the top of the game board the game should end.
---
## Wireframe
<img src = https://i.imgur.com/3F1t9Oe.png/>

---
## Psuedo Code
1.Define the required constants:
   *Tetris peices 
   *Score 
   *Level
   *Game board rows and colomns 

2. Set up event listeners:
   * Add event listener to the game board and give each cell an address (x, y) 
   * Add event listener to the control buttom to collapse/expand the control menu.
   * Add event listener to the play/pause button to either stop or start the game.
   * Listen for specific keypresses if the game is live so the user can manipulate their peice.  
