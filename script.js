import Grid from "./grid.js";
import Tile from "./tile.js";

const gameBoard = document.getElementById("gameBoard");

const grid = new Grid(gameBoard);

setupInput();

console.log(grid.cellsByColumn())
console.log(grid.randomEmptyCell())
grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);

function setupInput() {
    window.addEventListener("keydown", handleInput, { once: true });
}

function handleInput(e) {
    console.log(e.key)
    switch (e.key) {
        case "ArrowUp":
            moveUp();
            break;
        case "ArrowDown":
            moveDown();
            break;
        case "ArrowLeft":
            moveLeft();
            break;
        case "ArrowRight":
            moveRight();
            break;
        default:
            setupInput();
            return;
    }
    setupInput();
}



function moveUp() {
    return slideTiles(grid.cellsByColumn);
}