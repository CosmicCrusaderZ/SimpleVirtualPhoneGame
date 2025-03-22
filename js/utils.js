/**
 * Utility functions for the Phone Simulator
 */

// Time-related utilities
const Utils = {
    /**
     * Format a date object to display time in HH:MM format
     * @param {Date} date - Date object
     * @returns {string} Formatted time string
     */
    formatTime: function(date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    },
    
    /**
     * Format seconds to MM:SS format
     * @param {number} seconds - Number of seconds
     * @returns {string} Formatted time string
     */
    formatSeconds: function(seconds) {
        const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${minutes}:${secs}`;
    },
    
    /**
     * Generate a random integer between min and max (inclusive)
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random integer
     */
    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    /**
     * Shuffle array elements (Fisher-Yates algorithm)
     * @param {Array} array - Array to shuffle
     * @returns {Array} Shuffled array
     */
    shuffleArray: function(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    },
    
    /**
     * Save data to local storage
     * @param {string} key - Storage key
     * @param {any} data - Data to store
     */
    saveToStorage: function(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving to local storage:', e);
        }
    },
    
    /**
     * Load data from local storage
     * @param {string} key - Storage key
     * @param {any} defaultValue - Default value if key doesn't exist
     * @returns {any} Stored data or default value
     */
    loadFromStorage: function(key, defaultValue) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error('Error loading from local storage:', e);
            return defaultValue;
        }
    },
    
    /**
     * Create and append an element with specified attributes and content
     * @param {string} tag - Element tag name
     * @param {Object} attributes - Element attributes
     * @param {string|Node} content - Text content or child node
     * @param {Element} parent - Parent element to append to
     * @returns {Element} Created element
     */
    createElement: function(tag, attributes = {}, content = '', parent = null) {
        const element = document.createElement(tag);
        
        // Set attributes
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'class' || key === 'className') {
                element.className = value;
            } else {
                element.setAttribute(key, value);
            }
        });
        
        // Set content
        if (content) {
            if (typeof content === 'string') {
                element.textContent = content;
            } else {
                element.appendChild(content);
            }
        }
        
        // Append to parent
        if (parent) {
            parent.appendChild(element);
        }
        
        return element;
    },
    
    /**
     * Debounce function to limit execution rate
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce: function(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
};
