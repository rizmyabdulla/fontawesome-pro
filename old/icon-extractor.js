// FontAwesome CSS Icon Extractor
// This module extracts icon names from FontAwesome CSS files dynamically

class FontAwesomeIconExtractor {
    constructor() {
        this.iconCache = new Map();
        this.cssCache = new Map();
    }

    /**
     * Extract icon names from FontAwesome CSS content
     * Supports both v5 and v6+ versions with different patterns
     */
    extractIconsFromCSS(cssContent, version = 'v6') {
        const icons = new Set();
        
        // Common patterns for FontAwesome icons
        const patterns = [
            // v6+ patterns: .fa-icon-name:before or .fa-icon-name::before
            /\.fa-([a-zA-Z0-9-]+)::?before/g,
            // v5 patterns: .fa-icon-name:before
            /\.fa-([a-zA-Z0-9-]+)::?before/g,
            // Alternative patterns with specific styles
            /\.fa-solid\.fa-([a-zA-Z0-9-]+)::?before/g,
            /\.fa-regular\.fa-([a-zA-Z0-9-]+)::?before/g,
            /\.fa-light\.fa-([a-zA-Z0-9-]+)::?before/g,
            /\.fa-duotone\.fa-([a-zA-Z0-9-]+)::?before/g,
            /\.fa-brands\.fa-([a-zA-Z0-9-]+)::?before/g,
            // Sharp variants (v6.4+)
            /\.fa-sharp\.fa-solid\.fa-([a-zA-Z0-9-]+)::?before/g,
            /\.fa-sharp\.fa-regular\.fa-([a-zA-Z0-9-]+)::?before/g,
            /\.fa-sharp\.fa-light\.fa-([a-zA-Z0-9-]+)::?before/g,
        ];

        // Apply all patterns
        patterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(cssContent)) !== null) {
                const iconName = match[1];
                // Filter out utility classes and invalid names
                if (this.isValidIconName(iconName)) {
                    icons.add(iconName);
                }
            }
        });

        return Array.from(icons).sort();
    }

    /**
     * Check if an extracted name is a valid icon name
     */
    isValidIconName(name) {
        // Filter out utility classes and invalid names
        const invalidPrefixes = [
            'fw', 'li', 'border', 'pull', 'spin', 'pulse', 'rotate', 'flip',
            'inverse', 'stack', 'xs', 'sm', 'lg', '1x', '2x', '3x', '4x', '5x',
            '6x', '7x', '8x', '9x', '10x', 'bounce', 'beat', 'fade', 'shake'
        ];
        
        const invalidNames = [
            'sr-only', 'sr-only-focusable'
        ];

        // Check if name starts with invalid prefix
        if (invalidPrefixes.some(prefix => name.startsWith(prefix))) {
            return false;
        }

        // Check if name is in invalid list
        if (invalidNames.includes(name)) {
            return false;
        }

        // Must contain at least one letter and be reasonable length
        return /[a-zA-Z]/.test(name) && name.length >= 1 && name.length <= 50;
    }

    /**
     * Fetch and parse CSS from FontAwesome CDN
     */
    async fetchIconsFromVersion(version = 'v6.7.2', styles = ['all']) {
        const cacheKey = `${version}-${styles.join(',')}`;
        
        // Check cache first
        if (this.iconCache.has(cacheKey)) {
            return this.iconCache.get(cacheKey);
        }

        const allIcons = new Set();
        const baseUrl = `https://site-assets.fontawesome.com/releases/${version}/css/`;
        
        // Define CSS files to fetch based on styles
        const cssFiles = this.getCSSFilesForStyles(styles, version);
        
        try {
            // Try to fetch all CSS files
            const fetchPromises = cssFiles.map(async (cssFile) => {
                const cssUrl = baseUrl + cssFile;
                
                try {
                    const response = await fetch(cssUrl, {
                        method: 'GET',
                        cache: 'default',
                        headers: {
                            'Accept': 'text/css,*/*;q=0.1'
                        }
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    
                    const cssContent = await response.text();
                    return this.extractIconsFromCSS(cssContent, version);
                } catch (error) {
                    console.warn(`Failed to fetch ${cssFile}:`, error.message);
                    return [];
                }
            });

            const results = await Promise.all(fetchPromises);
            
            // Combine all icons
            results.forEach(icons => {
                icons.forEach(icon => allIcons.add(icon));
            });

            const iconList = Array.from(allIcons).sort();
            
            // If we got some icons, cache and return them
            if (iconList.length > 0) {
                this.iconCache.set(cacheKey, iconList);
                return iconList;
            } else {
                throw new Error('No icons extracted from CSS files');
            }
            
        } catch (error) {
            console.warn('CSS extraction failed, using pre-extracted data:', error);
            
            // Fallback to pre-extracted icon data
            return this.getPreExtractedIcons(version, styles);
        }
    }

    /**
     * Get pre-extracted icon data as fallback
     */
    getPreExtractedIcons(version, styles) {
        // Use window.FontAwesomeIconData if available
        const iconData = (typeof window !== 'undefined' && window.FontAwesomeIconData) || 
                        (typeof FontAwesomeIconData !== 'undefined' && FontAwesomeIconData);
        
        if (!iconData) {
            console.error('No icon data available');
            return [];
        }

        let icons = [];
        
        // Get main icon set for version
        if (iconData[version]) {
            icons = [...iconData[version]];
        } else {
            // Fallback to latest version data
            icons = [...iconData['v6.7.2']];
        }
        
        // Add brand icons if requested
        if (styles.includes('all') || styles.includes('brands')) {
            if (iconData.brands) {
                icons = [...icons, ...iconData.brands];
            }
        }
        
        // Remove duplicates and sort
        const uniqueIcons = [...new Set(icons)].sort();
        
        // Cache the result
        const cacheKey = `${version}-${styles.join(',')}`;
        this.iconCache.set(cacheKey, uniqueIcons);
        
        return uniqueIcons;
    }

    /**
     * Get CSS file names for given styles and version
     */
    getCSSFilesForStyles(styles, version) {
        if (styles.includes('all')) {
            // For v6+
            if (version.startsWith('v6')) {
                return [
                    'all.css',
                    'sharp-solid.css',
                    'sharp-regular.css', 
                    'sharp-light.css',
                    'duotone.css',
                    'brands.css'
                ];
            } else {
                // For v5
                return ['all.css', 'duotone.css'];
            }
        }
        
        // Map specific styles to CSS files
        const styleMap = {
            'solid': 'all.css',
            'regular': 'all.css', 
            'light': 'all.css',
            'duotone': 'duotone.css',
            'brands': 'brands.css',
            'sharp-solid': 'sharp-solid.css',
            'sharp-regular': 'sharp-regular.css',
            'sharp-light': 'sharp-light.css'
        };

        const cssFiles = new Set();
        styles.forEach(style => {
            const cssFile = styleMap[style];
            if (cssFile) {
                cssFiles.add(cssFile);
            }
        });

        return Array.from(cssFiles);
    }

    /**
     * Filter icons by style (for display purposes)
     */
    filterIconsByStyle(icons, style, version) {
        // For this implementation, we'll return all icons since style filtering
        // happens at the display level, not the extraction level
        return icons;
    }

    /**
     * Clear cache (useful for testing or memory management)
     */
    clearCache() {
        this.iconCache.clear();
        this.cssCache.clear();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FontAwesomeIconExtractor;
} else {
    window.FontAwesomeIconExtractor = FontAwesomeIconExtractor;
}