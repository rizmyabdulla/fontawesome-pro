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

    // Show loading state
    function showLoading() {
        isLoading = true;
        iconGrid.innerHTML = '<div class="loading-state"><i class="fa-solid fa-spinner fa-spin"></i><p>Loading icons...</p></div>';
    }

    // Show error state
    function showError(message) {
        iconGrid.innerHTML = `<div class="error-state"><i class="fa-solid fa-exclamation-triangle"></i><p>Error: ${message}</p><button onclick="loadIcons()" class="retry-button">Retry</button></div>`;
    }

    // Load comprehensive icon library
    function loadIcons() {
        showLoading();
        
        try {
            // Import the comprehensive icon database
            const script = document.createElement('script');
            script.src = 'icons-database.js';
            script.onload = function() {
                // Get all icons from the comprehensive database
                if (typeof getAllIcons === 'function') {
                    const allIcons = getAllIcons();
                    icons = allIcons.map(iconObj => iconObj.name);
                    // Remove duplicates and sort
                    icons = [...new Set(icons)].sort();
                    console.log(`Loaded ${icons.length} icons from comprehensive database`);
                } else {
                    // Fallback to a larger predefined list if database fails
                    icons = getExtendedIconList();
                    console.log(`Using extended fallback icon list: ${icons.length} icons`);
                }
                isLoading = false;
                displayIcons(icons);
            };
            script.onerror = function() {
                console.warn('Could not load icon database, using extended fallback');
                icons = getExtendedIconList();
                isLoading = false;
                displayIcons(icons);
            };
            document.head.appendChild(script);
        } catch (error) {
            console.warn('Error loading icons:', error);
            icons = getExtendedIconList();
            isLoading = false;
            displayIcons(icons);
        }
    }

    // Extended fallback icon list (much larger than original)
    function getExtendedIconList() {
        return [
            // Basic UI Icons
            'home', 'user', 'users', 'search', 'settings', 'cog', 'bars', 'times', 'plus', 'minus',
            'check', 'arrow-up', 'arrow-down', 'arrow-left', 'arrow-right', 'chevron-up', 'chevron-down',
            'chevron-left', 'chevron-right', 'angle-up', 'angle-down', 'angle-left', 'angle-right',
            
            // Content Icons
            'heart', 'star', 'bookmark', 'tag', 'tags', 'comment', 'comments', 'message', 'chat',
            'bell', 'envelope', 'paper-plane', 'share', 'thumbs-up', 'thumbs-down', 'like',
            
            // File Icons
            'file', 'file-alt', 'file-pdf', 'file-word', 'file-excel', 'file-powerpoint', 'file-image',
            'file-video', 'file-audio', 'folder', 'folder-open', 'copy', 'cut', 'paste', 'save',
            'download', 'upload', 'print', 'edit', 'pen', 'pencil-alt',
            
            // Media Icons
            'image', 'images', 'camera', 'video', 'film', 'music', 'headphones', 'microphone',
            'volume-up', 'volume-down', 'volume-off', 'play', 'pause', 'stop', 'step-forward',
            'step-backward', 'fast-forward', 'fast-backward',
            
            // Communication Icons
            'phone', 'mobile', 'mobile-alt', 'fax', 'address-book', 'id-card', 'user-circle',
            'user-plus', 'user-minus', 'user-check', 'user-times', 'user-edit',
            
            // Shopping Icons
            'shopping-cart', 'shopping-bag', 'credit-card', 'money-bill', 'coins', 'dollar-sign',
            'euro-sign', 'pound-sign', 'store', 'gift', 'receipt',
            
            // Technology Icons
            'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'wifi', 'bluetooth', 'usb',
            'battery-full', 'battery-half', 'battery-empty',
            
            // Transportation Icons
            'car', 'truck', 'bus', 'taxi', 'motorcycle', 'bicycle', 'walking', 'running',
            'plane', 'helicopter', 'ship', 'train', 'map', 'location-arrow',
            
            // Time Icons
            'calendar', 'calendar-alt', 'clock', 'stopwatch', 'hourglass', 'history', 'undo', 'redo',
            
            // Weather Icons
            'sun', 'moon', 'cloud', 'cloud-rain', 'bolt', 'umbrella', 'snowflake',
            
            // Health Icons
            'heart-pulse', 'stethoscope', 'pills', 'syringe', 'hospital', 'ambulance',
            
            // Sports Icons
            'futbol', 'basketball-ball', 'football-ball', 'tennis-ball', 'dumbbell', 'trophy', 'medal',
            
            // Food Icons
            'utensils', 'coffee', 'wine-glass', 'beer', 'pizza-slice', 'hamburger', 'apple-alt',
            
            // Building Icons
            'building', 'university', 'school', 'church', 'hotel', 'key', 'lock', 'unlock',
            
            // Tools Icons
            'hammer', 'wrench', 'screwdriver', 'toolbox', 'paint-brush', 'scissors',
            
            // Security Icons
            'shield', 'fingerprint', 'user-secret', 'eye', 'eye-slash', 'mask',
            
            // Education Icons
            'graduation-cap', 'book', 'bookmark', 'pencil-alt', 'eraser', 'calculator',
            
            // Business Icons
            'briefcase', 'chart-bar', 'chart-pie', 'chart-line', 'presentation', 'handshake',
            
            // Status Icons
            'info', 'info-circle', 'question', 'question-circle', 'exclamation', 'exclamation-circle',
            'exclamation-triangle', 'check-circle', 'times-circle', 'plus-circle', 'minus-circle',
            
            // Brand Icons
            'github', 'facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'google', 'apple',
            'microsoft', 'amazon', 'netflix', 'spotify', 'discord', 'slack', 'whatsapp',
            
            // Additional Popular Icons
            'anchor', 'archive', 'at', 'ban', 'barcode', 'bath', 'bed', 'birthday-cake', 'bomb',
            'brush', 'bug', 'bullhorn', 'bullseye', 'burn', 'calculator', 'camera-retro',
            'camping', 'car-battery', 'carrot', 'certificate', 'charging-station', 'chart-area',
            'chess', 'child', 'circle', 'clipboard', 'cloud-download', 'cloud-upload', 'cocktail',
            'code', 'compass', 'cookie', 'crown', 'cube', 'database', 'dice', 'dna', 'dove',
            'dragon', 'drum', 'envelope-open', 'eye-dropper', 'feather', 'fire', 'fish', 'flag',
            'flask', 'gamepad', 'gem', 'ghost', 'globe', 'hand-paper', 'hat-wizard', 'headset',
            'hiking', 'ice-cream', 'igloo', 'infinity', 'jar', 'jewelry', 'kiwi-bird', 'laptop-code',
            'leaf', 'lemon', 'lightbulb', 'magic', 'magnet', 'mask', 'microscope', 'mountain',
            'mug-hot', 'music', 'network-wired', 'otter', 'palette', 'paper-plane', 'passport',
            'paw', 'pepper-hot', 'piggy-bank', 'pizza-slice', 'podcast', 'portrait', 'puzzle-piece',
            'quidditch', 'rainbow', 'recycle', 'robot', 'rocket', 'route', 'satellite', 'seedling',
            'server', 'shapes', 'shield-alt', 'shower', 'skull', 'smile', 'smoking', 'snowman',
            'soap', 'solar-panel', 'spa', 'spider', 'stamp', 'star-of-life', 'suitcase', 'swimming-pool',
            'tablet-alt', 'tachometer-alt', 'telescope', 'theater-masks', 'thermometer', 'ticket-alt',
            'toilet', 'tooth', 'tree', 'truck-monster', 'umbrella-beach', 'university', 'user-astronaut',
            'user-ninja', 'utensil-spoon', 'vr-cardboard', 'walking', 'water', 'wind', 'wine-bottle',
            'wizard-hat', 'yin-yang', 'zombie'
        ];
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

        // Limit display to improve performance (show first 500 icons)
        const maxIcons = 500;
        const iconsToShow = iconList.slice(0, maxIcons);
        
        if (iconList.length > maxIcons) {
            console.log(`Showing first ${maxIcons} of ${iconList.length} icons. Use search to find specific icons.`);
        }
        
        iconsToShow.forEach(iconName => {
            // Handle both string names and icon objects
            const name = typeof iconName === 'string' ? iconName : iconName.name;
            
            const iconCard = document.createElement('div');
            iconCard.className = 'icon-card';
            
            // Add favorite indicator if icon is favorited
            if (favorites.includes(name)) {
                iconCard.classList.add('favorited');
            }

            const iconElement = document.createElement('i');
            const selectedStyle = getIconStyle(name);
            iconElement.className = `${selectedStyle} fa-${name}`;
            iconElement.setAttribute('aria-hidden', 'true');
            
            // Add fallback for when icon doesn't load
            iconElement.setAttribute('data-icon', name.charAt(0).toUpperCase());

            const iconNamePara = document.createElement('p');
            iconNamePara.textContent = name;
            iconNamePara.title = name;

            // Add favorite indicator
            const favoriteIndicator = document.createElement('div');
            favoriteIndicator.className = 'favorite-indicator';
            favoriteIndicator.innerHTML = '<i class="fa-solid fa-heart"></i>';

            iconCard.appendChild(iconElement);
            iconCard.appendChild(iconNamePara);
            iconCard.appendChild(favoriteIndicator);

            iconCard.addEventListener('click', () => openModal(name));
            iconCard.setAttribute('role', 'button');
            iconCard.setAttribute('tabindex', '0');
            iconCard.setAttribute('aria-label', `Customize ${name} icon`);
            
            // Keyboard navigation support
            iconCard.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(name);
                }
            });

            iconGrid.appendChild(iconCard);
        });
        
        // Add load more button if there are more icons
        if (iconList.length > maxIcons) {
            const loadMoreCard = document.createElement('div');
            loadMoreCard.className = 'icon-card load-more-card';
            loadMoreCard.innerHTML = `
                <i class="fa-solid fa-plus-circle"></i>
                <p>Load More Icons</p>
                <small>${iconList.length - maxIcons} more available</small>
            `;
            loadMoreCard.style.cursor = 'pointer';
            loadMoreCard.addEventListener('click', () => {
                displayIcons(iconList); // This will show all icons
            });
            iconGrid.appendChild(loadMoreCard);
        }
    }

    // Get appropriate style for icon
    function getIconStyle(iconName) {
        const styleFilter = styleSelect.value;
        
        if (styleFilter !== 'all') {
            const styleMap = {
                'fa-solid': 'fa-solid',
                'fa-regular': 'fa-regular',
                'fa-light': 'fa-light',
                'fa-duotone': 'fa-duotone',
                'fa-brands': 'fa-brands',
                'sharp-solid': 'fa-sharp fa-solid',
                'sharp-regular': 'fa-sharp fa-regular', 
                'sharp-light': 'fa-sharp fa-light'
            };
            return styleMap[styleFilter] || 'fa-solid';
        }
        
        // Auto-detect style based on icon name
        const brandIcons = ['github', 'facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'google', 'apple', 'microsoft', 'amazon', 'discord', 'slack', 'whatsapp', 'spotify', 'netflix'];
        if (brandIcons.includes(iconName)) {
            return 'fa-brands';
        }
        
        return 'fa-solid'; // Default to solid
    }

    // Filter icons based on search and style with debouncing
    function filterIcons() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = searchBar.value.toLowerCase();
            const selectedStyle = styleSelect.value;
            
            let filteredIcons = showingFavorites ? favorites : icons;
            
            // Filter by style if not 'all'
            if (selectedStyle !== 'all') {
                // Get icons for specific style from database
                filteredIcons = getIconsForStyle(selectedStyle);
            }
            
            // Filter by search term
            if (searchTerm) {
                filteredIcons = filteredIcons.filter(icon => {
                    const iconName = typeof icon === 'string' ? icon : icon.name;
                    const allNames = [iconName, ...(aliases[iconName] || [])];
                    return allNames.some(name => name.toLowerCase().includes(searchTerm));
                });
            }
            
            displayIcons(filteredIcons);
        }, 300);
    }

    // Get icons for specific style
    function getIconsForStyle(style) {
        // Map UI style values to database keys
        const styleMap = {
            'fa-solid': 'solid',
            'fa-regular': 'regular',
            'fa-light': 'light',
            'fa-duotone': 'duotone',
            'fa-brands': 'brands',
            'sharp-solid': 'sharpSolid',
            'sharp-regular': 'sharpRegular',
            'sharp-light': 'sharpLight'
        };
        
        const dbStyle = styleMap[style];
        if (typeof FONTAWESOME_ICONS !== 'undefined' && dbStyle && FONTAWESOME_ICONS[dbStyle]) {
            return FONTAWESOME_ICONS[dbStyle];
        }
        
        // Fallback: filter current icons by brand names for brands style
        if (style === 'fa-brands') {
            const brandIcons = ['github', 'facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'google', 'apple', 'microsoft', 'amazon', 'discord', 'slack', 'whatsapp', 'spotify', 'netflix', 'pinterest', 'reddit', 'tumblr', 'snapchat', 'tiktok', 'telegram', 'android', 'chrome', 'firefox', 'safari', 'edge', 'opera', 'ubuntu', 'windows', 'linux', 'docker', 'bitbucket', 'gitlab', 'codepen', 'jsfiddle', 'stackoverflow', 'steam', 'twitch', 'xbox', 'playstation', 'nintendo-switch'];
            return icons.filter(icon => brandIcons.includes(icon));
        }
        
        return icons; // Return all if no specific filtering available
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
