const BLOCK_SIZE = 8;
const NUM_COLS = 80;
const NUM_ROWS = 60;
const BORDER_THICKNESS = 1;

let canvas, ctx;

const cells = new Array(NUM_ROWS);
for (let i = 0; i < NUM_ROWS; i++)
  cells[i] = new Array(NUM_COLS);

for (let i = 0; i < NUM_ROWS; i++) {
  for (let j = 0; j < NUM_COLS; j++) {
    cells[i][j] = false;
  }
}

window.onload = function() {
  canvas = document.getElementById('gameoflife');
  ctx = canvas.getContext('2d');
  
  canvas.width = NUM_COLS * (BLOCK_SIZE + BORDER_THICKNESS) - BORDER_THICKNESS;
  canvas.height = NUM_ROWS * (BLOCK_SIZE + BORDER_THICKNESS) - BORDER_THICKNESS;

  canvas.addEventListener("mousedown", function(e) {
    invertCell(pixelsToCell(e.offsetX), pixelsToCell(e.offsetY));
    clear();
    draw();
  });

  clear();

  let animation;

  document.getElementById("start").addEventListener("click", function() {
    animation = setInterval(function() {
      clear()
      iterate();
      draw();
    }, 100);
  }, false);

  document.getElementById("pause").addEventListener("click", function() {
    clearInterval(animation);
  }, false);
};


function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#EEE";
  
  // Draw column lines
  for (let i = BLOCK_SIZE; i < canvas.height; i += BLOCK_SIZE + BORDER_THICKNESS)
    ctx.fillRect(0, i, canvas.width, BORDER_THICKNESS);
  
  // Draw row lines
  for (let i = BLOCK_SIZE; i < canvas.width; i += BLOCK_SIZE + BORDER_THICKNESS)
    ctx.fillRect(i, 0, BORDER_THICKNESS, canvas.height);
}

function draw() {
  ctx.fillStyle = "#000";
  for (let i = 0; i < NUM_ROWS; i++)
    for (let j = 0; j < NUM_COLS; j++)
      if (cells[i][j])
        ctx.fillRect(j * (BLOCK_SIZE + BORDER_THICKNESS),
                     i * (BLOCK_SIZE + BORDER_THICKNESS),
                     BLOCK_SIZE, BLOCK_SIZE);
};

function iterate() {
  let toSwap = [];
  for (let i = 0; i < NUM_ROWS; i++) {
    for (let j = 0; j < NUM_COLS; j++) {
      let cell = cells[i][j],
          numLive = numLiveNeighbours(j, i);
      if (cell) {
        if (numLive < 2 || numLive > 3)
          toSwap.push([i, j]);
        // Otherwise, remain unchanged
      } else {
        if (numLive == 3)
          toSwap.push([i, j]);
      }
    }
  }
  toSwap.forEach(function(e) {
    invertCell(e[1], e[0])
  });
}

function numLiveNeighbours(x, y) {
  let numLive = 0;
  for (let i = y - 1; i <= y + 1; i++) {
    for (let j = x - 1; j <= x + 1; j++) {
      // Discard invalid entries
      if (i < 0 || i >= NUM_ROWS 
          || j < 0 || j >= NUM_COLS || (i == y && j == x))
        continue;
      if (cells[i][j])
        numLive++;
    }
  }
  return numLive;
}

function pixelsToCell(value) {
  return parseInt(value / (BLOCK_SIZE + BORDER_THICKNESS));
}

function invertCell(x, y) {
  cells[y][x] = !cells[y][x];
}
