/**
 * Calculator App Implementation
 */

// Calculator state
let calculatorState = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
    memory: 0,
    history: [],
    scientificMode: false,
    initialized: false
};

// Initialize Calculator when loaded
window.initCalculator = function() {
    if (!calculatorState.initialized) {
        setupCalculatorUI();
        setupCalculatorEvents();
        calculatorState.initialized = true;
    }
    
    // Load saved state if available
    loadCalculatorState();
    
    // Update the display
    updateCalculatorDisplay();
};

/**
 * Setup Calculator UI
 */
function setupCalculatorUI() {
    const calculatorContainer = document.querySelector('.calculator-container');
    
    // Clear any existing content
    if (calculatorContainer.querySelector('.calculator-message')) {
        calculatorContainer.innerHTML = '';
    }
    
    // Create calculator display
    const displayElement = document.createElement('div');
    displayElement.className = 'calculator-display';
    displayElement.textContent = calculatorState.displayValue;
    calculatorContainer.appendChild(displayElement);
    
    // Create calculator settings
    const settingsElement = document.createElement('div');
    settingsElement.className = 'calculator-settings';
    
    const modeToggle = document.createElement('div');
    modeToggle.className = 'calculator-mode-toggle';
    modeToggle.innerHTML = `
        <label class="switch">
            <input type="checkbox" id="scientific-mode-toggle">
            <span class="slider round"></span>
        </label>
        <span>Scientific Mode</span>
    `;
    settingsElement.appendChild(modeToggle);
    
    calculatorContainer.appendChild(settingsElement);
    
    // Create calculator history section (initially hidden)
    const historyElement = document.createElement('div');
    historyElement.className = 'calculator-history';
    historyElement.innerHTML = `
        <div class="history-header">
            <span>History</span>
            <button class="clear-history-btn">Clear</button>
        </div>
        <div class="history-content"></div>
    `;
    historyElement.style.display = 'none';
    calculatorContainer.appendChild(historyElement);
    
    // Create calculator buttons
    const buttonsElement = document.createElement('div');
    buttonsElement.className = 'calculator-buttons';
    calculatorContainer.appendChild(buttonsElement);
    
    // Add buttons based on mode
    updateCalculatorButtons();
}

/**
 * Update calculator buttons based on mode
 */
function updateCalculatorButtons() {
    const buttonsElement = document.querySelector('.calculator-buttons');
    buttonsElement.innerHTML = '';
    
    // Define buttons for normal mode
    const normalButtons = [
        { text: 'C', action: 'clear', class: 'btn-clear' },
        { text: '±', action: 'negate', class: 'btn-operator' },
        { text: '%', action: 'percent', class: 'btn-operator' },
        { text: '÷', action: 'operator', value: '/', class: 'btn-operator' },
        
        { text: '7', action: 'digit', value: '7', class: 'btn-digit' },
        { text: '8', action: 'digit', value: '8', class: 'btn-digit' },
        { text: '9', action: 'digit', value: '9', class: 'btn-digit' },
        { text: '×', action: 'operator', value: '*', class: 'btn-operator' },
        
        { text: '4', action: 'digit', value: '4', class: 'btn-digit' },
        { text: '5', action: 'digit', value: '5', class: 'btn-digit' },
        { text: '6', action: 'digit', value: '6', class: 'btn-digit' },
        { text: '−', action: 'operator', value: '-', class: 'btn-operator' },
        
        { text: '1', action: 'digit', value: '1', class: 'btn-digit' },
        { text: '2', action: 'digit', value: '2', class: 'btn-digit' },
        { text: '3', action: 'digit', value: '3', class: 'btn-digit' },
        { text: '+', action: 'operator', value: '+', class: 'btn-operator' },
        
        { text: 'MR', action: 'memory-recall', class: 'btn-memory' },
        { text: '0', action: 'digit', value: '0', class: 'btn-digit' },
        { text: '.', action: 'decimal', class: 'btn-digit' },
        { text: '=', action: 'equals', class: 'btn-equals' }
    ];
    
    // Define additional buttons for scientific mode
    const scientificButtons = [
        { text: 'M+', action: 'memory-add', class: 'btn-memory' },
        { text: 'M-', action: 'memory-subtract', class: 'btn-memory' },
        { text: 'MC', action: 'memory-clear', class: 'btn-memory' },
        { text: 'H', action: 'history-toggle', class: 'btn-history' },
        
        { text: 'sin', action: 'function', value: 'sin', class: 'btn-function' },
        { text: 'cos', action: 'function', value: 'cos', class: 'btn-function' },
        { text: 'tan', action: 'function', value: 'tan', class: 'btn-function' },
        { text: 'π', action: 'constant', value: Math.PI, class: 'btn-function' },
        
        { text: 'log', action: 'function', value: 'log', class: 'btn-function' },
        { text: 'ln', action: 'function', value: 'ln', class: 'btn-function' },
        { text: 'e', action: 'constant', value: Math.E, class: 'btn-function' },
        { text: '1/x', action: 'function', value: 'inverse', class: 'btn-function' },
        
        { text: 'x²', action: 'function', value: 'square', class: 'btn-function' },
        { text: '√', action: 'function', value: 'sqrt', class: 'btn-function' },
        { text: 'xʸ', action: 'operator', value: '^', class: 'btn-operator' },
        { text: '(', action: 'parenthesis', value: '(', class: 'btn-operator' },
        
        { text: 'x!', action: 'function', value: 'factorial', class: 'btn-function' },
        { text: 'EXP', action: 'function', value: 'exp', class: 'btn-function' },
        { text: 'rad', action: 'function', value: 'rad', class: 'btn-function' },
        { text: ')', action: 'parenthesis', value: ')', class: 'btn-operator' }
    ];
    
    // Choose which buttons to show
    const buttons = calculatorState.scientificMode ? 
        [...scientificButtons, ...normalButtons] : 
        normalButtons;
    
    // Set grid columns based on mode
    buttonsElement.style.gridTemplateColumns = calculatorState.scientificMode ? 
        'repeat(8, 1fr)' : 'repeat(4, 1fr)';
    
    // Create and add buttons
    buttons.forEach(button => {
        const buttonElement = document.createElement('button');
        buttonElement.textContent = button.text;
        buttonElement.className = `calculator-button ${button.class}`;
        buttonElement.dataset.action = button.action;
        if (button.value !== undefined) {
            buttonElement.dataset.value = button.value;
        }
        buttonsElement.appendChild(buttonElement);
    });
}

/**
 * Setup Calculator event handlers
 */
function setupCalculatorEvents() {
    const calculatorContainer = document.querySelector('.calculator-container');
    
    // Button click events using event delegation
    calculatorContainer.addEventListener('click', function(event) {
        const target = event.target;
        
        if (target.classList.contains('calculator-button')) {
            const action = target.dataset.action;
            const value = target.dataset.value;
            
            // Handle different button actions
            switch (action) {
                case 'digit':
                    inputDigit(value);
                    break;
                case 'decimal':
                    inputDecimal();
                    break;
                case 'operator':
                    handleOperator(value);
                    break;
                case 'equals':
                    handleEquals();
                    break;
                case 'clear':
                    resetCalculator();
                    break;
                case 'negate':
                    negateValue();
                    break;
                case 'percent':
                    calculatePercent();
                    break;
                case 'function':
                    executeFunction(value);
                    break;
                case 'constant':
                    inputConstant(value);
                    break;
                case 'parenthesis':
                    inputParenthesis(value);
                    break;
                case 'memory-add':
                    memoryAdd();
                    break;
                case 'memory-subtract':
                    memorySubtract();
                    break;
                case 'memory-recall':
                    memoryRecall();
                    break;
                case 'memory-clear':
                    memoryClear();
                    break;
                case 'history-toggle':
                    toggleHistory();
                    break;
            }
            
            // Update display after each action
            updateCalculatorDisplay();
        }
    });
    
    // Scientific mode toggle event
    calculatorContainer.addEventListener('change', function(event) {
        if (event.target.id === 'scientific-mode-toggle') {
            calculatorState.scientificMode = event.target.checked;
            updateCalculatorButtons();
            saveCalculatorState();
        }
    });
    
    // History clear button event
    const clearHistoryBtn = calculatorContainer.querySelector('.clear-history-btn');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', function() {
            calculatorState.history = [];
            updateHistoryDisplay();
            saveCalculatorState();
        });
    }
    
    // Keyboard support
    document.addEventListener('keydown', function(event) {
        // Only handle keypresses if calculator app is active
        const calculatorApp = document.querySelector('#calculator-app.active');
        if (!calculatorApp) return;
        
        const key = event.key;
        
        // Handle digits
        if (/^[0-9]$/.test(key)) {
            event.preventDefault();
            inputDigit(key);
        }
        
        // Handle operators
        switch (key) {
            case '+':
            case '-':
            case '*':
            case '/':
                event.preventDefault();
                handleOperator(key);
                break;
            case '.':
            case ',':
                event.preventDefault();
                inputDecimal();
                break;
            case 'Enter':
            case '=':
                event.preventDefault();
                handleEquals();
                break;
            case 'Escape':
            case 'c':
            case 'C':
                event.preventDefault();
                resetCalculator();
                break;
            case 'Backspace':
                event.preventDefault();
                backspace();
                break;
        }
        
        // Update display after each action
        updateCalculatorDisplay();
    });
}

/**
 * Update calculator display
 */
function updateCalculatorDisplay() {
    const displayElement = document.querySelector('.calculator-display');
    if (displayElement) {
        displayElement.textContent = calculatorState.displayValue;
    }
    
    // Update scientific mode toggle
    const modeToggle = document.getElementById('scientific-mode-toggle');
    if (modeToggle) {
        modeToggle.checked = calculatorState.scientificMode;
    }
    
    // Update history display
    updateHistoryDisplay();
}

/**
 * Update history display
 */
function updateHistoryDisplay() {
    const historyContent = document.querySelector('.history-content');
    if (historyContent) {
        historyContent.innerHTML = '';
        
        calculatorState.history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-expression">${item.expression}</div>
                <div class="history-result">${item.result}</div>
            `;
            
            // Add click event to reuse result
            historyItem.addEventListener('click', function() {
                calculatorState.displayValue = item.result.toString();
                calculatorState.firstOperand = parseFloat(item.result);
                calculatorState.waitingForSecondOperand = false;
                calculatorState.operator = null;
                updateCalculatorDisplay();
            });
            
            historyContent.appendChild(historyItem);
        });
    }
}

/**
 * Toggle history visibility
 */
function toggleHistory() {
    const historyElement = document.querySelector('.calculator-history');
    if (historyElement) {
        const currentDisplay = historyElement.style.display;
        historyElement.style.display = currentDisplay === 'none' ? 'block' : 'none';
    }
}

/**
 * Input digit
 * @param {string} digit - Digit to input
 */
function inputDigit(digit) {
    if (calculatorState.waitingForSecondOperand) {
        calculatorState.displayValue = digit;
        calculatorState.waitingForSecondOperand = false;
    } else {
        calculatorState.displayValue = calculatorState.displayValue === '0' ? 
            digit : calculatorState.displayValue + digit;
    }
}

/**
 * Input decimal point
 */
function inputDecimal() {
    // If waiting for second operand, start with '0.'
    if (calculatorState.waitingForSecondOperand) {
        calculatorState.displayValue = '0.';
        calculatorState.waitingForSecondOperand = false;
        return;
    }
    
    // Only add decimal if it doesn't exist
    if (!calculatorState.displayValue.includes('.')) {
        calculatorState.displayValue += '.';
    }
}

/**
 * Handle operator
 * @param {string} nextOperator - Operator to apply
 */
function handleOperator(nextOperator) {
    // Parse current display value
    const inputValue = parseFloat(calculatorState.displayValue);
    
    // If we already have an operator and are waiting for second operand,
    // just update the operator
    if (calculatorState.operator && calculatorState.waitingForSecondOperand) {
        calculatorState.operator = nextOperator;
        return;
    }
    
    // If first operand is null, set it to current input
    if (calculatorState.firstOperand === null) {
        calculatorState.firstOperand = inputValue;
    } else if (calculatorState.operator) {
        // Calculate result of previous operation
        const result = calculate(calculatorState.firstOperand, inputValue, calculatorState.operator);
        
        // Add to history
        addToHistory(
            `${calculatorState.firstOperand} ${getOperatorSymbol(calculatorState.operator)} ${inputValue}`,
            result
        );
        
        calculatorState.displayValue = String(result);
        calculatorState.firstOperand = result;
    }
    
    calculatorState.waitingForSecondOperand = true;
    calculatorState.operator = nextOperator;
}

/**
 * Handle equals button
 */
function handleEquals() {
    // Parse current display value
    const inputValue = parseFloat(calculatorState.displayValue);
    
    if (calculatorState.operator) {
        // Calculate result
        const result = calculate(calculatorState.firstOperand, inputValue, calculatorState.operator);
        
        // Add to history
        addToHistory(
            `${calculatorState.firstOperand} ${getOperatorSymbol(calculatorState.operator)} ${inputValue}`,
            result
        );
        
        calculatorState.displayValue = String(result);
        
        // Reset calculator state
        calculatorState.firstOperand = result;
        calculatorState.waitingForSecondOperand = true;
        calculatorState.operator = null;
        
        // Save state
        saveCalculatorState();
    }
}

/**
 * Perform calculation
 * @param {number} firstOperand - First operand
 * @param {number} secondOperand - Second operand
 * @param {string} operator - Operator to apply
 * @returns {number} Calculation result
 */
function calculate(firstOperand, secondOperand, operator) {
    switch (operator) {
        case '+':
            return firstOperand + secondOperand;
        case '-':
            return firstOperand - secondOperand;
        case '*':
            return firstOperand * secondOperand;
        case '/':
            return secondOperand !== 0 ? firstOperand / secondOperand : 'Error';
        case '^':
            return Math.pow(firstOperand, secondOperand);
        default:
            return secondOperand;
    }
}

/**
 * Reset calculator
 */
function resetCalculator() {
    calculatorState.displayValue = '0';
    calculatorState.firstOperand = null;
    calculatorState.waitingForSecondOperand = false;
    calculatorState.operator = null;
}

/**
 * Negate current value
 */
function negateValue() {
    calculatorState.displayValue = String(-parseFloat(calculatorState.displayValue));
}

/**
 * Calculate percentage
 */
function calculatePercent() {
    const currentValue = parseFloat(calculatorState.displayValue);
    
    if (calculatorState.firstOperand !== null && calculatorState.operator) {
        // If in an operation, calculate percentage of first operand
        switch (calculatorState.operator) {
            case '+':
            case '-':
                calculatorState.displayValue = String(calculatorState.firstOperand * currentValue / 100);
                break;
            case '*':
            case '/':
                calculatorState.displayValue = String(currentValue / 100);
                break;
        }
    } else {
        // Simple percentage
        calculatorState.displayValue = String(currentValue / 100);
    }
}

/**
 * Execute mathematical function
 * @param {string} func - Function to execute
 */
function executeFunction(func) {
    const currentValue = parseFloat(calculatorState.displayValue);
    let result;
    
    switch (func) {
        case 'sin':
            result = Math.sin(currentValue);
            break;
        case 'cos':
            result = Math.cos(currentValue);
            break;
        case 'tan':
            result = Math.tan(currentValue);
            break;
        case 'log':
            result = Math.log10(currentValue);
            break;
        case 'ln':
            result = Math.log(currentValue);
            break;
        case 'inverse':
            result = 1 / currentValue;
            break;
        case 'square':
            result = Math.pow(currentValue, 2);
            break;
        case 'sqrt':
            result = Math.sqrt(currentValue);
            break;
        case 'factorial':
            result = factorial(currentValue);
            break;
        case 'exp':
            result = Math.exp(currentValue);
            break;
        case 'rad':
            result = currentValue * (Math.PI / 180); // Convert degrees to radians
            break;
        default:
            result = currentValue;
    }
    
    // Add to history
    addToHistory(`${func}(${currentValue})`, result);
    
    calculatorState.displayValue = String(result);
    calculatorState.firstOperand = result;
    calculatorState.waitingForSecondOperand = true;
    
    // Save state
    saveCalculatorState();
}

/**
 * Calculate factorial
 * @param {number} n - Number
 * @returns {number} Factorial
 */
function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

/**
 * Input mathematical constant
 * @param {number} value - Constant value
 */
function inputConstant(value) {
    calculatorState.displayValue = String(value);
    calculatorState.waitingForSecondOperand = false;
}

/**
 * Input parenthesis
 * @param {string} parenthesis - Parenthesis to input
 */
function inputParenthesis(parenthesis) {
    // This is a simplified implementation
    // For a full implementation, we would need to track open/close parentheses
    // and implement proper expression parsing
    if (calculatorState.displayValue === '0' || calculatorState.waitingForSecondOperand) {
        calculatorState.displayValue = parenthesis;
        calculatorState.waitingForSecondOperand = false;
    } else {
        calculatorState.displayValue += parenthesis;
    }
}

/**
 * Delete last character
 */
function backspace() {
    if (calculatorState.waitingForSecondOperand) return;
    
    calculatorState.displayValue = calculatorState.displayValue.length > 1 ? 
        calculatorState.displayValue.slice(0, -1) : '0';
}

/**
 * Memory functions
 */
function memoryAdd() {
    calculatorState.memory += parseFloat(calculatorState.displayValue);
    calculatorState.waitingForSecondOperand = true;
    
    // Show confirmation
    window.showNotification('Added to memory', 'info');
}

function memorySubtract() {
    calculatorState.memory -= parseFloat(calculatorState.displayValue);
    calculatorState.waitingForSecondOperand = true;
    
    // Show confirmation
    window.showNotification('Subtracted from memory', 'info');
}

function memoryRecall() {
    calculatorState.displayValue = String(calculatorState.memory);
    calculatorState.waitingForSecondOperand = false;
}

function memoryClear() {
    calculatorState.memory = 0;
    
    // Show confirmation
    window.showNotification('Memory cleared', 'info');
}

/**
 * Add calculation to history
 * @param {string} expression - Expression
 * @param {number|string} result - Result
 */
function addToHistory(expression, result) {
    // Limit history length
    if (calculatorState.history.length >= 10) {
        calculatorState.history.shift();
    }
    
    calculatorState.history.push({
        expression: expression,
        result: result
    });
    
    // Update history display
    updateHistoryDisplay();
}

/**
 * Get operator symbol for display
 * @param {string} operator - Operator
 * @returns {string} Operator symbol
 */
function getOperatorSymbol(operator) {
    switch (operator) {
        case '+': return '+';
        case '-': return '−';
        case '*': return '×';
        case '/': return '÷';
        case '^': return '^';
        default: return operator;
    }
}

/**
 * Save calculator state
 */
function saveCalculatorState() {
    if (window.saveAppData) {
        window.saveAppData('calculator', {
            memory: calculatorState.memory,
            history: calculatorState.history,
            scientificMode: calculatorState.scientificMode
        });
    }
}

/**
 * Load calculator state
 */
function loadCalculatorState() {
    if (window.loadAppData) {
        const savedState = window.loadAppData('calculator', {
            memory: 0,
            history: [],
            scientificMode: false
        });
        
        calculatorState.memory = savedState.memory;
        calculatorState.history = savedState.history;
        calculatorState.scientificMode = savedState.scientificMode;
    }
}

// Register Calculator app hooks when the registerAppHooks function is available
document.addEventListener('DOMContentLoaded', function() {
    // Check if the registerAppHooks function is available
    if (window.registerAppHooks) {
        registerCalculatorHooks();
    } else {
        // Wait for the apps.js to load and define registerAppHooks
        const checkInterval = setInterval(function() {
            if (window.registerAppHooks) {
                clearInterval(checkInterval);
                registerCalculatorHooks();
            }
        }, 100);
    }
    
    function registerCalculatorHooks() {
        window.registerAppHooks('calculator', {
            onInit: function() {
                // This is called when the app is first loaded
                loadCalculatorState();
            },
            
            onOpen: function() {
                // This is called when the app is opened
                window.initCalculator();
            },
            
            onClose: function() {
                // This is called when the app is closed
                saveCalculatorState();
            }
        });
    }
});
