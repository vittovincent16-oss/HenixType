const SETTINGS_KEY = 'henixTypeSettings';

export const defaultSettings = {
  theme: 'dark', 
  showCaret: true,
  autoFocus: true,
  reducedMotion: false
};

export const getSettings = () => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(data) };
  } catch (error) {
    console.error("Henix Type: Failed to parse settings.", error);
    return defaultSettings;
  }
};

export const saveSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Henix Type: Failed to save settings.", error);
  }
};

export const resetToDefaults = () => {
  try {
    localStorage.removeItem(SETTINGS_KEY);
    return defaultSettings;
  } catch (error) {
    return defaultSettings;
  }
};