/**
 * App management functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // App state
    const appState = {
        lastOpenedApp: null,
        appData: Utils.loadFromStorage('phoneAppData', {})
    };
    
    /**
     * Save app data to local storage
     * @param {string} appId - App identifier
     * @param {Object} data - App data to save
     */
    window.saveAppData = function(appId, data) {
        if (!appState.appData[appId]) {
            appState.appData[appId] = {};
        }
        
        // Merge the new data with existing data
        appState.appData[appId] = {...appState.appData[appId], ...data};
        
        // Save to storage
        Utils.saveToStorage('phoneAppData', appState.appData);
    };
    
    /**
     * Load app data from local storage
     * @param {string} appId - App identifier
     * @param {Object} defaultData - Default data if none exists
     * @returns {Object} App data
     */
    window.loadAppData = function(appId, defaultData = {}) {
        if (!appState.appData[appId]) {
            appState.appData[appId] = defaultData;
            Utils.saveToStorage('phoneAppData', appState.appData);
        }
        
        return appState.appData[appId];
    };
    
    /**
     * Get app element by ID
     * @param {string} appId - App identifier
     * @returns {Element} App element
     */
    window.getAppElement = function(appId) {
        return document.getElementById(`${appId}-app`);
    };
    
    /**
     * Show notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, info)
     */
    window.showNotification = function(message, type = 'info') {
        // Check if notification container exists
        let notificationContainer = document.querySelector('.notification-container');
        
        if (!notificationContainer) {
            // Create notification container
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.querySelector('.phone-screen').appendChild(notificationContainer);
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add to container
        notificationContainer.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
                
                // Remove container if empty
                if (notificationContainer.children.length === 0) {
                    notificationContainer.remove();
                }
            }, 300);
        }, 3000);
    };
    
    /**
     * Register app hooks
     * These are called at specific points during app lifecycle
     * @param {string} appId - App identifier
     * @param {Object} hooks - Hook functions
     */
    window.registerAppHooks = function(appId, hooks = {}) {
        // Store hooks on the window object
        if (!window.appHooks) {
            window.appHooks = {};
        }
        
        window.appHooks[appId] = hooks;
        
        // If onInit hook is provided, call it now
        if (hooks.onInit && typeof hooks.onInit === 'function') {
            hooks.onInit();
        }
    };
    
    // Add event listeners for app open/close to trigger hooks
    const appIcons = document.querySelectorAll('.app-icon');
    
    appIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const appId = this.getAttribute('data-app');
            
            // Call onOpen hook if exists
            if (window.appHooks && 
                window.appHooks[appId] && 
                typeof window.appHooks[appId].onOpen === 'function') {
                window.appHooks[appId].onOpen();
            }
            
            // Track last opened app
            appState.lastOpenedApp = appId;
        });
    });
    
    document.querySelectorAll('.app-back-btn, .home-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Call onClose hook if exists for the last opened app
            if (appState.lastOpenedApp && 
                window.appHooks && 
                window.appHooks[appState.lastOpenedApp] && 
                typeof window.appHooks[appState.lastOpenedApp].onClose === 'function') {
                window.appHooks[appState.lastOpenedApp].onClose();
            }
            
            appState.lastOpenedApp = null;
        });
    });
    
    // Add CSS for notifications
    addNotificationStyles();
    
    /**
     * Add CSS for notifications
     */
    function addNotificationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .notification-container {
                position: absolute;
                top: var(--status-bar-height);
                left: 0;
                width: 100%;
                z-index: 100;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 10px;
            }
            
            .notification {
                width: 90%;
                padding: 12px;
                margin-bottom: 10px;
                border-radius: 8px;
                background-color: #333;
                color: white;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                font-size: 14px;
                animation: slideIn 0.3s ease-out;
                transition: opacity 0.3s;
            }
            
            .notification-success {
                background-color: var(--secondary-color);
            }
            
            .notification-error {
                background-color: var(--danger-color);
            }
            
            .notification-info {
                background-color: var(--primary-color);
            }
            
            .notification.fade-out {
                opacity: 0;
            }
            
            @keyframes slideIn {
                from { transform: translateY(-20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        
        document.head.appendChild(style);
    }
});
