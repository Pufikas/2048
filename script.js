import Grid from "./grid.js";
import Tile from "./tile.js";

const gameBoard = document.getElementById("gameBoard");

const grid = new Grid(gameBoard);

setupInput();

console.log(grid.cellsByColumn)
console.log(grid.randomEmptyCell())
grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);

function setupInput() {
    window.addEventListener("keydown", handleInput, { once: true });
}

async function handleInput(e) {
    console.log(e.key)
    switch (e.key) {
        case "ArrowUp":
            await moveUp();
            break;
        case "ArrowDown":
            await moveDown();
            break;
        case "ArrowLeft":
            await moveLeft();
            break;
        case "ArrowRight":
            await moveRight();
            break;
        default:
            setupInput();
            return;
            // await since we want to wait for the css animation (when merging etc.)
    }

    grid.cells.forEach(cell => cell.mergeTiles());

    setupInput();
}

// controls begin
    function moveUp() {
        return slideTiles(grid.cellsByColumn);
    }

    function moveDown() {
        return slideTiles(grid.cellsByColumn.map(column => [...column].reverse()));
    }

    function moveLeft() {
        return slideTiles(grid.cellsByRow);
    }

    function moveRight() {
        return slideTiles(grid.cellsByRow.map(row => [...row].reverse()));
    }
// controls end

function slideTiles(cells) {
    return Promise.all(
    cells.flatMap(group => { // single dimension array
        const promises = [];
        for (let i = 1; i < group.length; i++) {
            const cell = group[i];

            if (cell.tile == null) continue;

            let lastValidCell;
            for (let j = i - 1; j >= 0; j--) { // checks if it can move up (above i)
                const moveToCell = group[j];
                
                if (!moveToCell.canAccept(cell.tile)) break; // exit if it can't
                lastValidCell = moveToCell;
            }

            if (lastValidCell != null) {
                promises.push(cell.tile.waitForTransition()); // makes sure to wait for animations to finish
                if (lastValidCell.tile != null) { // if it has a tile
                    lastValidCell.mergeTile = cell.tile;
                } else {
                    lastValidCell.tile = cell.tile;
                }
                cell.tile = null;
            }
        }
        return promises;
    }))
}

