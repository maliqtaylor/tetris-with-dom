# Tetris in the DOM

## Objective
---

A tetris game using DOM Manpulation, Javascript, HTML, and CSS.

---

[Check out the game here!](http://tetris-dom-project.surge.sh/)
<img src="https://i.imgur.com/YaRbXB2.png">

---
## Technologies Used
* HTML
* CSS
* JavaScript
---
## Minimum Requirements
* Users should be able to click on a button to play/pause the game.
  
* Once the game starts randomized Tetris pieces should fall from the top of the game board. 
  
* A Tetris piece should become settled once it falls to the 'bottom' of the game board or falls onto another settle piece.

* Once a horizontal line of the game board is occupied by Tetris pieces it should clear and the other elements in the board should cascade down.

* Users should be able to hold a Tetris piece for later. If they choose to hold, they must settle a new piece before they are able to hold again.

* If a Tetris piece hits the top of the game board the game should end.
---
## Wireframe
<img src = https://i.imgur.com/3F1t9Oe.png/>

---
## Psuedo Code
* Define the required constants:
   * Tetris peices 
   * Score 
   * Level
   * Game board rows and colomns 

* Set up event listeners:
   * Add event listener to the game board and give each cell an address (x, y) 
   * Add event listener to the control buttom to collapse/expand the control menu.
   * Add event listener to the play/pause button to either stop or start the game.
   * Listen for specific keypresses if the game is live so the user can manipulate their peice. 
--- 
## Icebox
* Review my code and refactor/make more dry
* Add a score
* Improve rotate functionality
* Implement buttons
* Fix render when the tetris stack gets to the top of the board
* Add a live background/more styling