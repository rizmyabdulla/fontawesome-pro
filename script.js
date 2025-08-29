document.addEventListener('DOMContentLoaded', () => {
    const iconGrid = document.getElementById('icon-grid');
    const searchBar = document.getElementById('search-bar');
    const versionSelect = document.getElementById('version-select');
    const styleSelect = document.getElementById('style-select');
    const favoritesFilter = document.getElementById('favorites-filter');
    const themeToggle = document.getElementById('theme-toggle');

    // Modal elements
    const modal = document.getElementById('icon-modal');
    const modalIconPreview = document.getElementById('modal-icon-preview');
    const iconColorInput = document.getElementById('icon-color');
    const iconSizeInput = document.getElementById('icon-size');
    const iconSizeValue = document.getElementById('icon-size-value');
    const modalStyleSelect = document.getElementById('modal-style-select');
    const rotationSelect = document.getElementById('rotation-select');
    const animationSelect = document.getElementById('animation-select');
    const htmlCodeTextarea = document.getElementById('html-code');
    const cssCodeTextarea = document.getElementById('css-code');
    const reactCodeTextarea = document.getElementById('react-code');
    const copyCodeButton = document.getElementById('copy-code-button');
    const favoriteButton = document.getElementById('favorite-button');
    const closeButton = document.querySelector('.close-button');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    let icons = [];
    let aliases = {};
    let currentIcon = '';
    let isLoading = false;
    let searchTimeout;
    let favorites = JSON.parse(localStorage.getItem('fa-favorites') || '[]');
    let activeTab = 'html';
    let showingFavorites = false;

    // Common FontAwesome icons as fallback
    const fallbackIcons = [
        'home', 'user', 'search', 'heart', 'star', 'settings', 'mail', 'phone', 'calendar', 'clock',
        'bookmark', 'tag', 'folder', 'file', 'image', 'video', 'music', 'download', 'upload', 'share',
        'edit', 'delete', 'save', 'print', 'copy', 'cut', 'paste', 'undo', 'redo', 'refresh',
        'play', 'pause', 'stop', 'volume-up', 'volume-down', 'mute', 'microphone', 'camera', 'wifi', 'bluetooth',
        'battery-full', 'signal', 'location', 'map', 'car', 'plane', 'train', 'bus', 'bicycle', 'walking',
        'shopping-cart', 'credit-card', 'money', 'gift', 'trophy', 'medal', 'award', 'thumbs-up', 'thumbs-down', 'like',
        'comment', 'message', 'chat', 'bell', 'notification', 'warning', 'info', 'question', 'check', 'times',
        'plus', 'minus', 'arrow-up', 'arrow-down', 'arrow-left', 'arrow-right', 'chevron-up', 'chevron-down', 'chevron-left', 'chevron-right',
        'github', 'facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'google', 'apple', 'microsoft', 'amazon'
    ];

    // Show loading state
    function showLoading() {
        isLoading = true;
        iconGrid.innerHTML = '<div class="loading-state"><i class="fa-solid fa-spinner fa-spin"></i><p>Loading icons...</p></div>';
    }

    // Show error state
    function showError(message) {
        iconGrid.innerHTML = `<div class="error-state"><i class="fa-solid fa-exclamation-triangle"></i><p>Error: ${message}</p><button onclick="loadIcons()" class="retry-button">Retry</button></div>`;
    }

    // Load icons with fallback
    function loadIcons() {
        showLoading();
        
        // Try to fetch from FontAwesome API first
        fetch('https://api.fontawesome.com/v1/icons?license=free&limit=100')
            .then(response => {
                if (!response.ok) throw new Error('FontAwesome API not available');
                return response.json();
            })
            .then(data => {
                if (data && data.icons) {
                    icons = Object.keys(data.icons);
                } else {
                    throw new Error('Invalid API response');
                }
                isLoading = false;
                displayIcons(icons);
            })
            .catch(error => {
                console.warn('FontAwesome API failed, using fallback icons:', error);
                // Use fallback icons
                icons = fallbackIcons;
                isLoading = false;
                displayIcons(icons);
            });
    }

    // Initialize loading
    loadIcons();

    // Function to display icons
    function displayIcons(iconList) {
        if (isLoading) return;
        
        iconGrid.innerHTML = '';
        
        if (iconList.length === 0) {
            const message = showingFavorites ? 'No favorite icons yet. Click the heart on any icon to add it to favorites!' : 'No icons found matching your search.';
            iconGrid.innerHTML = `<div class="no-results"><i class="fa-solid fa-search"></i><p>${message}</p></div>`;
            return;
        }

        const filteredByStyle = styleSelect.value === 'all' ? iconList : iconList;
        
        filteredByStyle.forEach(iconName => {
            const iconCard = document.createElement('div');
            iconCard.className = 'icon-card';
            
            // Add favorite indicator if icon is favorited
            if (favorites.includes(iconName)) {
                iconCard.classList.add('favorited');
            }

            const iconElement = document.createElement('i');
            const selectedStyle = styleSelect.value === 'all' ? 'fa-solid' : styleSelect.value;
            iconElement.className = `${selectedStyle} fa-${iconName}`;
            iconElement.setAttribute('aria-hidden', 'true');

            const iconNamePara = document.createElement('p');
            iconNamePara.textContent = iconName;
            iconNamePara.title = iconName;

            // Add favorite indicator
            const favoriteIndicator = document.createElement('div');
            favoriteIndicator.className = 'favorite-indicator';
            favoriteIndicator.innerHTML = '<i class="fa-solid fa-heart"></i>';

            iconCard.appendChild(iconElement);
            iconCard.appendChild(iconNamePara);
            iconCard.appendChild(favoriteIndicator);

            iconCard.addEventListener('click', () => openModal(iconName));
            iconCard.setAttribute('role', 'button');
            iconCard.setAttribute('tabindex', '0');
            iconCard.setAttribute('aria-label', `Customize ${iconName} icon`);
            
            // Keyboard navigation support
            iconCard.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(iconName);
                }
            });

            iconGrid.appendChild(iconCard);
        });
    }

    // Filter icons based on search with debouncing
    function filterIcons() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = searchBar.value.toLowerCase();
            let filteredIcons = showingFavorites ? favorites : icons;
            
            if (searchTerm) {
                filteredIcons = filteredIcons.filter(icon => {
                    const allNames = [icon, ...(aliases[icon] || [])];
                    return allNames.some(name => name.toLowerCase().includes(searchTerm));
                });
            }
            
            displayIcons(filteredIcons);
        }, 300);
    }

    // Toggle favorites filter
    function toggleFavoritesFilter() {
        showingFavorites = !showingFavorites;
        const icon = favoritesFilter.querySelector('i');
        
        if (showingFavorites) {
            favoritesFilter.classList.add('active');
            icon.className = 'fa-solid fa-heart';
            favoritesFilter.title = 'Show all icons';
            favoritesFilter.setAttribute('aria-label', 'Show all icons');
        } else {
            favoritesFilter.classList.remove('active');
            icon.className = 'fa-regular fa-heart';
            favoritesFilter.title = 'Show only favorites';
            favoritesFilter.setAttribute('aria-label', 'Filter favorites');
        }
        
        filterIcons();
    }

    // Theme toggle functionality
    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        const icon = themeToggle.querySelector('i');
        icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    // Load theme preference
    function loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.querySelector('i').className = 'fa-solid fa-sun';
        }
    }

    // Tab functionality
    function switchTab(tabName) {
        activeTab = tabName;
        
        // Update tab buttons
        tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // Update tab panes
        tabPanes.forEach(pane => {
            pane.classList.toggle('active', pane.id === `${tabName}-tab`);
        });
        
        generateCode();
    }

    // Favorites functionality
    function toggleFavorite(iconName) {
        const index = favorites.indexOf(iconName);
        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(iconName);
        }
        localStorage.setItem('fa-favorites', JSON.stringify(favorites));
        updateFavoriteButton();
    }

    function updateFavoriteButton() {
        const isFavorite = favorites.includes(currentIcon);
        const icon = favoriteButton.querySelector('i');
        icon.className = isFavorite ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
        favoriteButton.innerHTML = `${icon.outerHTML} ${isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}`;
        
        // Update the grid if we're showing favorites and this icon was just unfavorited
        if (showingFavorites && !isFavorite) {
            filterIcons();
        }
    }

    // Modal functions
    function openModal(iconName) {
        currentIcon = iconName;
        modal.style.display = 'block';
        updateIconPreview();
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    function updateIconPreview() {
        if (!currentIcon) return;

        const color = iconColorInput.value;
        const size = iconSizeInput.value;
        const style = modalStyleSelect.value;
        const rotation = rotationSelect.value;
        const animation = animationSelect.value;

        let classNames = `${style} fa-${currentIcon}`;
        if (rotation) classNames += ` ${rotation}`;
        if (animation) classNames += ` ${animation}`;

        modalIconPreview.className = classNames;
        modalIconPreview.style.color = color;
        modalIconPreview.style.fontSize = `${size}px`;
        iconSizeValue.textContent = `${size}px`;

        updateFavoriteButton();
        generateCode();
    }

    function generateCode() {
        if (!currentIcon) return;

        const color = iconColorInput.value;
        const size = iconSizeInput.value;
        const style = modalStyleSelect.value;
        const rotation = rotationSelect.value;
        const animation = animationSelect.value;

        let classNames = `${style} fa-${currentIcon}`;
        if (rotation) classNames += ` ${rotation}`;
        if (animation) classNames += ` ${animation}`;

        const inlineStyle = `color: ${color}; font-size: ${size}px;`;

        // HTML code
        const htmlCode = `<i class="${classNames}" style="${inlineStyle}"></i>`;
        htmlCodeTextarea.value = htmlCode;

        // CSS code
        const cssCode = `.my-icon {
  color: ${color};
  font-size: ${size}px;
}`;
        if (cssCodeTextarea) cssCodeTextarea.value = cssCode;

        // React code
        const reactCode = `import React from 'react';

const MyIcon = () => (
  <i 
    className="${classNames}" 
    style={{
      color: '${color}',
      fontSize: '${size}px'
    }}
  />
);

export default MyIcon;`;
        if (reactCodeTextarea) reactCodeTextarea.value = reactCode;
    }

    function copyCode() {
        let codeToCopy = '';
        switch (activeTab) {
            case 'html':
                codeToCopy = htmlCodeTextarea.value;
                break;
            case 'css':
                codeToCopy = cssCodeTextarea.value;
                break;
            case 'react':
                codeToCopy = reactCodeTextarea.value;
                break;
        }
        
        navigator.clipboard.writeText(codeToCopy).then(() => {
            const originalText = copyCodeButton.textContent;
            copyCodeButton.textContent = 'Copied!';
            copyCodeButton.style.backgroundColor = '#48bb78';
            setTimeout(() => {
                copyCodeButton.textContent = originalText;
                copyCodeButton.style.backgroundColor = '#4a90e2';
            }, 2000);
        }).catch(() => {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = codeToCopy;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('Code copied to clipboard!');
        });
    }

    // Event listeners for modal
    iconColorInput.addEventListener('input', updateIconPreview);
    iconSizeInput.addEventListener('input', updateIconPreview);
    modalStyleSelect.addEventListener('change', updateIconPreview);
    rotationSelect.addEventListener('change', updateIconPreview);
    animationSelect.addEventListener('change', updateIconPreview);
    copyCodeButton.addEventListener('click', copyCode);
    favoriteButton.addEventListener('click', () => toggleFavorite(currentIcon));
    closeButton.addEventListener('click', closeModal);
    
    // Tab event listeners
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            switchTab(e.target.dataset.tab);
        });
    });
    
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });

    // Main event listeners
    searchBar.addEventListener('input', filterIcons);
    favoritesFilter.addEventListener('click', toggleFavoritesFilter);
    themeToggle.addEventListener('click', toggleTheme);

    // Initialize theme
    loadTheme();

    versionSelect.addEventListener('change', () => {
        const version = versionSelect.value;
        const cssLinks = {
            'v6.7.2': [
                'https://site-assets.fontawesome.com/releases/v6.7.2/css/all.css',
                'https://site-assets.fontawesome.com/releases/v6.7.2/css/sharp-solid.css',
                'https://site-assets.fontawesome.com/releases/v6.7.2/css/sharp-regular.css',
                'https://site-assets.fontawesome.com/releases/v6.7.2/css/sharp-light.css',
                'https://site-assets.fontawesome.com/releases/v6.7.2/css/duotone.css',
                'https://site-assets.fontawesome.com/releases/v6.7.2/css/brands.css'
            ],
            'v6.5.1': [
                'https://site-assets.fontawesome.com/releases/v6.5.1/css/all.css',
                'https://site-assets.fontawesome.com/releases/v6.5.1/css/sharp-solid.css',
                'https://site-assets.fontawesome.com/releases/v6.5.1/css/sharp-regular.css',
                'https://site-assets.fontawesome.com/releases/v6.5.1/css/sharp-light.css',
                'https://site-assets.fontawesome.com/releases/v6.5.1/css/duotone.css',
                'https://site-assets.fontawesome.com/releases/v6.5.1/css/brands.css'
            ],
            'v6.5.0': [
                'https://site-assets.fontawesome.com/releases/v6.5.0/css/all.css',
                'https://site-assets.fontawesome.com/releases/v6.5.0/css/sharp-solid.css',
                'https://site-assets.fontawesome.com/releases/v6.5.0/css/sharp-regular.css',
                'https://site-assets.fontawesome.com/releases/v6.5.0/css/sharp-light.css',
                'https://site-assets.fontawesome.com/releases/v6.5.0/css/duotone.css',
                'https://site-assets.fontawesome.com/releases/v6.5.0/css/brands.css'
            ],
            'v6.4.2': [
                'https://site-assets.fontawesome.com/releases/v6.4.2/css/all.css',
                'https://site-assets.fontawesome.com/releases/v6.4.2/css/sharp-solid.css',
                'https://site-assets.fontawesome.com/releases/v6.4.2/css/sharp-regular.css',
                'https://site-assets.fontawesome.com/releases/v6.4.2/css/sharp-light.css',
                'https://site-assets.fontawesome.com/releases/v6.4.2/css/duotone.css',
                'https://site-assets.fontawesome.com/releases/v6.4.2/css/brands.css'
            ],
            'v6.4.0': [
                'https://site-assets.fontawesome.com/releases/v6.4.0/css/all.css',
                'https://site-assets.fontawesome.com/releases/v6.4.0/css/sharp-solid.css',
                'https://site-assets.fontawesome.com/releases/v6.4.0/css/sharp-regular.css',
                'https://site-assets.fontawesome.com/releases/v6.4.0/css/sharp-light.css',
                'https://site-assets.fontawesome.com/releases/v6.4.0/css/duotone.css',
                'https://site-assets.fontawesome.com/releases/v6.4.0/css/brands.css'
            ],
            'v5.15.4': [
                'https://site-assets.fontawesome.com/releases/v5.15.4/css/all.css',
                'https://site-assets.fontawesome.com/releases/v5.15.4/css/duotone.css'
            ]
        };

        // Remove existing stylesheets
        document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            if (link.href.includes('fontawesome')) {
                link.remove();
            }
        });

        // Add new stylesheets
        const head = document.head;
        cssLinks[version].forEach(href => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            head.appendChild(link);
        });

        // Re-display icons with the new version
        filterIcons();
    });

    styleSelect.addEventListener('change', filterIcons);
});
