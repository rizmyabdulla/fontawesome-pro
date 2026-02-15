const STYLE_OPTIONS = {
  solid: { label: "Solid", className: "fa-solid", cssFile: null },
  regular: { label: "Regular", className: "fa-regular", cssFile: null },
  light: { label: "Light", className: "fa-light", cssFile: null },
  sharp: { label: "Sharp", className: "fa-sharp fa-solid", cssFile: "sharp-solid.css" },
  duotone: { label: "Duotone", className: "fa-duotone", cssFile: "duotone.css" },
  chisel: { label: "Chisel", className: "fa-chisel fa-regular", cssFile: "chisel-regular.css" },
  etch: { label: "Etch", className: "fa-etch fa-solid", cssFile: "etch-solid.css" },
  jelly: { label: "Jelly", className: "fa-jelly fa-regular", cssFile: "jelly-regular.css" },
  notdog: { label: "Notdog", className: "fa-notdog fa-solid", cssFile: "notdog-solid.css" },
  slab: { label: "Slab", className: "fa-slab fa-regular", cssFile: "slab-regular.css" },
  thumbprint: { label: "Thumbprint", className: "fa-thumbprint fa-light", cssFile: "thumbprint-light.css" },
  whiteboard: { label: "Whiteboard", className: "fa-whiteboard fa-semibold", cssFile: "whiteboard-semibold.css" },
  utility: { label: "Utility", className: "fa-utility fa-semibold", cssFile: "utility-semibold.css" },
  graphite: { label: "Graphite", className: "fa-graphite fa-thin", cssFile: "graphite-thin.css" },
  brands: { label: "Brands", className: "fa-brands", cssFile: null }
};

const STYLE_ORDER = [
  "solid",
  "regular",
  "light",
  "sharp",
  "duotone",
  "chisel",
  "etch",
  "jelly",
  "notdog",
  "slab",
  "thumbprint",
  "whiteboard",
  "utility",
  "graphite",
  "brands"
];

const VERSION_CONFIG = {
  "7.0.0": {
    dataVersionKey: "7.0.0",
    cssBaseUrl: "https://site-assets.fontawesome.com/releases/v7.0.0/css/",
    availableStyles: ["solid", "regular", "light", "sharp", "duotone", "chisel", "etch", "jelly", "notdog", "slab", "thumbprint", "whiteboard", "brands"]
  },
  "7.1.0": {
    dataVersionKey: "7.1.0",
    cssBaseUrl: "https://site-assets.fontawesome.com/releases/v7.1.0/css/",
    availableStyles: ["solid", "regular", "light", "sharp", "duotone", "chisel", "etch", "jelly", "notdog", "slab", "thumbprint", "whiteboard", "utility", "brands"]
  },
  "7.2.0": {
    dataVersionKey: "7.2.0",
    cssBaseUrl: "https://site-assets.fontawesome.com/releases/v7.2.0/css/",
    availableStyles: ["solid", "regular", "light", "sharp", "duotone", "chisel", "etch", "jelly", "notdog", "slab", "thumbprint", "whiteboard", "utility", "graphite", "brands"]
  },
  "6.7.2": {
    dataVersionKey: "6.7.2",
    cssBaseUrl: "https://site-assets.fontawesome.com/releases/v6.7.2/css/",
    availableStyles: ["solid", "regular", "light", "sharp", "duotone", "brands"]
  },
  "6.5.1": {
    dataVersionKey: "v6.5.1",
    cssBaseUrl: "https://site-assets.fontawesome.com/releases/v6.5.1/css/",
    availableStyles: ["solid", "regular", "light", "sharp", "duotone", "brands"]
  },
  "5.15.4": {
    dataVersionKey: "5.15.4",
    cssBaseUrl: "https://site-assets.fontawesome.com/releases/v5.15.4/css/",
    availableStyles: ["solid", "regular", "light", "duotone", "brands"]
  },
  "brands": {
    dataVersionKey: "brands",
    cssBaseUrl: "https://site-assets.fontawesome.com/releases/v7.2.0/css/",
    availableStyles: ["brands"]
  }
};
const VERSION_ORDER = ["7.2.0", "7.1.0", "7.0.0", "6.7.2", "6.5.1", "5.15.4"];

const FILTER_MODE = {
  all: "all",
  favorites: "favorites",
  nonFavorites: "nonFavorites"
};

const FAVORITES_KEY = "fa-favorites";
const MAX_RENDER = 1200;
const MAX_CONTRIBUTORS = 10;
const DYNAMIC_STYLE_ATTR = "data-fa-style";
const ICON_DATA_URLS = ["data/fontawesome-icons.json", "data/fontawesome-icons"];

const grid = document.getElementById("iconGrid");
const searchInput = document.getElementById("search");
const versionSelect = document.getElementById("versionSelect");
const faBaseCss = document.getElementById("faBaseCss");
const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
const favoritesOnlyBtn = document.getElementById("favoritesOnlyBtn");

const brandIcon = document.getElementById("brandIcon");
const repoIcon = document.getElementById("repoIcon");
const oldVerIcon = document.getElementById("oldVerIcon");

const iconModal = document.getElementById("iconModal");
const modalClose = document.getElementById("modalClose");
const modalPreview = document.getElementById("modalPreview");
const modalTitle = document.getElementById("modalTitle");
const iconColorInput = document.getElementById("iconColor");
const iconSecondaryColorInput = document.getElementById("iconSecondaryColor");
const primaryColorLabel = document.getElementById("primaryColorLabel");
const secondaryColorField = document.getElementById("secondaryColorField");
const iconSizeInput = document.getElementById("iconSize");
const iconSizeValue = document.getElementById("iconSizeValue");
const iconStyleSelect = document.getElementById("iconStyle");
const iconRotationSelect = document.getElementById("iconRotation");
const iconAnimationSelect = document.getElementById("iconAnimation");
const favoriteButton = document.getElementById("favoriteButton");
const copyCodeButton = document.getElementById("copyCode");
const htmlCode = document.getElementById("htmlCode");
const reactCode = document.getElementById("reactCode");
const codeTabs = Array.from(document.querySelectorAll(".code-tab"));
const codePanes = { html: htmlCode, react: reactCode };

const repoLink = document.querySelector('.sidebar-link[href*="github.com"]') || document.getElementById("repoLink");
const contributorsLink = document.getElementById("contributorsLink");
const contributorsList = document.getElementById("contributorsList");
const contributorsMeta = document.getElementById("contributorsMeta");

const iconCache = new Map();
let iconDataByVersionCache = null;
const favorites = new Set(loadFavorites());

let allIcons = [];
let currentVersion = VERSION_CONFIG[versionSelect.value] ? versionSelect.value : "7.2.0";
let currentFilterMode = FILTER_MODE.all;
let currentIconName = "";
let currentStyle = "solid";
let activeCodeTab = "html";
let showOnlyFavorites = false;

function readFavoriteArray(rawValue) {
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .map(item => (typeof item === "number" ? String(item) : item))
      .filter(item => typeof item === "string" && item.length > 0);
  } catch (error) {
    return [];
  }
}

function loadFavorites() {
  const favoritesFromOldSite = readFavoriteArray(localStorage.getItem(FAVORITES_KEY));
  const merged = Array.from(new Set([...favoritesFromOldSite]));

  return merged;
}

function syncFavoritesFromStorage() {
  const latestFavorites = new Set(loadFavorites());
  let changed = false;

  if (latestFavorites.size !== favorites.size) {
    changed = true;
  } else {
    for (const iconName of latestFavorites) {
      if (!favorites.has(iconName)) {
        changed = true;
        break;
      }
    }
  }

  if (!changed) {
    return false;
  }

  favorites.clear();
  latestFavorites.forEach(iconName => favorites.add(iconName));
  return true;
}

function setGridMessage(message, isError) {
  grid.innerHTML = "";
  const card = document.createElement("div");
  card.className = "status-message";
  if (isError) {
    card.classList.add("error");
  }
  card.innerHTML = message;
  grid.appendChild(card);
}

function normalizeIcons(iconNames) {
  const unique = new Set();
  iconNames.forEach(name => {
    if (typeof name === "string" && name.length > 0) {
      unique.add(name);
    }
  });
  return Array.from(unique).sort((a, b) => a.localeCompare(b));
}

async function fetchIconsForVersion(versionKey) {
  if (iconCache.has(versionKey)) {
    return iconCache.get(versionKey);
  }

  const config = VERSION_CONFIG[versionKey];
  if (!config) {
    throw new Error("Unknown version selected.");
  }

  const iconsByVersion = await fetchIconsByVersionData();
  const normalized = buildVersionIconSet(versionKey, iconsByVersion);
  iconCache.set(versionKey, normalized);
  return normalized;
}

function resolveDataVersionKey(versionKey, iconsByVersion) {
  if (iconsByVersion[versionKey]) {
    return versionKey;
  }

  const withV = `v${versionKey}`;
  if (iconsByVersion[withV]) {
    return withV;
  }

  if (versionKey.startsWith("v")) {
    const withoutV = versionKey.slice(1);
    if (iconsByVersion[withoutV]) {
      return withoutV;
    }
  }

  return null;
}

function getIconsFromDataKey(iconsByVersion, versionKey, required = true) {
  const resolvedKey = resolveDataVersionKey(versionKey, iconsByVersion);
  if (!resolvedKey) {
    if (required) {
      throw new Error(`No icon data found for version ${versionKey}.`);
    }
    return [];
  }
  return iconsByVersion[resolvedKey];
}

function buildVersionIconSet(versionKey, iconsByVersion) {
  if (versionKey === "brands") {
    return normalizeIcons(getIconsFromDataKey(iconsByVersion, "brands"));
  }

  const startIndex = VERSION_ORDER.indexOf(versionKey);
  if (startIndex === -1) {
    throw new Error(`Unsupported version ${versionKey}.`);
  }

  const brandIcons = new Set(getIconsFromDataKey(iconsByVersion, "brands", false));
  const merged = new Set();

  for (let index = startIndex; index < VERSION_ORDER.length; index += 1) {
    const chainVersion = VERSION_ORDER[index];
    const chainConfig = VERSION_CONFIG[chainVersion];
    const dataVersionKey = chainConfig && chainConfig.dataVersionKey ? chainConfig.dataVersionKey : chainVersion;
    const icons = getIconsFromDataKey(iconsByVersion, dataVersionKey, index === startIndex);

    icons.forEach(iconName => {
      if (!brandIcons.has(iconName)) {
        merged.add(iconName);
      }
    });
  }

  return Array.from(merged).sort((a, b) => a.localeCompare(b));
}

function normalizeIconMap(json) {
  if (!json || typeof json !== "object" || Array.isArray(json)) {
    throw new Error("Icon data must be an object keyed by version.");
  }

  const normalizedMap = {};
  Object.keys(json).forEach(versionKey => {
    const icons = json[versionKey];
    if (Array.isArray(icons)) {
      normalizedMap[versionKey] = normalizeIcons(icons);
    }
  });
  return normalizedMap;
}

async function fetchIconsByVersionData() {
  if (iconDataByVersionCache) {
    return iconDataByVersionCache;
  }

  let lastError = null;
  for (const url of ICON_DATA_URLS) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`${url} (${response.status})`);
      }

      const json = await response.json();
      const normalized = normalizeIconMap(json);
      iconDataByVersionCache = normalized;
      return iconDataByVersionCache;
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(`Could not load icon data. ${lastError ? lastError.message : ""}`.trim());
}

function clearDynamicStyles() {
  document.querySelectorAll(`link[${DYNAMIC_STYLE_ATTR}="1"]`).forEach(link => link.remove());
}

function appendDynamicStyle(href) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.setAttribute(DYNAMIC_STYLE_ATTR, "1");
  document.head.appendChild(link);
}

function updateVersionStyles(versionKey) {
  const config = VERSION_CONFIG[versionKey];
  if (!config || !faBaseCss) {
    return;
  }

  faBaseCss.href = `${config.cssBaseUrl}all.css`;
  clearDynamicStyles();

  const cssFiles = new Set();
  config.availableStyles.forEach(styleKey => {
    const style = STYLE_OPTIONS[styleKey];
    if (style && style.cssFile) {
      cssFiles.add(style.cssFile);
    }
  });

  cssFiles.forEach(file => appendDynamicStyle(`${config.cssBaseUrl}${file}`));
}

function getAvailableStyles(versionKey) {
  const config = VERSION_CONFIG[versionKey];
  if (!config) {
    return [];
  }
  const available = new Set(config.availableStyles);
  return STYLE_ORDER.filter(key => available.has(key));
}

function getDefaultGridStyle(versionKey) {
  const available = getAvailableStyles(versionKey);
  return available.includes("solid") ? "solid" : available[0];
}

function getStyleClass(styleKey) {
  return STYLE_OPTIONS[styleKey] ? STYLE_OPTIONS[styleKey].className : STYLE_OPTIONS.solid.className;
}

function isDuotoneStyle(styleKey) {
  return styleKey === "duotone";
}

function buildIconClass(iconName, styleKey, rotationClass, animationClass) {
  const classes = [getStyleClass(styleKey), `fa-${iconName}`];
  if (rotationClass) {
    classes.push(rotationClass);
  }
  if (animationClass) {
    classes.push(animationClass);
  }
  return classes.join(" ");
}

function updateStaticIcons() {
  if (brandIcon) {
    brandIcon.className = "fa-solid fa-star";
  }
  if (repoIcon) {
    repoIcon.className = "fa-brands fa-github";
  }
  if (oldVerIcon) {
    oldVerIcon.className = "fa-solid fa-clock-rotate-left";
  }
}

function updateStyleSelectOptions() {
  const available = getAvailableStyles(currentVersion);
  iconStyleSelect.innerHTML = "";

  available.forEach(styleKey => {
    const option = document.createElement("option");
    option.value = styleKey;
    option.textContent = STYLE_OPTIONS[styleKey].label;
    iconStyleSelect.appendChild(option);
  });

  if (!available.includes(currentStyle)) {
    currentStyle = available.includes("solid") ? "solid" : available[0];
  }
  iconStyleSelect.value = currentStyle;
  syncModalControlState();
}

function syncModalControlState() {
  const selectedStyle = iconStyleSelect.value;
  const duotoneEnabled = isDuotoneStyle(selectedStyle);

  if (secondaryColorField) {
    secondaryColorField.classList.toggle("hidden", !duotoneEnabled);
  }
  if (primaryColorLabel) {
    primaryColorLabel.textContent = duotoneEnabled ? "Primary Color" : "Icon Color";
  }

  const hasAnimation = Boolean(iconAnimationSelect.value);
  if (hasAnimation && iconRotationSelect.value) {
    iconRotationSelect.value = "";
  }
  iconRotationSelect.disabled = hasAnimation;
}

function applyFilters() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  let filtered = allIcons;

  if (showOnlyFavorites) {
    filtered = filtered.filter(name => favorites.has(name));
  } else if (currentFilterMode === FILTER_MODE.favorites) {
    filtered = filtered.filter(name => favorites.has(name));
  } else if (currentFilterMode === FILTER_MODE.nonFavorites) {
    filtered = filtered.filter(name => !favorites.has(name));
  }

  if (searchTerm) {
    filtered = filtered.filter(name => name.includes(searchTerm));
  }

  return filtered;
}

function getEmptyGridMessage() {
  if (showOnlyFavorites) {
    if (favorites.size === 0) {
      return "No favorited icons yet. Click the heart on any icon to add it here.";
    }
    if (searchInput.value.trim()) {
      return "No favorited icons match your current search.";
    }
    return "No favorited icons found.";
  }
  return "No icons match the current search, you can find more at <a href='https://fontawesome.com/search' target='_blank'>Fontawesome</a>.";
}

function renderIcons() {
  const iconsToRender = applyFilters();
  const gridStyle = getDefaultGridStyle(currentVersion);
  grid.innerHTML = "";

  if (!iconsToRender.length) {
    setGridMessage(getEmptyGridMessage(), false);
    return;
  }

  const fragment = document.createDocumentFragment();
  const visibleIcons = iconsToRender.slice(0, MAX_RENDER);

  visibleIcons.forEach(iconName => {
    const card = document.createElement("div");
    card.className = "icon-card";
    if (favorites.has(iconName)) {
      card.classList.add("favorited");
    }

    const icon = document.createElement("i");
    icon.className = buildIconClass(iconName, gridStyle, "", "");

    const title = document.createElement("div");
    title.className = "icon-name";
    title.textContent = iconName;

    card.appendChild(icon);
    card.appendChild(title);
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.addEventListener("click", () => openModal(iconName));
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(iconName);
      }
    });
    fragment.appendChild(card);
  });

  grid.appendChild(fragment);

  if (iconsToRender.length > MAX_RENDER) {
    const info = document.createElement("div");
    info.className = "status-message";
    info.textContent = `Showing ${MAX_RENDER.toLocaleString()} of ${iconsToRender.length.toLocaleString()} icons. Use search to narrow results.`;
    grid.appendChild(info);
  }
}

function openModal(iconName) {
  currentIconName = iconName;
  modalTitle.textContent = iconName;
  if (!getAvailableStyles(currentVersion).includes(currentStyle)) {
    currentStyle = getDefaultGridStyle(currentVersion);
  }
  iconStyleSelect.value = currentStyle;
  updatePreviewAndCode();
  iconModal.classList.add("open");
  iconModal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  iconModal.classList.remove("open");
  iconModal.setAttribute("aria-hidden", "true");
}

function updateFavoriteButton() {
  const isFavorite = favorites.has(currentIconName);
  favoriteButton.classList.toggle("is-favorite", isFavorite);

  const iconElement = favoriteButton.querySelector("i");
  const labelElement = favoriteButton.querySelector("span");
  if (iconElement) {
    iconElement.className = isFavorite ? "fa-solid fa-heart" : "fa-regular fa-heart";
  }
  if (labelElement) {
    labelElement.textContent = isFavorite ? "Remove Favorite" : "Add Favorite";
  }
}

function updateFavoritesOnlyButton() {
  if (!favoritesOnlyBtn) {
    return;
  }

  favoritesOnlyBtn.classList.toggle("active", showOnlyFavorites);
  favoritesOnlyBtn.setAttribute("aria-pressed", showOnlyFavorites ? "true" : "false");

  const iconElement = favoritesOnlyBtn.querySelector("i");
  const labelElement = favoritesOnlyBtn.querySelector("span");
  if (iconElement) {
    iconElement.className = showOnlyFavorites ? "fa-solid fa-heart" : "fa-regular fa-heart";
  }
}

function updatePreviewAndCode() {
  if (!currentIconName) {
    return;
  }

  syncModalControlState();

  const styleKey = iconStyleSelect.value;
  const rotationClass = iconRotationSelect.disabled ? "" : iconRotationSelect.value;
  const animationClass = iconAnimationSelect.value;
  const primaryColor = iconColorInput.value;
  const secondaryColor = iconSecondaryColorInput.value;
  const duotoneEnabled = isDuotoneStyle(styleKey);
  const size = Number(iconSizeInput.value);
  const classes = buildIconClass(currentIconName, styleKey, rotationClass, animationClass);

  modalPreview.className = classes;
  modalPreview.style.removeProperty("color");
  modalPreview.style.removeProperty("--fa-primary-color");
  modalPreview.style.removeProperty("--fa-secondary-color");
  modalPreview.style.removeProperty("--fa-primary-opacity");
  modalPreview.style.removeProperty("--fa-secondary-opacity");

  if (duotoneEnabled) {
    modalPreview.style.setProperty("--fa-primary-color", primaryColor);
    modalPreview.style.setProperty("--fa-secondary-color", secondaryColor);
    modalPreview.style.setProperty("--fa-primary-opacity", "1");
    modalPreview.style.setProperty("--fa-secondary-opacity", "0.45");
    modalPreview.style.color = primaryColor;
  } else {
    modalPreview.style.color = primaryColor;
  }

  modalPreview.style.fontSize = `${size}px`;
  iconSizeValue.textContent = `${size}px`;

  const inlineStyle = duotoneEnabled
    ? `--fa-primary-color: ${primaryColor}; --fa-secondary-color: ${secondaryColor}; font-size: ${size}px;`
    : `color: ${primaryColor}; font-size: ${size}px;`;

  const reactStyle = duotoneEnabled
    ? `{{ "--fa-primary-color": "${primaryColor}", "--fa-secondary-color": "${secondaryColor}", fontSize: "${size}px" }}`
    : `{{ color: "${primaryColor}", fontSize: "${size}px" }}`;

  htmlCode.value = `<i class="${classes}" style="${inlineStyle}"></i>`;
  reactCode.value = `<i className="${classes}" style=${reactStyle} />`;

  updateFavoriteButton();
}

function persistFavorites() {
  const serialized = JSON.stringify(Array.from(favorites));
  localStorage.setItem(FAVORITES_KEY, serialized);
}

function toggleFavoriteCurrent() {
  if (!currentIconName) {
    return;
  }

  if (favorites.has(currentIconName)) {
    favorites.delete(currentIconName);
  } else {
    favorites.add(currentIconName);
  }

  persistFavorites();
  updateFavoriteButton();
  renderIcons();
}

function syncFavoritesAndRefreshUI() {
  const changed = syncFavoritesFromStorage();
  if (!changed) {
    return;
  }

  renderIcons();
  if (iconModal.classList.contains("open")) {
    updateFavoriteButton();
  }
}

function setActiveCodeTab(tab) {
  activeCodeTab = tab;
  codeTabs.forEach(button => {
    button.classList.toggle("active", button.dataset.tab === tab);
  });
  Object.keys(codePanes).forEach(key => {
    codePanes[key].classList.toggle("active", key === tab);
  });
}

async function copyActiveCode() {
  const value = activeCodeTab === "react" ? reactCode.value : htmlCode.value;
  try {
    await navigator.clipboard.writeText(value);
    const label = copyCodeButton.querySelector("span");
    if (label) {
      const original = label.textContent;
      label.textContent = "Copied";
      setTimeout(() => {
        label.textContent = original;
      }, 1200);
    }
  } catch (error) {
    if (activeCodeTab === "react") {
      reactCode.select();
      document.execCommand("copy");
      reactCode.setSelectionRange(0, 0);
    } else {
      htmlCode.select();
      document.execCommand("copy");
      htmlCode.setSelectionRange(0, 0);
    }
  }
}

function updateActiveFilterButton(clickedButton) {
  filterButtons.forEach(button => button.classList.remove("active"));
  clickedButton.classList.add("active");
}

function readFilterMode(buttonLabel) {
  const normalized = buttonLabel.trim().toLowerCase();
  if (normalized === "pro") {
    return FILTER_MODE.favorites;
  }
  if (normalized === "pro+") {
    return FILTER_MODE.nonFavorites;
  }
  return FILTER_MODE.all;
}

async function loadVersion(versionKey) {
  if (!VERSION_CONFIG[versionKey]) {
    setGridMessage(`Version ${versionKey} is not configured.`, true);
    return;
  }

  currentVersion = versionKey;
  setGridMessage(`Loading icons for ${versionKey}...`, false);
  updateVersionStyles(versionKey);
  updateStyleSelectOptions();
  updateStaticIcons();

  try {
    allIcons = await fetchIconsForVersion(versionKey);
    renderIcons();
    updatePreviewAndCode();
  } catch (error) {
    setGridMessage(`Failed to load icons for ${versionKey}. ${error.message}`, true);
  }
}

function parseGitHubRepo(urlString) {
  try {
    const url = new URL(urlString);
    if (url.hostname !== "github.com" && url.hostname !== "www.github.com") {
      return null;
    }

    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length < 2) {
      return null;
    }

    return { owner: parts[0], repo: parts[1].replace(/\.git$/, "") };
  } catch (error) {
    return null;
  }
}

function setContributorsStatus(message, isError) {
  if (!contributorsList) {
    return;
  }

  contributorsList.innerHTML = "";
  const row = document.createElement("li");
  row.className = "contributors-status";
  if (isError) {
    row.classList.add("error");
  }
  row.textContent = message;
  contributorsList.appendChild(row);
}

function formatCount(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function renderContributors(contributors, repoInfo) {
  contributorsList.innerHTML = "";
  const topContributors = contributors.slice(0, MAX_CONTRIBUTORS);

  topContributors.forEach(contributor => {
    const item = document.createElement("li");
    item.className = "contributor-item";

    const avatar = document.createElement("img");
    avatar.className = "contributor-avatar";
    avatar.src = contributor.avatar_url;
    avatar.alt = `${contributor.login} avatar`;
    avatar.loading = "lazy";
    avatar.decoding = "async";

    const body = document.createElement("div");
    body.className = "contributor-body";

    const profile = document.createElement("a");
    profile.className = "contributor-name";
    profile.href = contributor.html_url;
    profile.target = "_blank";
    profile.rel = "noopener noreferrer";
    profile.textContent = contributor.login;

    const count = document.createElement("div");
    count.className = "contributor-count";
    count.textContent = `${formatCount(contributor.contributions)} commits`;

    body.appendChild(profile);
    body.appendChild(count);
    item.appendChild(avatar);
    item.appendChild(body);
    contributorsList.appendChild(item);
  });

  if (contributorsMeta) {
    contributorsMeta.textContent = `Top ${topContributors.length} contributors to ${repoInfo.owner}/${repoInfo.repo}`;
  }
}

async function loadContributors() {
  if (!repoLink || !contributorsList) {
    return;
  }

  const repoInfo = parseGitHubRepo(repoLink.href);
  if (!repoInfo) {
    setContributorsStatus("Invalid GitHub repository link.", true);
    if (contributorsMeta) {
      contributorsMeta.textContent = "Repository not configured";
    }
    return;
  }

  if (contributorsLink) {
    contributorsLink.href = `https://github.com/${repoInfo.owner}/${repoInfo.repo}/graphs/contributors`;
  }

  setContributorsStatus("Loading contributors...", false);

  try {
    const response = await fetch(
      `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/contributors?per_page=${MAX_CONTRIBUTORS}`,
      { headers: { Accept: "application/vnd.github+json" } }
    );

    if (!response.ok) {
      throw new Error(`GitHub API ${response.status}`);
    }

    const contributors = await response.json();
    if (!Array.isArray(contributors) || contributors.length === 0) {
      setContributorsStatus("No contributors found for this repository.", false);
      if (contributorsMeta) {
        contributorsMeta.textContent = `${repoInfo.owner}/${repoInfo.repo}`;
      }
      return;
    }

    renderContributors(contributors, repoInfo);
  } catch (error) {
    setContributorsStatus("Unable to load contributors right now.", true);
    if (contributorsMeta) {
      contributorsMeta.textContent = "GitHub API unavailable";
    }
  }
}

searchInput.addEventListener("input", renderIcons);

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    showOnlyFavorites = false;
    updateFavoritesOnlyButton();
    currentFilterMode = readFilterMode(button.textContent);
    updateActiveFilterButton(button);
    renderIcons();
  });
});

if (favoritesOnlyBtn) {
  favoritesOnlyBtn.addEventListener("click", () => {
    showOnlyFavorites = !showOnlyFavorites;
    if (showOnlyFavorites && currentFilterMode === FILTER_MODE.nonFavorites) {
      currentFilterMode = FILTER_MODE.all;
      if (filterButtons[0]) {
        updateActiveFilterButton(filterButtons[0]);
      }
    }
    updateFavoritesOnlyButton();
    renderIcons();
  });
}

if (versionSelect) {
  versionSelect.addEventListener("change", event => {
    loadVersion(event.target.value);
  });
}

iconColorInput.addEventListener("input", updatePreviewAndCode);
iconSecondaryColorInput.addEventListener("input", updatePreviewAndCode);
iconSizeInput.addEventListener("input", updatePreviewAndCode);
iconStyleSelect.addEventListener("change", () => {
  currentStyle = iconStyleSelect.value;
  updatePreviewAndCode();
});
iconRotationSelect.addEventListener("change", updatePreviewAndCode);
iconAnimationSelect.addEventListener("change", updatePreviewAndCode);

favoriteButton.addEventListener("click", toggleFavoriteCurrent);
copyCodeButton.addEventListener("click", copyActiveCode);
modalClose.addEventListener("click", closeModal);

codeTabs.forEach(button => {
  button.addEventListener("click", () => setActiveCodeTab(button.dataset.tab));
});

iconModal.addEventListener("click", event => {
  if (event.target === iconModal) {
    closeModal();
  }
});

window.addEventListener("keydown", event => {
  if (event.key === "Escape" && iconModal.classList.contains("open")) {
    closeModal();
  }
});

window.addEventListener("storage", event => {
  if (event.key === FAVORITES_KEY) {
    syncFavoritesAndRefreshUI();
  }
});

window.addEventListener("focus", syncFavoritesAndRefreshUI);

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    syncFavoritesAndRefreshUI();
  }
});

versionSelect.value = currentVersion;
setActiveCodeTab("html");
updateStaticIcons();
updateStyleSelectOptions();
updateFavoritesOnlyButton();
loadVersion(currentVersion);
loadContributors();
