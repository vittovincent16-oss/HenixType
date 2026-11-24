import React, { useEffect, useState } from 'react';
import { resetToDefaults } from '../utils/settingsStorage';
import '../styles/settings.css';

const THEME_LABELS = {
  light: 'Light mode',
  monochrome: 'Monochrome (White & Black)',
};

function SideWaves() {
  return (
    <>
      {['left', 'right'].map((side) => (
        <div key={side} className={`set-side-rail set-side-rail--${side}`} aria-hidden="true">
          <svg className="set-rail-contours" viewBox="0 0 160 900" preserveAspectRatio="none">
            <path className="set-contour" d="M24 0 Q56 112 24 225 T24 450 T24 675 T24 900" />
            <path className="set-contour set-contour--2" d="M64 0 Q96 112 64 225 T64 450 T64 675 T64 900" />
            <path className="set-contour set-contour--3" d="M104 0 Q136 112 104 225 T104 450 T104 675 T104 900" />
          </svg>
          {[1, 2, 3, 4, 5].map((n) => (
            <svg key={n} className={`set-mini-wave set-mini-wave--${n}`} viewBox="0 0 26 12">
              <path d="M0 6 q3.25 -8 6.5 0 t6.5 0 t6.5 0 t6.5 0" />
            </svg>
          ))}
        </div>
      ))}
    </>
  );
}

export default function Settings({ settings, updateSettings }) {
  const [themeNotice, setThemeNotice] = useState(null);

  // Paints the whole viewport pitch-black to match Home, Dashboard, and Statistics
  useEffect(() => {
    document.documentElement.classList.add('set-on');
    return () => document.documentElement.classList.remove('set-on');
  }, []);

  const handleChange = (key, value) => {
    updateSettings({ ...settings, [key]: value });
  };

  const handleThemeChange = (value) => {
    if (value !== 'dark') {
      setThemeNotice({
        key: Date.now(),
        label: THEME_LABELS[value] || 'This theme',
      });
      if (settings.theme !== 'dark') {
        updateSettings({ ...settings, theme: 'dark' });
      }
      return;
    }

    setThemeNotice(null);
    handleChange('theme', 'dark');
  };

  const handleReset = () => {
    if (window.confirm('Restore default settings? This will not delete your typing statistics.')) {
      setThemeNotice(null);
      updateSettings(resetToDefaults());
    }
  };

  return (
    <div className="settings-page">
      <SideWaves />

      <header className="set-head">
        <div>
          <h2 className="settings-header">SETTINGS</h2>
          <p className="set-sub">Customize your appearance and typing test behavior.</p>
        </div>
      </header>

      <div className="settings-section" style={{ '--i': 0 }}>
        <h3>APPEARANCE</h3>

        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-name">Theme</span>
            <span className="setting-desc">Choose your preferred visual style.</span>
          </div>
          <div className="setting-control">
            <div className="set-select-wrap">
              <select
                value="dark"
                onChange={(e) => handleThemeChange(e.target.value)}
                aria-label="Select Theme"
              >
                <option value="dark">Dark (Default)</option>
                <option value="light">Light</option>
                <option value="monochrome">Monochrome (White & Black)</option>
              </select>
              <svg className="set-select-arrow" viewBox="0 0 12 12" aria-hidden="true">
                <path d="M2 4l4 4 4-4" />
              </svg>
            </div>
          </div>
        </div>

        {themeNotice && (
          <div key={themeNotice.key} className="set-theme-notice" role="status" aria-live="polite">
            <span className="set-theme-notice-text">
              <svg className="set-theme-notice-wave" viewBox="0 0 26 12" aria-hidden="true">
                <path d="M0 6 q3.25 -8 6.5 0 t6.5 0 t6.5 0 t6.5 0" />
              </svg>
              <span>
                <strong>{themeNotice.label}</strong> isn&apos;t available right now. Dark (Default) remains active.
              </span>
            </span>
            <button
              type="button"
              className="set-notice-close"
              onClick={() => setThemeNotice(null)}
              aria-label="Dismiss theme notice"
            >
              ×
            </button>
          </div>
        )}

        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-name">Reduced Motion</span>
            <span className="setting-desc">Disable animations and transitions.</span>
          </div>
          <div className="setting-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => handleChange('reducedMotion', e.target.checked)}
                aria-label="Toggle Reduced Motion"
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="settings-section" style={{ '--i': 1 }}>
        <h3>TYPING BEHAVIOR</h3>

        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-name">Show Caret</span>
            <span className="setting-desc">Display the blinking cursor while typing.</span>
          </div>
          <div className="setting-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.showCaret}
                onChange={(e) => handleChange('showCaret', e.target.checked)}
                aria-label="Toggle Caret Visibility"
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-name">Auto Focus</span>
            <span className="setting-desc">Automatically focus the typing area when a test begins.</span>
          </div>
          <div className="setting-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.autoFocus}
                onChange={(e) => handleChange('autoFocus', e.target.checked)}
                aria-label="Toggle Auto Focus"
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="set-actions">
        <button type="button" className="set-reset-btn" onClick={handleReset}>
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}