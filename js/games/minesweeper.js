/**
 * Minesweeper Game Implementation
 */

// Minesweeper game state
let minesweeperState = {
    grid: [],
    mines: [],
    rows: 9,
    cols: 9,
    totalMines: 10,
    flagMode: false,
    gameOver: false,
    gameWon: false,
    timerInterval: null,
    timeElapsed: 0,
    minesRemaining: 10,
    initialized: false
};

// Initialize Minesweeper game when loaded
window.initMinesweeper = function() {
    if (!minesweeperState.initialized) {
        setupMinesweeperGrid();
        setupMinesweeperControls();
        minesweeperState.initialized = true;
    }
    
    startNewMinesweeperGame();
};

/**
 * Setup the Minesweeper grid
 */
function setupMinesweeperGrid() {
    const gridElement = document.querySelector('.minesweeper-grid');
    gridElement.innerHTML = '';
    
    // Create grid cells
    for (let row = 0; row < minesweeperState.rows; row++) {
        for (let col = 0; col < minesweeperState.cols; col++) {
            const cellElement = document.createElement('div');
            cellElement.className = 'minesweeper-cell';
            cellElement.dataset.row = row;
            cellElement.dataset.col = col;
            
            // Add cell click events
            cellElement.addEventListener('click', function(e) {
                handleCellClick(this);
            });
            
            cellElement.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                toggleFlag(this);
                return false;
            });
            
            gridElement.appendChild(cellElement);
        }
    }
}

/**
 * Setup Minesweeper controls
 */
function setupMinesweeperControls() {
    // Flag mode toggle
    const flagModeCheckbox = document.getElementById('flag-mode');
    flagModeCheckbox.addEventListener('change', function() {
        minesweeperState.flagMode = this.checked;
    });
    
    // New game button
    const newGameButton = document.querySelector('.new-game-btn');
    newGameButton.addEventListener('click', startNewMinesweeperGame);
    
    // Smiley face
    const smiley = document.querySelector('.smiley');
    smiley.addEventListener('click', startNewMinesweeperGame);
}

/**
 * Start a new Minesweeper game
 */
function startNewMinesweeperGame() {
    // Reset game state
    minesweeperState.grid = [];
    minesweeperState.mines = [];
    minesweeperState.gameOver = false;
    minesweeperState.gameWon = false;
    minesweeperState.minesRemaining = minesweeperState.totalMines;
    minesweeperState.timeElapsed = 0;
    
    // Clear timer
    if (minesweeperState.timerInterval) {
        clearInterval(minesweeperState.timerInterval);
        minesweeperState.timerInterval = null;
    }
    
    // Initialize grid
    initializeMinesweeperGrid();
    
    // Update UI
    updateMinesweeperUI();
    
    // Reset smiley
    document.querySelector('.smiley').textContent = '😊';
    
    // Update counters
    document.getElementById('mines-count').textContent = minesweeperState.minesRemaining;
    document.getElementById('timer').textContent = '0';
    
    // Show notification
    window.showNotification('New Minesweeper game started!', 'info');
}

/**
 * Initialize the Minesweeper grid with mines
 */
function initializeMinesweeperGrid() {
    // Create empty grid
    for (let row = 0; row < minesweeperState.rows; row++) {
        minesweeperState.grid[row] = [];
        for (let col = 0; col < minesweeperState.cols; col++) {
            minesweeperState.grid[row][col] = {
                revealed: false,
                isMine: false,
                adjacentMines: 0,
                flagged: false
            };
        }
    }
    
    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < minesweeperState.totalMines) {
        const row = Math.floor(Math.random() * minesweeperState.rows);
        const col = Math.floor(Math.random() * minesweeperState.cols);
        
        if (!minesweeperState.grid[row][col].isMine) {
            minesweeperState.grid[row][col].isMine = true;
            minesweeperState.mines.push({ row, col });
            minesPlaced++;
        }
    }
    
    // Calculate adjacent mines
    for (let row = 0; row < minesweeperState.rows; row++) {
        for (let col = 0; col < minesweeperState.cols; col++) {
            if (!minesweeperState.grid[row][col].isMine) {
                minesweeperState.grid[row][col].adjacentMines = countAdjacentMines(row, col);
            }
        }
    }
}

/**
 * Count mines adjacent to a cell
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @returns {number} Count of adjacent mines
 */
function countAdjacentMines(row, col) {
    let count = 0;
    
    // Check all 8 adjacent cells
    for (let r = Math.max(0, row - 1); r <= Math.min(minesweeperState.rows - 1, row + 1); r++) {
        for (let c = Math.max(0, col - 1); c <= Math.min(minesweeperState.cols - 1, col + 1); c++) {
            if ((r !== row || c !== col) && minesweeperState.grid[r][c].isMine) {
                count++;
            }
        }
    }
    
    return count;
}

/**
 * Update the Minesweeper UI
 */
function updateMinesweeperUI() {
    const cells = document.querySelectorAll('.minesweeper-cell');
    
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const cellData = minesweeperState.grid[row][col];
        
        // Reset cell classes
        cell.className = 'minesweeper-cell';
        cell.textContent = '';
        
        // Apply cell state
        if (cellData.revealed) {
            cell.classList.add('revealed');
            
            if (cellData.isMine) {
                cell.classList.add('mine-revealed');
            } else if (cellData.adjacentMines > 0) {
                cell.textContent = cellData.adjacentMines;
                
                // Add color based on number
                switch (cellData.adjacentMines) {
                    case 1: cell.style.color = 'blue'; break;
                    case 2: cell.style.color = 'green'; break;
                    case 3: cell.style.color = 'red'; break;
                    case 4: cell.style.color = 'navy'; break;
                    case 5: cell.style.color = 'brown'; break;
                    case 6: cell.style.color = 'teal'; break;
                    case 7: cell.style.color = 'black'; break;
                    case 8: cell.style.color = 'gray'; break;
                }
            }
        } else if (cellData.flagged) {
            cell.classList.add('flagged');
        }
    });
}

/**
 * Handle cell click
 * @param {Element} cell - Cell element
 */
function handleCellClick(cell) {
    if (minesweeperState.gameOver) return;
    
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const cellData = minesweeperState.grid[row][col];
    
    // Start timer on first click
    if (!minesweeperState.timerInterval) {
        startTimer();
    }
    
    // Handle flag mode
    if (minesweeperState.flagMode) {
        toggleFlag(cell);
        return;
    }
    
    // Skip if flagged
    if (cellData.flagged) return;
    
    // Already revealed
    if (cellData.revealed) return;
    
    // Reveal cell
    revealCell(row, col);
    
    // Update UI
    updateMinesweeperUI();
    
    // Check win condition
    checkWinCondition();
}

/**
 * Reveal a cell
 * @param {number} row - Row index
 * @param {number} col - Column index
 */
function revealCell(row, col) {
    const cellData = minesweeperState.grid[row][col];
    
    // Skip if already revealed or flagged
    if (cellData.revealed || cellData.flagged) return;
    
    // Reveal the cell
    cellData.revealed = true;
    
    // If it's a mine, game over
    if (cellData.isMine) {
        gameOver(false);
        return;
    }
    
    // If it's a zero, reveal adjacent cells
    if (cellData.adjacentMines === 0) {
        // Reveal all neighboring cells
        for (let r = Math.max(0, row - 1); r <= Math.min(minesweeperState.rows - 1, row + 1); r++) {
            for (let c = Math.max(0, col - 1); c <= Math.min(minesweeperState.cols - 1, col + 1); c++) {
                if (r !== row || c !== col) {
                    revealCell(r, c);
                }
            }
        }
    }
}

/**
 * Toggle flag on a cell
 * @param {Element} cell - Cell element
 */
function toggleFlag(cell) {
    if (minesweeperState.gameOver) return;
    
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const cellData = minesweeperState.grid[row][col];
    
    // Skip if revealed
    if (cellData.revealed) return;
    
    // Toggle flag
    cellData.flagged = !cellData.flagged;
    
    // Update mines remaining counter
    minesweeperState.minesRemaining += cellData.flagged ? -1 : 1;
    document.getElementById('mines-count').textContent = minesweeperState.minesRemaining;
    
    // Update UI
    updateMinesweeperUI();
}

/**
 * Check win condition
 */
function checkWinCondition() {
    // Check if all non-mine cells are revealed
    for (let row = 0; row < minesweeperState.rows; row++) {
        for (let col = 0; col < minesweeperState.cols; col++) {
            const cell = minesweeperState.grid[row][col];
            
            // If there's a non-mine cell that's not revealed, game not won yet
            if (!cell.isMine && !cell.revealed) {
                return;
            }
        }
    }
    
    // All non-mine cells revealed, game won
    gameOver(true);
}

/**
 * Handle game over
 * @param {boolean} isWin - True if game won, false if lost
 */
function gameOver(isWin) {
    minesweeperState.gameOver = true;
    minesweeperState.gameWon = isWin;
    
    // Stop timer
    if (minesweeperState.timerInterval) {
        clearInterval(minesweeperState.timerInterval);
        minesweeperState.timerInterval = null;
    }
    
    // Update smiley
    document.querySelector('.smiley').textContent = isWin ? '😎' : '😵';
    
    // Reveal all mines if lost
    if (!isWin) {
        minesweeperState.mines.forEach(mine => {
            minesweeperState.grid[mine.row][mine.col].revealed = true;
        });
        
        updateMinesweeperUI();
    }
    
    // Show notification
    window.showNotification(
        isWin ? 'You won! All mines found!' : 'Game over! You hit a mine!',
        isWin ? 'success' : 'error'
    );
}

/**
 * Start the game timer
 */
function startTimer() {
    // Reset timer
    minesweeperState.timeElapsed = 0;
    document.getElementById('timer').textContent = '0';
    
    // Start timer
    minesweeperState.timerInterval = setInterval(() => {
        minesweeperState.timeElapsed++;
        document.getElementById('timer').textContent = minesweeperState.timeElapsed;
        
        // Cap at 999
        if (minesweeperState.timeElapsed >= 999) {
            clearInterval(minesweeperState.timerInterval);
        }
    }, 1000);
}

// Register Minesweeper app hooks when the registerAppHooks function is available
document.addEventListener('DOMContentLoaded', function() {
    // Check if the registerAppHooks function is available
    if (window.registerAppHooks) {
        registerMinesweeperHooks();
    } else {
        // Wait for the apps.js to load and define registerAppHooks
        const checkInterval = setInterval(function() {
            if (window.registerAppHooks) {
                clearInterval(checkInterval);
                registerMinesweeperHooks();
            }
        }, 100);
    }
    
    function registerMinesweeperHooks() {
        window.registerAppHooks('minesweeper', {
            onInit: function() {
                // This is called when the app is first loaded
                try {
                    const savedData = window.loadAppData ? window.loadAppData('minesweeper', {
                        rows: 9,
                        cols: 9,
                        totalMines: 10
                    }) : { rows: 9, cols: 9, totalMines: 10 };
                    
                    minesweeperState = {
                        ...minesweeperState,
                        ...savedData
                    };
                } catch (e) {
                    console.error('Error loading Minesweeper data:', e);
                }
            },
            
            onOpen: function() {
                // This is called when the app is opened
                window.initMinesweeper();
            },
            
            onClose: function() {
                // This is called when the app is closed
                // Stop timer
                if (minesweeperState.timerInterval) {
                    clearInterval(minesweeperState.timerInterval);
                    minesweeperState.timerInterval = null;
                }
                
                // Save game state
                if (window.saveAppData) {
                    window.saveAppData('minesweeper', {
                        rows: minesweeperState.rows,
                        cols: minesweeperState.cols,
                        totalMines: minesweeperState.totalMines
                    });
                }
            }
        });
    }
});
