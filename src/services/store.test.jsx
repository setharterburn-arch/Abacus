import { describe, it, expect, vi, beforeEach } from 'vitest';
import { reducer, initialState } from './store';

describe('Store Reducer', () => {
    beforeEach(() => {
        // Mock localStorage
        const store = {};
        vi.stubGlobal('localStorage', {
            getItem: vi.fn((key) => store[key] || null),
            setItem: vi.fn((key, value) => {
                store[key] = value.toString();
            }),
            removeItem: vi.fn((key) => {
                delete store[key];
            }),
            clear: vi.fn(() => {
                for (const key in store) delete store[key];
            }),
        });

        // Mock import.meta.env
        vi.stubGlobal('import', { meta: { env: { VITE_GEMINI_API_KEY: 'test-key' } } });
    });

    it('should toggle theme from light to dark', () => {
        const state = { ...initialState, theme: 'light' };
        const action = { type: 'TOGGLE_THEME' };
        const newState = reducer(state, action);
        expect(newState.theme).toBe('dark');
        expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    it('should toggle theme from dark to light', () => {
        const state = { ...initialState, theme: 'dark' };
        const action = { type: 'TOGGLE_THEME' };
        const newState = reducer(state, action);
        expect(newState.theme).toBe('light');
        expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    });
});
