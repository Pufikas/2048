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
            if (!canMoveUp()) {
                setupInput();
                return;
            }

            await moveUp();
            break;

        case "ArrowDown":
            if (!canMoveDown()) {
                setupInput();
                return;
            }
            await moveDown();
            break;

        case "ArrowLeft":
            if (!canMoveLeft()) {
                setupInput();
                return;
            }
            await moveLeft();
            break;

        case "ArrowRight":
            if (!canMoveRight()) {
                setupInput();
                return;
            }
            await moveRight();
            break;

        default:
            setupInput();
            return;
            // await since we want to wait for the css animation (when merging etc.)
    }

    grid.cells.forEach(cell => cell.mergeTiles());

    const newTile = new Tile(gameBoard);
    grid.randomEmptyCell().tile = newTile;

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

    // controls can move up...

    function canMoveUp() {
        return canMove(grid.cellsByColumn);
    }

    function canMoveDown() {
        return canMove(grid.cellsByColumn.map(column => [...column].reverse()));
    }

    function canMoveLeft() {
        return canMove(grid.cellsByRow);
    }

    function canMoveRight() {
        return canMove(grid.cellsByRow.map(row => [...row].reverse()));
    }

    function canMove(cells) {
        return cells.some(group => {
            return group.some((cell, index) => {
                if (index === 0) return false;
                if (cell.tile == null) return false;

                const moveToCell = group[index - 1];

                return moveToCell.canAccept(cell.tile);
            })
        })
    }

    // controls end
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

