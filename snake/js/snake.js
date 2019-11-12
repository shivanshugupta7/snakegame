const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")
let grid = 14;
let count = 0;
let lastMove = 'right';
let score = document.querySelector('#score');
let isMoving = false;
let keys = "";

for (let i = 0; i < localStorage.length; i++) {
    keys += localStorage.key(i)
}

console.log(keys)

let snake =
{
    x: 140,
    y: 140,
    cells: [{ x: 140, y: 140 }, { x: 126, y: 140 }],
    die: false,
    eatApple: false,
};

let apple = {
    x: 280,
    y: 280
};

if (keys.includes("move")) {
    let alldata = JSON.parse(localStorage.getItem("move"))
    snake.cells = alldata.cells;
    snake.x = alldata.cells[0].x;
    snake.y = alldata.cells[0].y;
    count = alldata.score;
    score.innerHTML = "Score : " + count;
    lastMove = alldata.lastMove;
    apple = alldata.apple;
}

const drawApple = () => {
    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, grid - 1, grid - 1);
}

const drawSnake = () => {
    context.fillStyle = '#00ff00';
    if (snake.cells.length > 0) {
        context.fillRect(snake.cells[0].x, snake.cells[0].y, grid - 1, grid - 1);//to show first rectangle
        context.fillStyle = '#333300';

        for (let i = 1; i < snake.cells.length; i++)
            context.fillRect(snake.cells[i].x, snake.cells[i].y, grid - 1, grid - 1); //to show full snake
    }
}


const moveSnake = (dx, dy) => {
    snake.x += dx;
    snake.y += dy;
    snake.cells.unshift({ x: snake.x, y: snake.y });
    if (!snake.eatApple) snake.cells.pop();
    else snake.eatApple = false;
}

const checkBoundary = () => {
    if (snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height) {
        snake.die = true;
    }
}

const getRandomInt = () => {
    return Math.floor(Math.random() * 25) * grid;
}

const checkAppleIsOnSnake = () => {
    for (let i = 0; i < snake.cells.length; i++) {
        if (apple.x == snake.cells[i].x && apple.y == snake.cells[i].y) {
            return true;
        }
    }
}

const checkSnakeBiteItself = () => {
    for (let i = 4; i < snake.cells.length; i++) {
        if (snake.x == snake.cells[i].x && snake.y == snake.cells[i].y) {
            snake.die = true;
        }
    }
}


const generateApple = () => {
    apple.x = getRandomInt();
    apple.y = getRandomInt();
    if (checkAppleIsOnSnake()) {
        generateApple();
    }
}

const checkEatApple = () => {
    if (snake.x == apple.x && snake.y == apple.y) {
        snake.eatApple = true;
        generateApple();
        drawApple();
        count += 1;
    }
    score.innerHTML = "Score : " + count;
}

const gameOver = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    snake.cells = [];
    apple.x = -10000
    apple.y = -10000
    context.fillStyle = 'red';
    context.font = "30px Arial";
    context.textAlign = "center";
    context.fillText("Game Over", canvas.width / 2, canvas.height / 2);
    if (keys.includes("move")) {
        localStorage.removeItem("move")
    }
}

document.addEventListener('keydown', e => {
    let dx = 0, dy = 0;
    // left key
    if (e.keyCode == 37 && lastMove != 'right' && isMoving == true) {
        dx = -grid;
        dy = 0;
        lastMove = 'left';
        if (e.keyCode == 37) {
            return false
        }
    }
    // up key
    else if (e.keyCode == 38 && lastMove != 'down' && isMoving == true) {
        dy = -grid;
        dx = 0;
        lastMove = 'up';
        if (e.keyCode == 38) {
            return false
        }
    }
    // right key
    else if (e.keyCode == 39 && lastMove != 'left' && isMoving == true) {
        dx = grid;
        dy = 0;
        lastMove = 'right';
        if (e.keyCode == 39) {
            return false
        }
    }
    // down key
    else if (e.keyCode == 40 && lastMove != 'up' && isMoving == true) {
        dy = grid;
        dx = 0;
        lastMove = 'down';
        if (e.keyCode == 40) {
            return false
        }
    } else {
        return;
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    moveSnake(dx, dy);
    checkBoundary();
    checkSnakeBiteItself();
    checkEatApple();
    if (snake.die) {
        gameOver();
        return;
    }
    drawSnake();
    drawApple();
});

let setinterval;
const resume = () => {
    setinterval = setInterval(() => {
        dx = 0;
        dy = 0;
        if (lastMove == 'left') {
            dx = -grid;
            dy = 0;
            lastMove = 'left';
        }
        else if (lastMove == 'up') {
            dy = -grid;
            dx = 0;
            lastMove = 'up';
        }
        else if (lastMove == 'right') {
            dx = grid;
            dy = 0;
            lastMove = 'right';
        }
        else if (lastMove == 'down') {
            dy = grid;
            dx = 0;
            lastMove = 'down';
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        moveSnake(dx, dy);
        checkBoundary();
        checkSnakeBiteItself();
        checkEatApple();
        if (snake.die) {
            gameOver();
        }
        drawSnake();
        drawApple();
        isMoving = true;
       
    }, 200)
}
resume();
const pause = () => {
    clearInterval(setinterval);
    isMoving = false;
}

document.addEventListener('keydown', e => {
    if (e.keyCode == 32) {
        pause();
        let data = {
            cells: snake.cells,
            score: count,
            lastMove: lastMove,
            apple: apple
        }
        localStorage.setItem('move', JSON.stringify(data));
        isMoving = false;
    }
    else if (e.keyCode == 13) {
        if (!isMoving) {
            if (keys.includes('move')) {
                let data = JSON.parse(localStorage.getItem('move'));
                snake.cells = data.cells;
                if (data.cells.length > 0) {
                    snake.x = data.cells[0].x;
                    snake.y = data.cells[0].y;
                    count = data.score;
                    score.innerHTML = "Score : " + count;
                    lastMove = data.lastMove;
                    apple = data.apple;
                }
            }
            resume();
            isMoving = true;
        }
    }
    else if (e.ctrlKey && e.altKey && e.keyCode == 78) {
        if (keys.includes('move')) {
            localStorage.removeItem('move');
        }
        location = location.href;
        resume();
        isMoving = true;
    }
})
