/**
 * Core phone functionality 
 */

document.addEventListener('DOMContentLoaded', function() {
    // Phone elements
    const statusBarTime = document.querySelector('.status-bar-time');
    const homeScreen = document.querySelector('.home-screen');
    const homeBtn = document.querySelector('.home-btn');
    const appScreens = document.querySelectorAll('.app-screen');
    const backBtns = document.querySelectorAll('.app-back-btn');
    
    // Initialize the phone
    initPhone();
    
    /**
     * Initialize phone features
     */
    function initPhone() {
        updateStatusBar();
        setInterval(updateStatusBar, 60000); // Update every minute
        setupNavigation();
    }
    
    /**
     * Update the status bar information
     */
    function updateStatusBar() {
        // Update time
        const now = new Date();
        statusBarTime.textContent = Utils.formatTime(now);
    }
    
    /**
     * Setup navigation between screens
     */
    function setupNavigation() {
        // Home button handler
        homeBtn.addEventListener('click', function() {
            closeAllApps();
        });
        
        // Back button handlers
        backBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                closeAllApps();
            });
        });
    }
    
    /**
     * Close all app screens
     */
    function closeAllApps() {
        appScreens.forEach(screen => {
            screen.classList.remove('active');
        });
    }
    
    /**
     * Open a specific app
     * @param {string} appId - ID of the app to open
     */
    window.openApp = function(appId) {
        closeAllApps();
        const appScreen = document.getElementById(`${appId}-app`);
        if (appScreen) {
            appScreen.classList.add('active');
        }
    };
    
    /**
     * Handle app icon clicks
     */
    const appIcons = document.querySelectorAll('.app-icon');
    appIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const appId = this.getAttribute('data-app');
            window.openApp(appId);
            
            // Initialize app if needed
            if (appId === 'sudoku') {
                if (typeof window.initSudoku === 'function') {
                    window.initSudoku();
                }
            } else if (appId === 'minesweeper') {
                if (typeof window.initMinesweeper === 'function') {
                    window.initMinesweeper();
                }
            }
        });
    });
    
    // Simulate battery and other status icons
    simulateStatusIcons();
    
    /**
     * Simulate changing status icons
     */
    function simulateStatusIcons() {
        // Randomize battery level on page load
        const batteryLevel = Utils.randomInt(30, 100);
        const batteryIcon = document.querySelector('.battery-icon');
        if (batteryIcon) {
            batteryIcon.title = `Battery: ${batteryLevel}%`;
            // We can't directly style pseudo-elements with JS
            // Instead, we'll add a data attribute and use CSS to style based on that
            batteryIcon.setAttribute('data-level', batteryLevel);
        }
    }
    
    // Add touch effects for better user feedback
    addTouchEffects();
    
    /**
     * Add touch effects to buttons and app icons
     */
    function addTouchEffects() {
        // Add active state for buttons
        const buttons = document.querySelectorAll('button, .app-icon, .nav-btn');
        
        buttons.forEach(button => {
            button.addEventListener('touchstart', function() {
                this.classList.add('active');
            });
            
            button.addEventListener('touchend', function() {
                this.classList.remove('active');
            });
            
            // For non-touch devices
            button.addEventListener('mousedown', function() {
                this.classList.add('active');
            });
            
            button.addEventListener('mouseup', function() {
                this.classList.remove('active');
            });
            
            button.addEventListener('mouseleave', function() {
                this.classList.remove('active');
            });
        });
    }
});
