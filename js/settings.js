/**
 * Settings App Implementation
 */

// Settings state
let settingsState = {
    // Theme settings
    theme: {
        darkMode: false,
        accentColor: '#3498db',
        fontFamily: 'Roboto, sans-serif',
        fontSize: 'medium' // small, medium, large
    },
    // Display settings
    display: {
        gridSize: 4, // Number of apps per row on home screen
        iconSize: 'medium', // small, medium, large
        animations: true
    },
    // Sound settings
    sound: {
        enabled: true,
        volume: 0.7, // 0.0 to 1.0
        hapticFeedback: true
    },
    // Privacy settings
    privacy: {
        saveHistory: true,
        shareAnalytics: false,
        storeLocalData: true
    },
    // Accessibility settings
    accessibility: {
        highContrast: false,
        largeText: false,
        reduceMotion: false
    },
    // About settings
    about: {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        deviceName: 'Virtual Phone',
        deviceModel: 'VP2023',
        storage: {
            total: 64, // GB
            used: 3.2 // GB
        }
    },
    // State
    initialized: false
};

// Initialize Settings app when loaded
window.initSettings = function() {
    if (!settingsState.initialized) {
        setupSettingsUI();
        setupSettingsEvents();
        settingsState.initialized = true;
    }
    
    // Load saved settings if available
    loadSettingsState();
    
    // Apply current settings to the UI
    applySettings();
};

/**
 * Setup Settings UI
 */
function setupSettingsUI() {
    const settingsContainer = document.querySelector('.settings-container');
    
    // Clear any existing content
    if (settingsContainer.querySelector('.settings-message')) {
        settingsContainer.innerHTML = '';
    }
    
    // Create settings sections
    settingsContainer.innerHTML = `
        <div class="settings-header">
            <h2>Settings</h2>
        </div>
        
        <div class="settings-content">
            <!-- Theme Section -->
            <div class="settings-section" data-section="theme">
                <div class="settings-section-header">
                    <i class="fas fa-paint-brush"></i>
                    <h3>Theme & Appearance</h3>
                </div>
                <div class="settings-section-content">
                    <div class="settings-item">
                        <div class="settings-item-label">Dark Mode</div>
                        <div class="settings-item-control">
                            <label class="toggle-switch">
                                <input type="checkbox" id="dark-mode-toggle" ${settingsState.theme.darkMode ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="settings-item">
                        <div class="settings-item-label">Accent Color</div>
                        <div class="settings-item-control">
                            <div class="color-options">
                                <span class="color-option ${settingsState.theme.accentColor === '#3498db' ? 'selected' : ''}" data-color="#3498db" style="background-color: #3498db;"></span>
                                <span class="color-option ${settingsState.theme.accentColor === '#e74c3c' ? 'selected' : ''}" data-color="#e74c3c" style="background-color: #e74c3c;"></span>
                                <span class="color-option ${settingsState.theme.accentColor === '#2ecc71' ? 'selected' : ''}" data-color="#2ecc71" style="background-color: #2ecc71;"></span>
                                <span class="color-option ${settingsState.theme.accentColor === '#f39c12' ? 'selected' : ''}" data-color="#f39c12" style="background-color: #f39c12;"></span>
                                <span class="color-option ${settingsState.theme.accentColor === '#9b59b6' ? 'selected' : ''}" data-color="#9b59b6" style="background-color: #9b59b6;"></span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="settings-item">
                        <div class="settings-item-label">Font Size</div>
                        <div class="settings-item-control">
                            <select id="font-size-select">
                                <option value="small" ${settingsState.theme.fontSize === 'small' ? 'selected' : ''}>Small</option>
                                <option value="medium" ${settingsState.theme.fontSize === 'medium' ? 'selected' : ''}>Medium</option>
                                <option value="large" ${settingsState.theme.fontSize === 'large' ? 'selected' : ''}>Large</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="settings-item">
                        <div class="settings-item-label">Font Family</div>
                        <div class="settings-item-control">
                            <select id="font-family-select">
                                <option value="Roboto, sans-serif" ${settingsState.theme.fontFamily === 'Roboto, sans-serif' ? 'selected' : ''}>Roboto</option>
                                <option value="'Open Sans', sans-serif" ${settingsState.theme.fontFamily === "'Open Sans', sans-serif" ? 'selected' : ''}>Open Sans</option>
                                <option value="'Montserrat', sans-serif" ${settingsState.theme.fontFamily === "'Montserrat', sans-serif" ? 'selected' : ''}>Montserrat</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Display Section -->
            <div class="settings-section" data-section="display">
                <div class="settings-section-header">
                    <i class="fas fa-desktop"></i>
                    <h3>Display</h3>
                </div>
                <div class="settings-section-content">
                    <div class="settings-item">
                        <div class="settings-item-label">Home Screen Grid</div>
                        <div class="settings-item-control">
                            <select id="grid-size-select">
                                <option value="3" ${settingsState.display.gridSize === 3 ? 'selected' : ''}>3×3</option>
                                <option value="4" ${settingsState.display.gridSize === 4 ? 'selected' : ''}>4×4</option>
                                <option value="5" ${settingsState.display.gridSize === 5 ? 'selected' : ''}>5×5</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="settings-item">
                        <div class="settings-item-label">Icon Size</div>
                        <div class="settings-item-control">
                            <select id="icon-size-select">
                                <option value="small" ${settingsState.display.iconSize === 'small' ? 'selected' : ''}>Small</option>
                                <option value="medium" ${settingsState.display.iconSize === 'medium' ? 'selected' : ''}>Medium</option>
                                <option value="large" ${settingsState.display.iconSize === 'large' ? 'selected' : ''}>Large</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="settings-item">
                        <div class="settings-item-label">Animations</div>
                        <div class="settings-item-control">
                            <label class="toggle-switch">
                                <input type="checkbox" id="animations-toggle" ${settingsState.display.animations ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Sound Section -->
            <div class="settings-section" data-section="sound">
                <div class="settings-section-header">
                    <i class="fas fa-volume-up"></i>
                    <h3>Sound & Haptics</h3>
                </div>
                <div class="settings-section-content">
                    <div class="settings-item">
                        <div class="settings-item-label">Sound Enabled</div>
                        <div class="settings-item-control">
                            <label class="toggle-switch">
                                <input type="checkbox" id="sound-toggle" ${settingsState.sound.enabled ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="settings-item">
                        <div class="settings-item-label">Volume</div>
                        <div class="settings-item-control range-control">
                            <input type="range" id="volume-slider" min="0" max="1" step="0.1" value="${settingsState.sound.volume}">
                            <span class="range-value">${Math.round(settingsState.sound.volume * 100)}%</span>
                        </div>
                    </div>
                    
                    <div class="settings-item">
                        <div class="settings-item-label">Haptic Feedback</div>
                        <div class="settings-item-control">
                            <label class="toggle-switch">
                                <input type="checkbox" id="haptic-toggle" ${settingsState.sound.hapticFeedback ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Privacy Section -->
            <div class="settings-section" data-section="privacy">
                <div class="settings-section-header">
                    <i class="fas fa-shield-alt"></i>
                    <h3>Privacy & Data</h3>
                </div>
                <div class="settings-section-content">
                    <div class="settings-item">
                        <div class="settings-item-label">Save History</div>
                        <div class="settings-item-control">
                            <label class="toggle-switch">
                                <input type="checkbox" id="history-toggle" ${settingsState.privacy.saveHistory ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="settings-item">
                        <div class="settings-item-label">Share Analytics</div>
                        <div class="settings-item-control">
                            <label class="toggle-switch">
                                <input type="checkbox" id="analytics-toggle" ${settingsState.privacy.shareAnalytics ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="settings-item">
                        <div class="settings-item-label">Local Storage</div>
                        <div class="settings-item-control">
                            <label class="toggle-switch">
                                <input type="checkbox" id="storage-toggle" ${settingsState.privacy.storeLocalData ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="settings-item">
                        <div class="settings-item-label">Clear All Data</div>
                        <div class="settings-item-control">
                            <button id="clear-data-btn" class="settings-action-btn">Clear Data</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Accessibility Section -->
            <div class="settings-section" data-section="accessibility">
                <div class="settings-section-header">
                    <i class="fas fa-universal-access"></i>
                    <h3>Accessibility</h3>
                </div>
                <div class="settings-section-content">
                    <div class="settings-item">
                        <div class="settings-item-label">High Contrast</div>
                        <div class="settings-item-control">
                            <label class="toggle-switch">
                                <input type="checkbox" id="contrast-toggle" ${settingsState.accessibility.highContrast ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="settings-item">
                        <div class="settings-item-label">Large Text</div>
                        <div class="settings-item-control">
                            <label class="toggle-switch">
                                <input type="checkbox" id="large-text-toggle" ${settingsState.accessibility.largeText ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="settings-item">
                        <div class="settings-item-label">Reduce Motion</div>
                        <div class="settings-item-control">
                            <label class="toggle-switch">
                                <input type="checkbox" id="reduce-motion-toggle" ${settingsState.accessibility.reduceMotion ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- About Section -->
            <div class="settings-section" data-section="about">
                <div class="settings-section-header">
                    <i class="fas fa-info-circle"></i>
                    <h3>About</h3>
                </div>
                <div class="settings-section-content">
                    <div class="settings-item">
                        <div class="settings-item-label">Version</div>
                        <div class="settings-item-value">${settingsState.about.version}</div>
                    </div>
                    
                    <div class="settings-item">
                        <div class="settings-item-label">Last Updated</div>
                        <div class="settings-item-value">${new Date(settingsState.about.lastUpdated).toLocaleDateString()}</div>
                    </div>
                    
                    <div class="settings-item">
                        <div class="settings-item-label">Device Name</div>
                        <div class="settings-item-control">
                            <input type="text" id="device-name-input" value="${settingsState.about.deviceName}">
                        </div>
                    </div>
                    
                    <div class="settings-item">
                        <div class="settings-item-label">Model</div>
                        <div class="settings-item-value">${settingsState.about.deviceModel}</div>
                    </div>
                    
                    <div class="settings-item">
                        <div class="settings-item-label">Storage</div>
                        <div class="settings-item-value">
                            <div class="storage-bar">
                                <div class="storage-used" style="width: ${(settingsState.about.storage.used / settingsState.about.storage.total) * 100}%"></div>
                            </div>
                            <div class="storage-text">
                                ${settingsState.about.storage.used} GB used of ${settingsState.about.storage.total} GB
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Setup Settings events
 */
function setupSettingsEvents() {
    const settingsContainer = document.querySelector('.settings-container');
    
    // Theme settings events
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function() {
            settingsState.theme.darkMode = this.checked;
            saveAndApplySettings();
        });
    }
    
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Update settings
            settingsState.theme.accentColor = this.getAttribute('data-color');
            saveAndApplySettings();
        });
    });
    
    const fontSizeSelect = document.getElementById('font-size-select');
    if (fontSizeSelect) {
        fontSizeSelect.addEventListener('change', function() {
            settingsState.theme.fontSize = this.value;
            saveAndApplySettings();
        });
    }
    
    const fontFamilySelect = document.getElementById('font-family-select');
    if (fontFamilySelect) {
        fontFamilySelect.addEventListener('change', function() {
            settingsState.theme.fontFamily = this.value;
            saveAndApplySettings();
        });
    }
    
    // Display settings events
    const gridSizeSelect = document.getElementById('grid-size-select');
    if (gridSizeSelect) {
        gridSizeSelect.addEventListener('change', function() {
            settingsState.display.gridSize = parseInt(this.value);
            saveAndApplySettings();
        });
    }
    
    const iconSizeSelect = document.getElementById('icon-size-select');
    if (iconSizeSelect) {
        iconSizeSelect.addEventListener('change', function() {
            settingsState.display.iconSize = this.value;
            saveAndApplySettings();
        });
    }
    
    const animationsToggle = document.getElementById('animations-toggle');
    if (animationsToggle) {
        animationsToggle.addEventListener('change', function() {
            settingsState.display.animations = this.checked;
            saveAndApplySettings();
        });
    }
    
    // Sound settings events
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
        soundToggle.addEventListener('change', function() {
            settingsState.sound.enabled = this.checked;
            saveAndApplySettings();
        });
    }
    
    const volumeSlider = document.getElementById('volume-slider');
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
            settingsState.sound.volume = parseFloat(this.value);
            document.querySelector('.range-value').textContent = Math.round(settingsState.sound.volume * 100) + '%';
            saveAndApplySettings();
        });
    }
    
    const hapticToggle = document.getElementById('haptic-toggle');
    if (hapticToggle) {
        hapticToggle.addEventListener('change', function() {
            settingsState.sound.hapticFeedback = this.checked;
            saveAndApplySettings();
        });
    }
    
    // Privacy settings events
    const historyToggle = document.getElementById('history-toggle');
    if (historyToggle) {
        historyToggle.addEventListener('change', function() {
            settingsState.privacy.saveHistory = this.checked;
            saveAndApplySettings();
        });
    }
    
    const analyticsToggle = document.getElementById('analytics-toggle');
    if (analyticsToggle) {
        analyticsToggle.addEventListener('change', function() {
            settingsState.privacy.shareAnalytics = this.checked;
            saveAndApplySettings();
        });
    }
    
    const storageToggle = document.getElementById('storage-toggle');
    if (storageToggle) {
        storageToggle.addEventListener('change', function() {
            settingsState.privacy.storeLocalData = this.checked;
            saveAndApplySettings();
        });
    }
    
    const clearDataBtn = document.getElementById('clear-data-btn');
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all app data? This action cannot be undone.')) {
                clearAllData();
            }
        });
    }
    
    // Accessibility settings events
    const contrastToggle = document.getElementById('contrast-toggle');
    if (contrastToggle) {
        contrastToggle.addEventListener('change', function() {
            settingsState.accessibility.highContrast = this.checked;
            saveAndApplySettings();
        });
    }
    
    const largeTextToggle = document.getElementById('large-text-toggle');
    if (largeTextToggle) {
        largeTextToggle.addEventListener('change', function() {
            settingsState.accessibility.largeText = this.checked;
            saveAndApplySettings();
        });
    }
    
    const reduceMotionToggle = document.getElementById('reduce-motion-toggle');
    if (reduceMotionToggle) {
        reduceMotionToggle.addEventListener('change', function() {
            settingsState.accessibility.reduceMotion = this.checked;
            saveAndApplySettings();
        });
    }
    
    // About settings events
    const deviceNameInput = document.getElementById('device-name-input');
    if (deviceNameInput) {
        deviceNameInput.addEventListener('change', function() {
            settingsState.about.deviceName = this.value;
            saveAndApplySettings();
        });
    }
}

/**
 * Save settings and apply changes
 */
function saveAndApplySettings() {
    saveSettingsState();
    applySettings();
}

/**
 * Apply settings to the UI
 */
function applySettings() {
    // Apply dark mode
    document.body.classList.toggle('dark-mode', settingsState.theme.darkMode);
    
    // Apply accent color
    document.documentElement.style.setProperty('--primary-color', settingsState.theme.accentColor);
    
    // Apply font family
    document.documentElement.style.setProperty('--font-family', settingsState.theme.fontFamily);
    
    // Apply font size
    let fontSize;
    switch (settingsState.theme.fontSize) {
        case 'small':
            fontSize = '14px';
            break;
        case 'medium':
            fontSize = '16px';
            break;
        case 'large':
            fontSize = '18px';
            break;
        default:
            fontSize = '16px';
    }
    document.documentElement.style.setProperty('--base-font-size', fontSize);
    
    // Apply high contrast
    document.body.classList.toggle('high-contrast', settingsState.accessibility.highContrast);
    
    // Apply large text
    document.body.classList.toggle('large-text', settingsState.accessibility.largeText);
    
    // Apply reduce motion
    document.body.classList.toggle('reduce-motion', settingsState.accessibility.reduceMotion);
    
    // Apply app grid size to home screen
    const appGrid = document.querySelector('.app-grid');
    if (appGrid) {
        appGrid.style.gridTemplateColumns = `repeat(${settingsState.display.gridSize}, 1fr)`;
    }
    
    // Apply icon size
    let iconSize;
    switch (settingsState.display.iconSize) {
        case 'small':
            iconSize = '40px';
            break;
        case 'medium':
            iconSize = '50px';
            break;
        case 'large':
            iconSize = '60px';
            break;
        default:
            iconSize = '50px';
    }
    document.documentElement.style.setProperty('--icon-size', iconSize);
    
    // Apply animations
    document.body.classList.toggle('no-animations', !settingsState.display.animations);
    
    // Apply game volume settings
    if (window.gameSettings) {
        window.gameSettings.volume = settingsState.sound.volume;
        window.gameSettings.soundEnabled = settingsState.sound.enabled;
        window.gameSettings.vibrationEnabled = settingsState.sound.hapticFeedback;
        
        if (window.saveGameSettings) {
            window.saveGameSettings(window.gameSettings);
        }
    }
    
    // Notify user of changes
    window.showNotification('Settings updated', 'success');
}

/**
 * Clear all app data
 */
function clearAllData() {
    // Clear local storage
    localStorage.clear();
    
    // Reset settings to defaults
    settingsState = {
        theme: {
            darkMode: false,
            accentColor: '#3498db',
            fontFamily: 'Roboto, sans-serif',
            fontSize: 'medium'
        },
        display: {
            gridSize: 4,
            iconSize: 'medium',
            animations: true
        },
        sound: {
            enabled: true,
            volume: 0.7,
            hapticFeedback: true
        },
        privacy: {
            saveHistory: true,
            shareAnalytics: false,
            storeLocalData: true
        },
        accessibility: {
            highContrast: false,
            largeText: false,
            reduceMotion: false
        },
        about: {
            version: '1.0.0',
            lastUpdated: new Date().toISOString(),
            deviceName: 'Virtual Phone',
            deviceModel: 'VP2023',
            storage: {
                total: 64,
                used: 0.5
            }
        },
        initialized: true
    };
    
    // Save and apply settings
    saveAndApplySettings();
    
    // Refresh the UI
    setupSettingsUI();
    setupSettingsEvents();
    
    // Notify user
    window.showNotification('All data cleared', 'info');
    
    // Reload page after a short delay
    setTimeout(() => {
        window.location.reload();
    }, 1500);
}

/**
 * Add CSS variables for settings
 */
function addSettingsStyles() {
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --font-family: ${settingsState.theme.fontFamily};
            --base-font-size: ${settingsState.theme.fontSize === 'small' ? '14px' : settingsState.theme.fontSize === 'large' ? '18px' : '16px'};
            --icon-size: ${settingsState.display.iconSize === 'small' ? '40px' : settingsState.display.iconSize === 'large' ? '60px' : '50px'};
        }
        
        body {
            font-family: var(--font-family);
            font-size: var(--base-font-size);
        }
        
        body.dark-mode {
            --phone-screen-color: #121212;
            --text-color: #ffffff;
            --border-color: #2c2c2c;
        }
        
        body.high-contrast {
            --text-color: #ffffff;
            --phone-screen-color: #000000;
            --border-color: #ffffff;
            --primary-color: #ffff00;
        }
        
        body.large-text {
            --base-font-size: calc(var(--base-font-size) * 1.2);
        }
        
        body.no-animations * {
            transition: none !important;
            animation: none !important;
        }
        
        body.reduce-motion * {
            transition-duration: 0.05s !important;
            animation-duration: 0.05s !important;
        }
        
        .app-icon-img {
            width: var(--icon-size);
            height: var(--icon-size);
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * Save settings state
 */
function saveSettingsState() {
    if (window.saveAppData) {
        window.saveAppData('settings', settingsState);
    }
}

/**
 * Load settings state
 */
function loadSettingsState() {
    if (window.loadAppData) {
        const savedSettings = window.loadAppData('settings', null);
        
        if (savedSettings) {
            // Merge saved settings with default settings
            settingsState.theme = {...settingsState.theme, ...savedSettings.theme};
            settingsState.display = {...settingsState.display, ...savedSettings.display};
            settingsState.sound = {...settingsState.sound, ...savedSettings.sound};
            settingsState.privacy = {...settingsState.privacy, ...savedSettings.privacy};
            settingsState.accessibility = {...settingsState.accessibility, ...savedSettings.accessibility};
            
            // Only update device name from saved settings
            if (savedSettings.about && savedSettings.about.deviceName) {
                settingsState.about.deviceName = savedSettings.about.deviceName;
            }
            
            // Update storage used
            const totalSize = JSON.stringify(localStorage).length / 1024;
            settingsState.about.storage.used = Math.max(0.5, (totalSize / 1024).toFixed(1));
        }
    }
    
    // Add settings styles
    addSettingsStyles();
}

// Register Settings app hooks when the registerAppHooks function is available
document.addEventListener('DOMContentLoaded', function() {
    // Check if the registerAppHooks function is available
    if (window.registerAppHooks) {
        registerSettingsHooks();
    } else {
        // Wait for the apps.js to load and define registerAppHooks
        const checkInterval = setInterval(function() {
            if (window.registerAppHooks) {
                clearInterval(checkInterval);
                registerSettingsHooks();
            }
        }, 100);
    }
    
    function registerSettingsHooks() {
        window.registerAppHooks('settings', {
            onInit: function() {
                // This is called when the app is first loaded
                loadSettingsState();
            },
            
            onOpen: function() {
                // This is called when the app is opened
                window.initSettings();
            },
            
            onClose: function() {
                // This is called when the app is closed
                saveSettingsState();
            }
        });
    }
});
