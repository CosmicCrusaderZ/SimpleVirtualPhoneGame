/**
 * Notes App Implementation
 */

// Notes state
let notesState = {
    notes: [],
    categories: ['Personal', 'Work', 'Ideas', 'Todos'],
    currentNote: null,
    currentCategory: 'All',
    currentView: 'list', // 'list' or 'edit'
    searchQuery: '',
    darkMode: false,
    initialized: false,
    autoSaveInterval: null
};

// Initialize Notes when loaded
window.initNotes = function() {
    if (!notesState.initialized) {
        setupNotesUI();
        setupNotesEvents();
        notesState.initialized = true;
    }
    
    // Load saved notes if available
    loadNotesState();
    
    // Set up auto-save
    setupAutoSave();
    
    // Show notes list
    showNotesList();
};

/**
 * Set up auto-save functionality
 */
function setupAutoSave() {
    // Clear any existing interval
    if (notesState.autoSaveInterval) {
        clearInterval(notesState.autoSaveInterval);
    }
    
    // Set up new interval (save every 30 seconds)
    notesState.autoSaveInterval = setInterval(function() {
        if (notesState.currentNote && notesState.currentView === 'edit') {
            const noteContent = document.querySelector('.note-editor-content');
            const noteTitle = document.querySelector('.note-editor-title');
            
            if (noteContent && noteTitle) {
                // Update current note
                notesState.currentNote.content = noteContent.innerHTML;
                notesState.currentNote.title = noteTitle.value;
                notesState.currentNote.lastModified = new Date();
                
                // Save to storage
                saveNotesState();
                
                // Show auto-save confirmation
                showAutoSaveConfirmation();
            }
        }
    }, 30000); // 30 seconds
}

/**
 * Show auto-save confirmation
 */
function showAutoSaveConfirmation() {
    const confirmationElement = document.createElement('div');
    confirmationElement.className = 'auto-save-confirmation';
    confirmationElement.textContent = 'Auto-saved';
    
    // Add to editor
    const noteEditor = document.querySelector('.note-editor');
    if (noteEditor) {
        noteEditor.appendChild(confirmationElement);
        
        // Remove after 2 seconds
        setTimeout(() => {
            confirmationElement.remove();
        }, 2000);
    }
}

/**
 * Setup Notes UI
 */
function setupNotesUI() {
    const notesContainer = document.querySelector('.notes-container');
    
    // Clear any existing content
    if (notesContainer.querySelector('.notes-message')) {
        notesContainer.innerHTML = '';
    }
    
    // Create main notes views
    const notesViewsElement = document.createElement('div');
    notesViewsElement.className = 'notes-views';
    
    // Notes list view
    const notesListView = document.createElement('div');
    notesListView.className = 'notes-list-view';
    notesListView.innerHTML = `
        <div class="notes-header">
            <div class="notes-search">
                <input type="text" placeholder="Search notes..." class="notes-search-input">
                <button class="notes-search-clear-btn">×</button>
            </div>
            <div class="notes-actions">
                <button class="add-note-btn">+</button>
                <button class="toggle-dark-mode-btn">${notesState.darkMode ? '☀️' : '🌙'}</button>
            </div>
        </div>
        
        <div class="notes-categories">
            <span class="category-label" data-category="All">All</span>
            ${notesState.categories.map(category => 
                `<span class="category-label" data-category="${category}">${category}</span>`
            ).join('')}
            <span class="category-label add-category">+ Add</span>
        </div>
        
        <div class="notes-list"></div>
    `;
    notesViewsElement.appendChild(notesListView);
    
    // Note editor view
    const noteEditorView = document.createElement('div');
    noteEditorView.className = 'note-editor-view';
    noteEditorView.style.display = 'none';
    noteEditorView.innerHTML = `
        <div class="note-editor-header">
            <button class="back-to-list-btn">←</button>
            <input type="text" class="note-editor-title" placeholder="Note title">
            <div class="note-editor-actions">
                <button class="save-note-btn">Save</button>
                <button class="delete-note-btn">Delete</button>
            </div>
        </div>
        
        <div class="note-editor-category-select">
            <select class="note-category-selector">
                ${notesState.categories.map(category => 
                    `<option value="${category}">${category}</option>`
                ).join('')}
            </select>
            <span>Last modified: <span class="note-last-modified">Just now</span></span>
        </div>
        
        <div class="note-editor-toolbar">
            <button data-format="bold" title="Bold"><i class="fas fa-bold"></i></button>
            <button data-format="italic" title="Italic"><i class="fas fa-italic"></i></button>
            <button data-format="underline" title="Underline"><i class="fas fa-underline"></i></button>
            <button data-format="strikethrough" title="Strikethrough"><i class="fas fa-strikethrough"></i></button>
            <button data-format="insertUnorderedList" title="Bullet List"><i class="fas fa-list-ul"></i></button>
            <button data-format="insertOrderedList" title="Numbered List"><i class="fas fa-list-ol"></i></button>
            <div class="note-color-picker">
                <button data-format="foreColor" data-color="black" title="Text Color" style="color: black"><i class="fas fa-font"></i></button>
                <div class="color-palette">
                    <span data-color="black" style="background-color: black"></span>
                    <span data-color="red" style="background-color: red"></span>
                    <span data-color="green" style="background-color: green"></span>
                    <span data-color="blue" style="background-color: blue"></span>
                    <span data-color="purple" style="background-color: purple"></span>
                    <span data-color="orange" style="background-color: orange"></span>
                </div>
            </div>
        </div>
        
        <div class="note-editor-content" contenteditable="true"></div>
    `;
    notesViewsElement.appendChild(noteEditorView);
    
    notesContainer.appendChild(notesViewsElement);
    
    // Apply dark mode if enabled
    if (notesState.darkMode) {
        document.querySelector('.notes-container').classList.add('dark-mode');
    }
}

/**
 * Setup Notes event handlers
 */
function setupNotesEvents() {
    const notesContainer = document.querySelector('.notes-container');
    
    // Add new note button
    const addNoteBtn = notesContainer.querySelector('.add-note-btn');
    if (addNoteBtn) {
        addNoteBtn.addEventListener('click', createNewNote);
    }
    
    // Search input
    const searchInput = notesContainer.querySelector('.notes-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            notesState.searchQuery = this.value.trim().toLowerCase();
            showNotesList();
        });
        
        // Clear search button
        const clearSearchBtn = notesContainer.querySelector('.notes-search-clear-btn');
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', function() {
                searchInput.value = '';
                notesState.searchQuery = '';
                showNotesList();
            });
        }
    }
    
    // Toggle dark mode
    const darkModeBtn = notesContainer.querySelector('.toggle-dark-mode-btn');
    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', function() {
            notesState.darkMode = !notesState.darkMode;
            notesContainer.classList.toggle('dark-mode', notesState.darkMode);
            this.textContent = notesState.darkMode ? '☀️' : '🌙';
            saveNotesState();
        });
    }
    
    // Category selection
    const categoryLabels = notesContainer.querySelectorAll('.category-label');
    categoryLabels.forEach(label => {
        if (label.classList.contains('add-category')) {
            label.addEventListener('click', addNewCategory);
        } else {
            label.addEventListener('click', function() {
                notesState.currentCategory = this.getAttribute('data-category');
                updateCategorySelection();
                showNotesList();
            });
        }
    });
    
    // Back button from editor to list
    const backToListBtn = notesContainer.querySelector('.back-to-list-btn');
    if (backToListBtn) {
        backToListBtn.addEventListener('click', function() {
            // Save current note before going back
            saveCurrentNote();
            showNotesList();
        });
    }
    
    // Save note button
    const saveNoteBtn = notesContainer.querySelector('.save-note-btn');
    if (saveNoteBtn) {
        saveNoteBtn.addEventListener('click', function() {
            saveCurrentNote();
            window.showNotification('Note saved', 'success');
        });
    }
    
    // Delete note button
    const deleteNoteBtn = notesContainer.querySelector('.delete-note-btn');
    if (deleteNoteBtn) {
        deleteNoteBtn.addEventListener('click', function() {
            // Confirm before deleting
            if (confirm('Are you sure you want to delete this note?')) {
                deleteCurrentNote();
                showNotesList();
                window.showNotification('Note deleted', 'info');
            }
        });
    }
    
    // Category selector in note editor
    const categorySelector = notesContainer.querySelector('.note-category-selector');
    if (categorySelector) {
        categorySelector.addEventListener('change', function() {
            if (notesState.currentNote) {
                notesState.currentNote.category = this.value;
                notesState.currentNote.lastModified = new Date();
                saveNotesState();
            }
        });
    }
    
    // Format buttons
    const formatButtons = notesContainer.querySelectorAll('.note-editor-toolbar button[data-format]');
    formatButtons.forEach(button => {
        button.addEventListener('click', function() {
            const format = this.getAttribute('data-format');
            const color = this.getAttribute('data-color');
            
            if (format === 'foreColor' && color) {
                document.execCommand(format, false, color);
            } else {
                document.execCommand(format, false);
            }
            
            // Focus back to editor
            document.querySelector('.note-editor-content').focus();
        });
    });
    
    // Color palette
    const colorButtons = notesContainer.querySelectorAll('.color-palette span');
    colorButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const color = this.getAttribute('data-color');
            document.execCommand('foreColor', false, color);
            
            // Change the color of the text color button
            const colorBtn = notesContainer.querySelector('button[data-format="foreColor"]');
            colorBtn.style.color = color;
            
            // Focus back to editor
            document.querySelector('.note-editor-content').focus();
            
            // Hide the palette
            document.querySelector('.color-palette').style.display = 'none';
        });
    });
    
    // Toggle color palette
    const colorPickerBtn = notesContainer.querySelector('button[data-format="foreColor"]');
    if (colorPickerBtn) {
        colorPickerBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const palette = document.querySelector('.color-palette');
            palette.style.display = palette.style.display === 'flex' ? 'none' : 'flex';
        });
    }
    
    // Click outside color palette to close it
    document.addEventListener('click', function() {
        const palette = document.querySelector('.color-palette');
        if (palette) {
            palette.style.display = 'none';
        }
    });
}

/**
 * Show notes list
 */
function showNotesList() {
    // Update UI state
    notesState.currentView = 'list';
    notesState.currentNote = null;
    
    // Show list view, hide editor view
    const listView = document.querySelector('.notes-list-view');
    const editorView = document.querySelector('.note-editor-view');
    
    if (listView && editorView) {
        listView.style.display = 'flex';
        editorView.style.display = 'none';
    }
    
    // Update category selection
    updateCategorySelection();
    
    // Populate notes list
    populateNotesList();
}

/**
 * Update category selection UI
 */
function updateCategorySelection() {
    const categoryLabels = document.querySelectorAll('.category-label');
    categoryLabels.forEach(label => {
        if (!label.classList.contains('add-category')) {
            const isSelected = label.getAttribute('data-category') === notesState.currentCategory;
            label.classList.toggle('selected', isSelected);
        }
    });
}

/**
 * Populate notes list
 */
function populateNotesList() {
    const notesListElement = document.querySelector('.notes-list');
    if (!notesListElement) return;
    
    // Clear list
    notesListElement.innerHTML = '';
    
    // Filter notes by category and search query
    const filteredNotes = notesState.notes.filter(note => {
        const matchesCategory = 
            notesState.currentCategory === 'All' || 
            note.category === notesState.currentCategory;
        
        const matchesSearch = 
            notesState.searchQuery === '' || 
            note.title.toLowerCase().includes(notesState.searchQuery) || 
            stripHtml(note.content).toLowerCase().includes(notesState.searchQuery);
        
        return matchesCategory && matchesSearch;
    });
    
    // Sort notes by last modified (newest first)
    filteredNotes.sort((a, b) => {
        return new Date(b.lastModified) - new Date(a.lastModified);
    });
    
    // Show message if no notes
    if (filteredNotes.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-notes-message';
        
        if (notesState.searchQuery) {
            emptyMessage.textContent = 'No notes match your search.';
        } else if (notesState.currentCategory !== 'All') {
            emptyMessage.textContent = `No notes in the "${notesState.currentCategory}" category.`;
        } else {
            emptyMessage.textContent = 'No notes yet. Click + to create one.';
        }
        
        notesListElement.appendChild(emptyMessage);
        return;
    }
    
    // Add notes to list
    filteredNotes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = `note-item ${getColorClass(note)}`;
        noteElement.dataset.id = note.id;
        
        // Format date
        const formattedDate = formatDate(new Date(note.lastModified));
        
        noteElement.innerHTML = `
            <div class="note-item-title">${note.title || 'Untitled'}</div>
            <div class="note-item-preview">${stripHtml(note.content).substring(0, 50)}${stripHtml(note.content).length > 50 ? '...' : ''}</div>
            <div class="note-item-footer">
                <span class="note-item-category">${note.category}</span>
                <span class="note-item-date">${formattedDate}</span>
            </div>
        `;
        
        // Add click event to open note
        noteElement.addEventListener('click', function() {
            openNote(note.id);
        });
        
        notesListElement.appendChild(noteElement);
    });
}

/**
 * Get color class for note
 * @param {Object} note - Note object
 * @returns {string} Color class
 */
function getColorClass(note) {
    // Map categories to colors for visual differentiation
    const colorMap = {
        'Personal': 'color-1',
        'Work': 'color-2',
        'Ideas': 'color-3',
        'Todos': 'color-4'
    };
    
    return colorMap[note.category] || 'color-default';
}

/**
 * Strip HTML tags from content
 * @param {string} html - HTML content
 * @returns {string} Plain text
 */
function stripHtml(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
}

/**
 * Format date
 * @param {Date} date - Date to format
 * @returns {string} Formatted date
 */
function formatDate(date) {
    const now = new Date();
    const diff = now - date;
    
    // Less than a day
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        if (hours < 1) {
            const minutes = Math.floor(diff / 60000);
            return minutes < 1 ? 'Just now' : `${minutes}m ago`;
        }
        return `${hours}h ago`;
    }
    
    // Less than a week
    if (diff < 604800000) {
        const days = Math.floor(diff / 86400000);
        return `${days}d ago`;
    }
    
    // Format as date
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

/**
 * Create new note
 */
function createNewNote() {
    // Create new note object
    const newNote = {
        id: Date.now().toString(),
        title: '',
        content: '',
        category: notesState.categories[0], // Default to first category
        created: new Date(),
        lastModified: new Date(),
        color: 'default'
    };
    
    // Add to notes array
    notesState.notes.push(newNote);
    
    // Save to storage
    saveNotesState();
    
    // Open note editor
    openNote(newNote.id);
}

/**
 * Open note for editing
 * @param {string} noteId - Note ID
 */
function openNote(noteId) {
    // Find note
    const note = notesState.notes.find(note => note.id === noteId);
    if (!note) return;
    
    // Update state
    notesState.currentNote = note;
    notesState.currentView = 'edit';
    
    // Show editor view, hide list view
    const listView = document.querySelector('.notes-list-view');
    const editorView = document.querySelector('.note-editor-view');
    
    if (listView && editorView) {
        listView.style.display = 'none';
        editorView.style.display = 'flex';
    }
    
    // Populate editor
    const titleInput = document.querySelector('.note-editor-title');
    const contentEditor = document.querySelector('.note-editor-content');
    const categorySelector = document.querySelector('.note-category-selector');
    const lastModified = document.querySelector('.note-last-modified');
    
    if (titleInput && contentEditor && categorySelector && lastModified) {
        titleInput.value = note.title;
        contentEditor.innerHTML = note.content;
        
        // Set category
        const categoryOption = Array.from(categorySelector.options).find(option => option.value === note.category);
        if (categoryOption) {
            categorySelector.value = note.category;
        }
        
        // Update last modified
        lastModified.textContent = formatDate(new Date(note.lastModified));
    }
    
    // Focus editor
    setTimeout(() => {
        contentEditor.focus();
    }, 0);
}

/**
 * Save current note
 */
function saveCurrentNote() {
    if (!notesState.currentNote) return;
    
    // Get values from editor
    const titleInput = document.querySelector('.note-editor-title');
    const contentEditor = document.querySelector('.note-editor-content');
    const categorySelector = document.querySelector('.note-category-selector');
    
    if (titleInput && contentEditor && categorySelector) {
        // Update note object
        notesState.currentNote.title = titleInput.value;
        notesState.currentNote.content = contentEditor.innerHTML;
        notesState.currentNote.category = categorySelector.value;
        notesState.currentNote.lastModified = new Date();
        
        // Save to storage
        saveNotesState();
    }
}

/**
 * Delete current note
 */
function deleteCurrentNote() {
    if (!notesState.currentNote) return;
    
    // Remove from notes array
    const index = notesState.notes.findIndex(note => note.id === notesState.currentNote.id);
    if (index !== -1) {
        notesState.notes.splice(index, 1);
    }
    
    // Clear current note
    notesState.currentNote = null;
    
    // Save to storage
    saveNotesState();
}

/**
 * Add new category
 */
function addNewCategory() {
    const categoryName = prompt('Enter new category name:');
    
    if (categoryName && categoryName.trim()) {
        // Check if category already exists
        if (notesState.categories.includes(categoryName.trim())) {
            alert('This category already exists.');
            return;
        }
        
        // Add to categories array
        notesState.categories.push(categoryName.trim());
        
        // Save to storage
        saveNotesState();
        
        // Update UI
        setupNotesUI();
        setupNotesEvents();
        
        // Switch to new category
        notesState.currentCategory = categoryName.trim();
        updateCategorySelection();
        showNotesList();
    }
}

/**
 * Export notes to file
 */
function exportNotes() {
    // Create export data
    const exportData = {
        notes: notesState.notes,
        categories: notesState.categories,
        exportDate: new Date()
    };
    
    // Convert to JSON
    const jsonData = JSON.stringify(exportData, null, 2);
    
    // Create blob
    const blob = new Blob([jsonData], {type: 'application/json'});
    
    // Create download link
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `notes_export_${new Date().toISOString().slice(0, 10)}.json`;
    
    // Append to document and click
    document.body.appendChild(downloadLink);
    downloadLink.click();
    
    // Clean up
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(downloadLink.href);
    
    window.showNotification('Notes exported', 'success');
}

/**
 * Import notes from file
 */
function importNotes() {
    // Create file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/json';
    
    // Add change event
    fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const importData = JSON.parse(e.target.result);
                    
                    // Validate data
                    if (!importData.notes || !Array.isArray(importData.notes)) {
                        throw new Error('Invalid import file format');
                    }
                    
                    // Ask for import type
                    const importType = confirm('Do you want to merge with existing notes? Click OK to merge, Cancel to replace all notes.');
                    
                    if (importType) {
                        // Merge notes
                        importData.notes.forEach(importedNote => {
                            // Check if note already exists
                            const existingNote = notesState.notes.find(note => note.id === importedNote.id);
                            if (existingNote) {
                                // Keep newer version
                                if (new Date(importedNote.lastModified) > new Date(existingNote.lastModified)) {
                                    Object.assign(existingNote, importedNote);
                                }
                            } else {
                                notesState.notes.push(importedNote);
                            }
                        });
                        
                        // Merge categories
                        if (importData.categories && Array.isArray(importData.categories)) {
                            importData.categories.forEach(category => {
                                if (!notesState.categories.includes(category)) {
                                    notesState.categories.push(category);
                                }
                            });
                        }
                    } else {
                        // Replace notes
                        notesState.notes = importData.notes;
                        
                        // Replace categories if they exist
                        if (importData.categories && Array.isArray(importData.categories)) {
                            notesState.categories = importData.categories;
                        }
                    }
                    
                    // Save to storage
                    saveNotesState();
                    
                    // Update UI
                    setupNotesUI();
                    setupNotesEvents();
                    showNotesList();
                    
                    window.showNotification('Notes imported', 'success');
                } catch (error) {
                    console.error('Import error:', error);
                    alert('Failed to import notes. Invalid file format.');
                }
            };
            
            reader.readAsText(this.files[0]);
        }
    });
    
    // Trigger file dialog
    fileInput.click();
}

/**
 * Save notes state
 */
function saveNotesState() {
    if (window.saveAppData) {
        window.saveAppData('notes', {
            notes: notesState.notes,
            categories: notesState.categories,
            darkMode: notesState.darkMode
        });
    }
}

/**
 * Load notes state
 */
function loadNotesState() {
    if (window.loadAppData) {
        const savedState = window.loadAppData('notes', {
            notes: [],
            categories: ['Personal', 'Work', 'Ideas', 'Todos'],
            darkMode: false
        });
        
        notesState.notes = savedState.notes;
        notesState.categories = savedState.categories;
        notesState.darkMode = savedState.darkMode;
    }
}

// Register Notes app hooks when the registerAppHooks function is available
document.addEventListener('DOMContentLoaded', function() {
    // Add export/import buttons to the app
    const addExportImportButtons = function() {
        const actionsDiv = document.querySelector('.notes-actions');
        if (actionsDiv && !actionsDiv.querySelector('.export-notes-btn')) {
            // Export button
            const exportBtn = document.createElement('button');
            exportBtn.className = 'export-notes-btn';
            exportBtn.innerHTML = '<i class="fas fa-download"></i>';
            exportBtn.title = 'Export Notes';
            exportBtn.addEventListener('click', exportNotes);
            
            // Import button
            const importBtn = document.createElement('button');
            importBtn.className = 'import-notes-btn';
            importBtn.innerHTML = '<i class="fas fa-upload"></i>';
            importBtn.title = 'Import Notes';
            importBtn.addEventListener('click', importNotes);
            
            // Add buttons
            actionsDiv.insertBefore(importBtn, actionsDiv.firstChild);
            actionsDiv.insertBefore(exportBtn, actionsDiv.firstChild);
        }
    };
    
    // Check if the registerAppHooks function is available
    if (window.registerAppHooks) {
        registerNotesHooks();
    } else {
        // Wait for the apps.js to load and define registerAppHooks
        const checkInterval = setInterval(function() {
            if (window.registerAppHooks) {
                clearInterval(checkInterval);
                registerNotesHooks();
            }
        }, 100);
    }
    
    function registerNotesHooks() {
        window.registerAppHooks('notes', {
            onInit: function() {
                // This is called when the app is first loaded
                loadNotesState();
            },
            
            onOpen: function() {
                // This is called when the app is opened
                window.initNotes();
                
                // Add export/import buttons after UI is initialized
                setTimeout(addExportImportButtons, 100);
            },
            
            onClose: function() {
                // This is called when the app is closed
                
                // Save current note if in edit mode
                if (notesState.currentView === 'edit' && notesState.currentNote) {
                    saveCurrentNote();
                }
                
                // Clear auto-save interval
                if (notesState.autoSaveInterval) {
                    clearInterval(notesState.autoSaveInterval);
                    notesState.autoSaveInterval = null;
                }
            }
        });
    }
});
