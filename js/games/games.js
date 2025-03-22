/**
 * Common game functionality and management
 */

document.addEventListener('DOMContentLoaded', function() {
    // Ensure the games are initialized when app loads
    initializeGames();
    
    /**
     * Initialize games subsystem
     */
    function initializeGames() {
        // Register global game event handlers
        registerGameEventHandlers();
        
        // Load saved game data
        loadGameData();
    }
    
    /**
     * Register event handlers for game-related functionality
     */
    function registerGameEventHandlers() {
        // Handle keyboard input for games
        document.addEventListener('keydown', function(e) {
            // Only handle keypresses if a game app is active
            const activeGameApp = document.querySelector('.app-screen.active[id$="-app"]');
            if (!activeGameApp) return;
            
            const gameId = activeGameApp.id.replace('-app', '');
            
            // Game-specific key handlers
            if (gameId === 'sudoku') {
                handleSudokuKeypress(e);
            } else if (gameId === 'minesweeper') {
                handleMinesweeperKeypress(e);
            }
        });
    }
    
    /**
     * Handle keyboard input for Sudoku
     * @param {KeyboardEvent} e - Keyboard event
     */
    function handleSudokuKeypress(e) {
        // Number keys 1-9 for entering numbers
        if (e.key >= '1' && e.key <= '9') {
            const numberButtons = document.querySelectorAll('.sudoku-number-btn');
            const button = Array.from(numberButtons).find(btn => btn.getAttribute('data-number') === e.key);
            if (button) button.click();
            e.preventDefault();
        }
        
        // Delete or Backspace for clearing cell
        if (e.key === 'Delete' || e.key === 'Backspace') {
            const clearButton = document.querySelector('.sudoku-clear-btn');
            if (clearButton) clearButton.click();
            e.preventDefault();
        }
        
        // Enter for checking solution
        if (e.key === 'Enter') {
            const checkButton = document.querySelector('.sudoku-check-btn');
            if (checkButton) checkButton.click();
            e.preventDefault();
        }
    }
    
    /**
     * Handle keyboard input for Minesweeper
     * @param {KeyboardEvent} e - Keyboard event
     */
    function handleMinesweeperKeypress(e) {
        // F key for toggling flag mode
        if (e.key === 'f' || e.key === 'F') {
            const flagModeCheckbox = document.getElementById('flag-mode');
            if (flagModeCheckbox) {
                flagModeCheckbox.checked = !flagModeCheckbox.checked;
                flagModeCheckbox.dispatchEvent(new Event('change'));
            }
            e.preventDefault();
        }
        
        // R key for new game
        if (e.key === 'r' || e.key === 'R') {
            const newGameButton = document.querySelector('.new-game-btn');
            if (newGameButton) newGameButton.click();
            e.preventDefault();
        }
    }
    
    /**
     * Load saved game data from storage
     */
    function loadGameData() {
        const gameSettings = window.loadAppData('games', {
            volume: 0.5,
            soundEnabled: true,
            vibrationEnabled: true,
            difficulty: {
                sudoku: 'medium',
                minesweeper: 'medium'
            }
        });
        
        // Apply settings
        window.gameSettings = gameSettings;
    }
    
    /**
     * Save game settings
     * @param {Object} settings - Game settings to save
     */
    window.saveGameSettings = function(settings) {
        window.gameSettings = {
            ...window.gameSettings,
            ...settings
        };
        
        window.saveAppData('games', window.gameSettings);
    };
    
    /**
     * Play a game sound
     * @param {string} sound - Sound name to play
     * @param {number} volume - Volume (0-1)
     */
    window.playGameSound = function(sound, volume = 1) {
        if (!window.gameSettings.soundEnabled) return;
        
        // Simple sound implementation using AudioContext
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const gainNode = audioContext.createGain();
        gainNode.gain.value = volume * window.gameSettings.volume;
        gainNode.connect(audioContext.destination);
        
        const oscillator = audioContext.createOscillator();
        
        // Simple predefined sounds
        switch (sound) {
            case 'click':
                oscillator.type = 'sine';
                oscillator.frequency.value = 600;
                oscillator.connect(gainNode);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.1);
                break;
            case 'error':
                oscillator.type = 'square';
                oscillator.frequency.value = 200;
                oscillator.connect(gainNode);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.2);
                break;
            case 'success':
                const successOsc = audioContext.createOscillator();
                successOsc.type = 'sine';
                successOsc.frequency.value = 800;
                successOsc.connect(gainNode);
                successOsc.start();
                successOsc.stop(audioContext.currentTime + 0.15);
                
                setTimeout(() => {
                    const successOsc2 = audioContext.createOscillator();
                    successOsc2.type = 'sine';
                    successOsc2.frequency.value = 1200;
                    successOsc2.connect(gainNode);
                    successOsc2.start();
                    successOsc2.stop(audioContext.currentTime + 0.15);
                }, 150);
                break;
            case 'gameover':
                const gameoverOsc = audioContext.createOscillator();
                gameoverOsc.type = 'sawtooth';
                gameoverOsc.frequency.value = 300;
                gameoverOsc.connect(gainNode);
                gameoverOsc.start();
                gameoverOsc.stop(audioContext.currentTime + 0.5);
                break;
        }
    };
    
    /**
     * Trigger device vibration if supported
     * @param {number|Array} pattern - Vibration pattern in milliseconds
     */
    window.vibrateDevice = function(pattern) {
        if (!window.gameSettings.vibrationEnabled) return;
        
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    };
});
