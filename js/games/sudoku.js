/**
 * Sudoku Game Implementation
 */

// Sudoku game state
let sudokuState = {
    board: [],
    solution: [],
    selectedCell: null,
    difficulty: 'medium', // easy, medium, hard
    gameStarted: false,
    initialized: false
};

// Initialize Sudoku game when loaded
window.initSudoku = function() {
    if (!sudokuState.initialized) {
        setupSudokuBoard();
        setupSudokuControls();
        sudokuState.initialized = true;
    }
    
    if (!sudokuState.gameStarted) {
        startNewSudokuGame();
    }
};

/**
 * Setup the Sudoku game board
 */
function setupSudokuBoard() {
    const boardElement = document.querySelector('.sudoku-board');
    boardElement.innerHTML = '';
    
    // Create 9x9 cells
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cellElement = document.createElement('div');
            cellElement.className = 'sudoku-cell';
            cellElement.dataset.row = row;
            cellElement.dataset.col = col;
            
            // Add cell click event
            cellElement.addEventListener('click', function() {
                selectSudokuCell(this);
            });
            
            boardElement.appendChild(cellElement);
        }
    }
}

/**
 * Setup Sudoku control buttons
 */
function setupSudokuControls() {
    // Number input buttons
    const numberButtons = document.querySelectorAll('.sudoku-number-btn');
    numberButtons.forEach(button => {
        button.addEventListener('click', function() {
            const number = this.getAttribute('data-number');
            if (sudokuState.selectedCell) {
                enterNumber(number);
            }
        });
    });
    
    // Check solution button
    const checkButton = document.querySelector('.sudoku-check-btn');
    checkButton.addEventListener('click', checkSudokuSolution);
}

/**
 * Start a new Sudoku game
 */
function startNewSudokuGame() {
    // Load a new puzzle based on difficulty
    const puzzle = generateSudokuPuzzle(sudokuState.difficulty);
    sudokuState.board = JSON.parse(JSON.stringify(puzzle.board));
    sudokuState.solution = JSON.parse(JSON.stringify(puzzle.solution));
    sudokuState.gameStarted = true;
    
    // Update the UI
    updateSudokuBoardUI();
    
    // Show notification
    window.showNotification('New Sudoku game started!', 'info');
}

/**
 * Update the Sudoku board UI
 */
function updateSudokuBoardUI() {
    const cells = document.querySelectorAll('.sudoku-cell');
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const value = sudokuState.board[row][col];
        
        // Clear previous state
        cell.textContent = value > 0 ? value : '';
        cell.classList.remove('fixed', 'selected', 'error');
        
        // Set fixed cells (original puzzle numbers)
        if (value > 0) {
            cell.classList.add('fixed');
        }
    });
}

/**
 * Select a Sudoku cell
 * @param {Element} cell - Cell element
 */
function selectSudokuCell(cell) {
    // Deselect previous cell
    if (sudokuState.selectedCell) {
        sudokuState.selectedCell.classList.remove('selected');
    }
    
    // Only allow selection of non-fixed cells
    if (!cell.classList.contains('fixed')) {
        cell.classList.add('selected');
        sudokuState.selectedCell = cell;
    } else {
        sudokuState.selectedCell = null;
    }
}

/**
 * Enter a number in the selected cell
 * @param {string} number - Number to enter (0-9, 0 clears the cell)
 */
function enterNumber(number) {
    if (!sudokuState.selectedCell) return;
    
    const row = parseInt(sudokuState.selectedCell.dataset.row);
    const col = parseInt(sudokuState.selectedCell.dataset.col);
    
    // Clear cell if number is 0
    if (number === '0') {
        sudokuState.board[row][col] = 0;
        sudokuState.selectedCell.textContent = '';
        sudokuState.selectedCell.classList.remove('error');
        return;
    }
    
    // Set number
    const num = parseInt(number);
    sudokuState.board[row][col] = num;
    sudokuState.selectedCell.textContent = num;
    
    // Check if the number is valid
    if (isSudokuNumberValid(row, col, num)) {
        sudokuState.selectedCell.classList.remove('error');
    } else {
        sudokuState.selectedCell.classList.add('error');
    }
    
    // Check if puzzle is complete
    if (isSudokuBoardFilled()) {
        if (isSudokuBoardValid()) {
            window.showNotification('Puzzle solved correctly!', 'success');
        }
    }
}

/**
 * Check if a number is valid in a specific position
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @param {number} num - Number to check
 * @returns {boolean} True if valid
 */
function isSudokuNumberValid(row, col, num) {
    // Check against solution
    return sudokuState.solution[row][col] === num;
}

/**
 * Check if the Sudoku board is completely filled
 * @returns {boolean} True if filled
 */
function isSudokuBoardFilled() {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (sudokuState.board[row][col] === 0) {
                return false;
            }
        }
    }
    return true;
}

/**
 * Check if the current board state is valid
 * @returns {boolean} True if valid
 */
function isSudokuBoardValid() {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (sudokuState.board[row][col] !== sudokuState.solution[row][col]) {
                return false;
            }
        }
    }
    return true;
}

/**
 * Check the current Sudoku solution
 */
function checkSudokuSolution() {
    const cells = document.querySelectorAll('.sudoku-cell');
    let errors = 0;
    
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const value = sudokuState.board[row][col];
        
        if (value > 0 && value !== sudokuState.solution[row][col]) {
            cell.classList.add('error');
            errors++;
        } else {
            cell.classList.remove('error');
        }
    });
    
    if (errors > 0) {
        window.showNotification(`Found ${errors} incorrect values.`, 'error');
    } else if (isSudokuBoardFilled()) {
        window.showNotification('Puzzle solved correctly!', 'success');
    } else {
        window.showNotification('So far, so good!', 'info');
    }
}

/**
 * Generate a Sudoku puzzle
 * @param {string} difficulty - Puzzle difficulty (easy, medium, hard)
 * @returns {Object} Puzzle board and solution
 */
function generateSudokuPuzzle(difficulty) {
    // For simplicity, we'll use a pre-generated puzzle
    // In a real app, we'd use a more sophisticated algorithm
    
    // This is a simple puzzle with solution
    const solution = [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ];
    
    // Create a copy of the solution
    const board = JSON.parse(JSON.stringify(solution));
    
    // Define difficulty levels by how many cells to remove
    const difficultyLevels = {
        easy: 30,
        medium: 45,
        hard: 55
    };
    
    // Remove values based on difficulty
    const cellsToRemove = difficultyLevels[difficulty] || difficultyLevels.medium;
    let removed = 0;
    
    while (removed < cellsToRemove) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        
        if (board[row][col] !== 0) {
            board[row][col] = 0;
            removed++;
        }
    }
    
    return { board, solution };
}

// Register Sudoku app hooks when the registerAppHooks function is available
document.addEventListener('DOMContentLoaded', function() {
    // Check if the registerAppHooks function is available
    if (window.registerAppHooks) {
        registerSudokuHooks();
    } else {
        // Wait for the apps.js to load and define registerAppHooks
        const checkInterval = setInterval(function() {
            if (window.registerAppHooks) {
                clearInterval(checkInterval);
                registerSudokuHooks();
            }
        }, 100);
    }
    
    function registerSudokuHooks() {
        window.registerAppHooks('sudoku', {
            onInit: function() {
                // This is called when the app is first loaded
                try {
                    const savedData = window.loadAppData ? window.loadAppData('sudoku', {
                        difficulty: 'medium',
                        gameStarted: false
                    }) : { difficulty: 'medium', gameStarted: false };
                    
                    sudokuState = {
                        ...sudokuState,
                        ...savedData
                    };
                } catch (e) {
                    console.error('Error loading Sudoku data:', e);
                }
            },
            
            onOpen: function() {
                // This is called when the app is opened
                window.initSudoku();
            },
            
            onClose: function() {
                // This is called when the app is closed
                // Save game state
                if (window.saveAppData) {
                    window.saveAppData('sudoku', {
                        board: sudokuState.board,
                        solution: sudokuState.solution,
                        difficulty: sudokuState.difficulty,
                        gameStarted: sudokuState.gameStarted
                    });
                }
            }
        });
    }
});
