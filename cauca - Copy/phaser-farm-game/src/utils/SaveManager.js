// src/utils/SaveManager.js
// Lưu / tải game state từ localStorage

import { stateManager } from './StateManager.js';

export const SaveManager = {
    SAVE_KEY: 'farmValley_save_v1',

    save(farmGridData = {}) {
        const data = {
            ...stateManager.serialize(),
            farmGrid: farmGridData,
            savedAt: Date.now()
        };
        try {
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
            console.log('[Save] Game saved ✓', data);
            return true;
        } catch (e) {
            console.error('[Save] Failed to save:', e);
            return false;
        }
    },

    load() {
        try {
            const raw = localStorage.getItem(this.SAVE_KEY);
            if (!raw) return null;
            const data = JSON.parse(raw);
            console.log('[Save] Save data loaded:', data);
            return data;
        } catch (e) {
            console.error('[Save] Failed to load:', e);
            return null;
        }
    },

    clear() {
        localStorage.removeItem(this.SAVE_KEY);
        console.log('[Save] Save cleared.');
    },

    hasSave() {
        return !!localStorage.getItem(this.SAVE_KEY);
    }
};
