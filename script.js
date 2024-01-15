const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const ROWS = 20;
const COL = 10;
let grid = [];

const shapes = {
    T: [
        [
            [0, 1, 0],
            [1, 1, 1]
        ],
        [
            [0,1],
            [1,1],
            [0,1]
        ],
        [
            [1,1,1],
            [0,1,0]
        ],
        [
            [1,0],
            [1,1],
            [1,0]
        ]
    ],
    I: [
        [
            [1,1,1,1]
        ],
        [
            [1],
            [1],
            [1],
            [1]
        ]
    ],
    L: [
        [
            [1,0],
            [1,0],
            [1,1]
        ],
        [
            [0,0,1],
            [1,1,1]
        ],
        [
            [1,1],
            [0,1],
            [0,1]
        ],
        [
            [1,1,1],
            [1,0,0]
        ]
    ],
    J:[
        [
            [0,1],
            [0,1],
            [1,1]
        ],
        [
            [1,1,1],
            [0,0,1]
        ],
        [
            [1,1],
            [1,0],
            [1,0]
        ],
        [
            [1,0,0],
            [1,1,1]
        ]
    ],
    O: [
        [
            [1,1],
            [1,1]
        ]
    ],
    S: [
        [
            [0,1,1],
            [1,1,0]
        ],
        [
            [1,0],
            [1,1],
            [0,1]
        ],
    ],
    Z: [
        [
            [1,1,0],
            [0,1,1]
        ],
        [
            [0,1],
            [1,1],
            [1,0]
        ]
    ]
}

let shapesArray = [shapes.T, shapes.I, shapes.L, shapes.J, shapes.O, shapes.S, shapes.Z];
let shapeRow = 0;
let shapeCol = 4;
let shapeIndex = 0;
let indexRotate = 0;
let currentShape = shapesArray[shapeIndex][0];
let score = 0;
let colors = ['green','blue','yellow','purple'];
let colorIndex = Math.floor(Math.random() * colors.length);
let shapeColor = colors[colorIndex];
let gameSpeed = 1000;

function createGrid(){
    for(let i = 0; i < ROWS; i++){
        let row = [];
        for(let j = 0; j < COL; j++){
            row.push(null);
        }
        grid.push(row);
    }
}

function drawGrid() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COL; j++) {
            let cell = grid[i][j];

            if (cell) {
                ctx.fillStyle = cell;
            } else if (i >= shapeRow && i < shapeRow + currentShape.length && j >= shapeCol && j < shapeCol + currentShape[i - shapeRow].length && currentShape[i - shapeRow][j - shapeCol] === 1) {
                ctx.fillStyle = shapeColor; 
            } else {
                ctx.fillStyle = 'red';
            }

            ctx.fillRect(j * 30, i * 30, 30, 30);
            ctx.strokeRect(j * 30, i * 30, 30, 30);
        }
    }
}

function moveShape() {
    if(!isCollision(shapeCol,shapeRow + 1,currentShape)){
        shapeRow++;
        drawGrid();
    }else{
        lockShape(shapeCol,shapeRow,currentShape);
        checkForFilledLines();
        spawnNewShape();
    }
}

document.addEventListener('keydown', function(event){
    if(event.key === "ArrowLeft" && !isCollision(shapeCol - 1,shapeRow + 1,currentShape)){
        shapeCol--;
        drawGrid();
    }
    else if(event.key === "ArrowRight" && !isCollision(shapeCol + 1,shapeRow + 1,currentShape)){
        shapeCol++;
        drawGrid();
    }
    else if(event.key === "ArrowDown" && !isCollision(shapeCol,shapeRow + 1,currentShape)){
        shapeRow++;
        drawGrid();
    }
    else if(event.key === "ArrowUp"){
        rotateShape();
        drawGrid();
    }
});


function rotateShape(){
    let nextRotationIndex = (indexRotate + 1) % shapesArray[shapeIndex].length; 
    let nextShape = shapesArray[shapeIndex][nextRotationIndex];
    if (!isCollision(shapeCol, shapeRow, nextShape)) { 
        indexRotate = nextRotationIndex;
        currentShape = nextShape;
    }
}

function isCollision(x, y, shape){
    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j] === 1) { 
                if (x + j < 0) {
                    return true;
                }
                
                if (x + j >= COL) {
                    return true;
                }
                
                if (y + i >= ROWS) {
                    return true;
                }
                
                if (grid[y + i] && grid[y + i][x + j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function lockShape(x,y,shape){
    for(let i = 0; i < shape.length; i++){
        for(let j = 0; j < shape[0].length; j++){
            if(shape[i][j] === 1){
                grid[y + i][x + j] = shapeColor;
            }
        }
    }
}

function checkForFilledLines(){
    let newRow = [null,null,null,null,null,null,null,null,null,null];
    for(let i = 0; i < grid.length; i++){
        let counter = 0;
        for(let j = 0; j < grid[0].length; j++){
            if(grid[i][j]){
                counter++;
            }
        }
        if(counter === COL){
            grid.splice(i,1);
            grid.unshift(newRow);
            score++;
            document.getElementById("score").innerHTML = "Score: " + score;
            gameSpeed = gameSpeed - 600;
        }
    }
}

function spawnNewShape(){
    shapeRow = 0;
    shapeCol = 4;
    shapeIndex = Math.floor(Math.random() * shapesArray.length);
    indexRotate = Math.floor(Math.random() * shapesArray[shapeIndex].length);
    currentShape = shapesArray[shapeIndex][indexRotate];
    colorIndex = Math.floor(Math.random() * colors.length);
    shapeColor = colors[colorIndex];
    if(isCollision(shapeCol, shapeRow, currentShape)){
        endGame();
    }else{
        drawGrid();
    }
}

function endGame(){
    clearInterval(moveGame);
    window.location.href = 'C:/Users/elira/OneDrive/Desktop/tetris/gameOver.html';
}

createGrid();
drawGrid();
let moveGame = setInterval(moveShape, gameSpeed);


