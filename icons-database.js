// Comprehensive FontAwesome Pro Icons Database
// This replaces the limited fallback system with a complete icon library

const FONTAWESOME_ICONS = {
  // Solid Icons (Most Common)
  solid: [
    // Navigation & UI
    'home', 'user', 'users', 'search', 'settings', 'cog', 'bars', 'times', 'plus', 'minus',
    'check', 'arrow-up', 'arrow-down', 'arrow-left', 'arrow-right', 'chevron-up', 'chevron-down',
    'chevron-left', 'chevron-right', 'angle-up', 'angle-down', 'angle-left', 'angle-right',
    'caret-up', 'caret-down', 'caret-left', 'caret-right', 'sort', 'sort-up', 'sort-down',
    
    // Content & Communication
    'heart', 'star', 'bookmark', 'tag', 'tags', 'comment', 'comments', 'message', 'chat',
    'bell', 'envelope', 'paper-plane', 'share', 'thumbs-up', 'thumbs-down', 'like', 'love',
    'angry', 'sad', 'smile', 'laugh', 'grin', 'kiss', 'surprise', 'neutral', 'frown',
    
    // Files & Documents
    'file', 'file-alt', 'file-pdf', 'file-word', 'file-excel', 'file-powerpoint', 'file-image',
    'file-video', 'file-audio', 'file-archive', 'file-code', 'folder', 'folder-open',
    'copy', 'cut', 'paste', 'save', 'download', 'upload', 'print', 'edit', 'pen', 'pencil-alt',
    
    // Media & Multimedia
    'image', 'images', 'photo', 'camera', 'video', 'film', 'music', 'headphones', 'microphone',
    'volume-up', 'volume-down', 'volume-off', 'volume-mute', 'play', 'pause', 'stop',
    'step-forward', 'step-backward', 'fast-forward', 'fast-backward', 'eject', 'record',
    
    // Communication & Social
    'phone', 'mobile', 'mobile-alt', 'fax', 'address-book', 'id-card', 'user-circle',
    'user-plus', 'user-minus', 'user-check', 'user-times', 'user-edit', 'user-cog',
    'users-cog', 'user-friends', 'user-graduate', 'user-tie', 'user-nurse', 'user-md',
    
    // Shopping & Commerce
    'shopping-cart', 'shopping-bag', 'shopping-basket', 'credit-card', 'money-bill',
    'money-bill-alt', 'coins', 'dollar-sign', 'euro-sign', 'pound-sign', 'yen-sign',
    'store', 'warehouse', 'truck', 'shipping-fast', 'gift', 'receipt', 'cash-register',
    
    // Technology & Devices
    'laptop', 'desktop', 'tablet', 'mobile-alt', 'keyboard', 'mouse', 'headset', 'gamepad',
    'tv', 'radio', 'wifi', 'bluetooth', 'usb', 'ethernet', 'plug', 'battery-full',
    'battery-three-quarters', 'battery-half', 'battery-quarter', 'battery-empty',
    
    // Transportation
    'car', 'car-alt', 'truck', 'van', 'bus', 'taxi', 'motorcycle', 'bicycle', 'walking',
    'running', 'plane', 'helicopter', 'rocket', 'ship', 'anchor', 'train', 'subway',
    'tram', 'traffic-light', 'gas-pump', 'parking', 'road', 'map', 'compass', 'location-arrow',
    
    // Time & Calendar
    'calendar', 'calendar-alt', 'calendar-check', 'calendar-plus', 'calendar-minus',
    'calendar-times', 'clock', 'stopwatch', 'hourglass', 'hourglass-start', 'hourglass-half',
    'hourglass-end', 'history', 'undo', 'redo', 'sync', 'sync-alt', 'refresh',
    
    // Weather & Nature
    'sun', 'moon', 'cloud', 'cloud-rain', 'cloud-snow', 'bolt', 'rainbow', 'umbrella',
    'thermometer', 'wind', 'tornado', 'hurricane', 'snowflake', 'icicles', 'fire',
    'leaf', 'tree', 'seedling', 'flower', 'bug', 'spider', 'cat', 'dog', 'fish', 'dove',
    
    // Health & Medical
    'heart-pulse', 'heartbeat', 'stethoscope', 'user-md', 'user-nurse', 'hospital',
    'ambulance', 'pills', 'capsules', 'syringe', 'thermometer', 'x-ray', 'dna',
    'microscope', 'flask', 'vial', 'smoking', 'smoking-ban', 'wheelchair', 'crutch',
    
    // Sports & Activities
    'futbol', 'basketball-ball', 'football-ball', 'baseball-ball', 'tennis-ball',
    'volleyball-ball', 'golf-ball', 'hockey-puck', 'bowling-ball', 'ping-pong-paddle',
    'dumbbell', 'weight-hanging', 'running', 'biking', 'swimming-pool', 'skiing',
    'snowboarding', 'skating', 'climbing', 'hiking', 'campground', 'mountain',
    
    // Food & Dining
    'utensils', 'fork', 'knife', 'spoon', 'plate', 'bowl', 'cup', 'mug', 'wine-glass',
    'beer', 'cocktail', 'coffee', 'tea', 'pizza-slice', 'hamburger', 'hotdog', 'taco',
    'ice-cream', 'cookie', 'birthday-cake', 'apple-alt', 'carrot', 'pepper-hot',
    
    // Buildings & Places
    'home', 'building', 'city', 'university', 'school', 'hospital', 'church', 'mosque',
    'synagogue', 'store', 'warehouse', 'factory', 'hotel', 'bed', 'couch', 'bath',
    'shower', 'toilet', 'door-open', 'door-closed', 'key', 'lock', 'unlock',
    
    // Tools & Objects
    'hammer', 'wrench', 'screwdriver', 'saw', 'drill', 'toolbox', 'ruler', 'compass-drafting',
    'paint-brush', 'palette', 'spray-can', 'bucket', 'broom', 'vacuum', 'mop', 'soap',
    'scissors', 'paperclip', 'stapler', 'calculator', 'abacus', 'ruler-combined',
    
    // Security & Protection
    'shield', 'shield-alt', 'lock', 'unlock', 'unlock-alt', 'key', 'fingerprint',
    'user-secret', 'eye', 'eye-slash', 'mask', 'hard-hat', 'vest', 'fire-extinguisher',
    'life-ring', 'first-aid', 'exclamation-triangle', 'radiation', 'biohazard',
    
    // Education & Learning
    'graduation-cap', 'university', 'school', 'chalkboard', 'chalkboard-teacher',
    'book', 'book-open', 'bookmark', 'library', 'pencil-alt', 'pen', 'highlighter',
    'eraser', 'ruler', 'calculator', 'globe', 'atom', 'dna', 'microscope', 'telescope',
    
    // Business & Office
    'briefcase', 'suitcase', 'id-card', 'address-card', 'clipboard', 'tasks', 'project-diagram',
    'chart-bar', 'chart-pie', 'chart-line', 'chart-area', 'analytics', 'presentation',
    'handshake', 'deal', 'contract', 'signature', 'stamp', 'balance-scale',
    
    // Gaming & Entertainment
    'gamepad', 'dice', 'chess', 'chess-king', 'chess-queen', 'chess-rook', 'chess-bishop',
    'chess-knight', 'chess-pawn', 'puzzle-piece', 'magic', 'wand-magic', 'hat-wizard',
    'theater-masks', 'ticket-alt', 'trophy', 'medal', 'award', 'crown', 'gem',
    
    // Arrows & Directions (Extended)
    'arrows-alt', 'expand', 'compress', 'expand-arrows-alt', 'external-link-alt',
    'link', 'unlink', 'anchor', 'route', 'directions', 'location-arrow', 'crosshairs',
    'bullseye', 'gps-fixed', 'map-marker', 'map-marker-alt', 'map-pin',
    
    // Status & Notifications
    'info', 'info-circle', 'question', 'question-circle', 'exclamation', 'exclamation-circle',
    'exclamation-triangle', 'check-circle', 'times-circle', 'plus-circle', 'minus-circle',
    'dot-circle', 'circle', 'square', 'stop-circle', 'play-circle', 'pause-circle'
  ],
  
  // Regular (Outline) Icons
  regular: [
    'heart', 'star', 'bookmark', 'user', 'envelope', 'comment', 'bell', 'clock',
    'calendar', 'file', 'folder', 'image', 'copy', 'save', 'edit', 'trash-alt',
    'eye', 'eye-slash', 'thumbs-up', 'thumbs-down', 'smile', 'frown', 'meh',
    'circle', 'square', 'check-circle', 'times-circle', 'plus-circle', 'minus-circle',
    'question-circle', 'info-circle', 'exclamation-circle', 'lightbulb', 'gem',
    'moon', 'sun', 'snowflake', 'flag', 'paper-plane', 'hand-point-up', 'hand-point-down'
  ],
  
  // Light Icons (Pro)
  light: [
    'home', 'user', 'search', 'heart', 'star', 'settings', 'menu', 'close',
    'plus', 'minus', 'check', 'times', 'arrow-up', 'arrow-down', 'arrow-left', 'arrow-right',
    'envelope', 'phone', 'calendar', 'clock', 'file', 'folder', 'image', 'video',
    'music', 'camera', 'microphone', 'speaker', 'headphones', 'play', 'pause', 'stop'
  ],
  
  // Duotone Icons (Pro)
  duotone: [
    'home', 'user', 'users', 'heart', 'star', 'bookmark', 'tag', 'comment', 'bell',
    'envelope', 'calendar', 'clock', 'file', 'folder', 'image', 'video', 'music',
    'camera', 'phone', 'mobile', 'laptop', 'desktop', 'car', 'plane', 'ship',
    'building', 'hospital', 'school', 'store', 'restaurant', 'hotel'
  ],
  
  // Brand Icons
  brands: [
    'facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok', 'snapchat',
    'pinterest', 'reddit', 'tumblr', 'whatsapp', 'telegram', 'discord', 'slack',
    'github', 'gitlab', 'bitbucket', 'stackoverflow', 'codepen', 'jsfiddle',
    'google', 'microsoft', 'apple', 'amazon', 'netflix', 'spotify', 'steam',
    'twitch', 'xbox', 'playstation', 'nintendo-switch', 'android', 'chrome',
    'firefox', 'safari', 'edge', 'opera', 'ubuntu', 'windows', 'linux', 'docker'
  ],
  
  // Sharp Solid (Pro)
  sharpSolid: [
    'home', 'user', 'search', 'heart', 'star', 'settings', 'menu', 'close',
    'plus', 'minus', 'check', 'times', 'arrow-up', 'arrow-down', 'arrow-left', 'arrow-right',
    'chevron-up', 'chevron-down', 'chevron-left', 'chevron-right', 'envelope', 'phone',
    'calendar', 'clock', 'file', 'folder', 'image', 'video', 'music', 'camera'
  ],
  
  // Sharp Regular (Pro)  
  sharpRegular: [
    'heart', 'star', 'bookmark', 'user', 'envelope', 'comment', 'bell', 'clock',
    'calendar', 'file', 'folder', 'image', 'copy', 'save', 'edit', 'trash',
    'eye', 'eye-slash', 'thumbs-up', 'thumbs-down', 'circle', 'square'
  ],
  
  // Sharp Light (Pro)
  sharpLight: [
    'home', 'user', 'search', 'heart', 'star', 'settings', 'menu', 'close',
    'plus', 'minus', 'check', 'times', 'envelope', 'phone', 'calendar', 'clock',
    'file', 'folder', 'image', 'video', 'music', 'camera'
  ]
};

// Create a comprehensive flat list of all icons with their styles
function getAllIcons() {
  const allIcons = [];
  
  // Add all icons with their respective styles
  Object.keys(FONTAWESOME_ICONS).forEach(style => {
    FONTAWESOME_ICONS[style].forEach(icon => {
      allIcons.push({
        name: icon,
        style: style,
        className: getStyleClass(style)
      });
    });
  });
  
  return allIcons;
}

// Get the appropriate CSS class for each style
function getStyleClass(style) {
  const styleMap = {
    'solid': 'fa-solid',
    'regular': 'fa-regular', 
    'light': 'fa-light',
    'duotone': 'fa-duotone',
    'brands': 'fa-brands',
    'sharpSolid': 'fa-sharp fa-solid',
    'sharpRegular': 'fa-sharp fa-regular',
    'sharpLight': 'fa-sharp fa-light'
  };
  
  return styleMap[style] || 'fa-solid';
}

// Get icons by style
function getIconsByStyle(style) {
  if (style === 'all') {
    return getAllIcons();
  }
  
  const icons = FONTAWESOME_ICONS[style] || [];
  return icons.map(icon => ({
    name: icon,
    style: style,
    className: getStyleClass(style)
  }));
}

// Search icons by name
function searchIcons(searchTerm, style = 'all') {
  const icons = style === 'all' ? getAllIcons() : getIconsByStyle(style);
  
  if (!searchTerm) return icons;
  
  const term = searchTerm.toLowerCase();
  return icons.filter(icon => 
    icon.name.toLowerCase().includes(term) ||
    icon.style.toLowerCase().includes(term)
  );
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    FONTAWESOME_ICONS,
    getAllIcons,
    getIconsByStyle,
    searchIcons,
    getStyleClass
  };
}