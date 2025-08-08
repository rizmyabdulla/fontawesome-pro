document.addEventListener('DOMContentLoaded', () => {
    const iconGrid = document.getElementById('icon-grid');
    const searchBar = document.getElementById('search-bar');
    const versionSelect = document.getElementById('version-select');
    const styleSelect = document.getElementById('style-select');

    // Modal elements
    const modal = document.getElementById('icon-modal');
    const modalIconPreview = document.getElementById('modal-icon-preview');
    const iconColorInput = document.getElementById('icon-color');
    const iconSizeInput = document.getElementById('icon-size');
    const iconSizeValue = document.getElementById('icon-size-value');
    const modalStyleSelect = document.getElementById('modal-style-select');
    const htmlCodeTextarea = document.getElementById('html-code');
    const copyCodeButton = document.getElementById('copy-code-button');
    const closeButton = document.querySelector('.close-button');

    let icons = [];
    let aliases = {};
    let currentIcon = '';

    // Fetch the icon data
    fetch('https://cdn.jsdelivr.net/npm/@iconify-json/fa@1.2.1/icons.json')
        .then(response => response.json())
        .then(data => {
            // Process icons and aliases
            for (const key in data.icons) {
                icons.push(key);
            }
            if (data.aliases) {
                for (const key in data.aliases) {
                    const parent = data.aliases[key].parent;
                    if (!aliases[parent]) {
                        aliases[parent] = [];
                    }
                    aliases[parent].push(key);
                }
            }
            displayIcons(icons);
        })
        .catch(error => console.error('Error fetching icon data:', error));

    // Function to display icons
    function displayIcons(iconList) {
        iconGrid.innerHTML = '';
        iconList.forEach(iconName => {
            const iconCard = document.createElement('div');
            iconCard.className = 'icon-card';

            const iconElement = document.createElement('i');
            const selectedStyle = styleSelect.value === 'all' ? 'fa-solid' : styleSelect.value;
            iconElement.className = `${selectedStyle} fa-${iconName}`;

            const iconNamePara = document.createElement('p');
            iconNamePara.textContent = iconName;

            iconCard.appendChild(iconElement);
            iconCard.appendChild(iconNamePara);

            iconCard.addEventListener('click', () => openModal(iconName));

            iconGrid.appendChild(iconCard);
        });
    }

    // Filter icons based on search
    function filterIcons() {
        const searchTerm = searchBar.value.toLowerCase();
        const filteredIcons = icons.filter(icon => {
            const allNames = [icon, ...(aliases[icon] || [])];
            return allNames.some(name => name.toLowerCase().includes(searchTerm));
        });
        displayIcons(filteredIcons);
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

        modalIconPreview.className = `${style} fa-${currentIcon}`;
        modalIconPreview.style.color = color;
        modalIconPreview.style.fontSize = `${size}px`;
        iconSizeValue.textContent = `${size}px`;

        generateCode();
    }

    function generateCode() {
        if (!currentIcon) return;

        const color = iconColorInput.value;
        const size = iconSizeInput.value;
        const style = modalStyleSelect.value;

        const inlineStyle = `color: ${color}; font-size: ${size}px;`;
        const html = `<i class="${style} fa-${currentIcon}" style="${inlineStyle}"></i>`;
        htmlCodeTextarea.value = html;
    }

    function copyCode() {
        htmlCodeTextarea.select();
        document.execCommand('copy');
        alert('Code copied to clipboard!');
    }

    // Event listeners for modal
    iconColorInput.addEventListener('input', updateIconPreview);
    iconSizeInput.addEventListener('input', updateIconPreview);
    modalStyleSelect.addEventListener('change', updateIconPreview);
    copyCodeButton.addEventListener('click', copyCode);
    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });

    // Event listeners
    searchBar.addEventListener('input', filterIcons);

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
