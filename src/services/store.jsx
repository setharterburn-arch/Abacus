import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase } from './supabase';

const StoreContext = createContext();

export const initialState = {
    session: null,
    profile: null, // { role, first_name, last_name, ... }
    loading: true,
    user: null, // legacy support until full refactor
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || null,
    homework: [],
    grades: [],
    settings: JSON.parse(localStorage.getItem('settings')) || { questionCount: 5, difficulty: 'Medium' },
    theme: localStorage.getItem('theme') || 'light'
};

export const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_SESSION':
            return {
                ...state,
                session: action.payload.session,
                profile: action.payload.profile,
                user: action.payload.profile ? {
                    ...action.payload.profile,
                    name: action.payload.profile.first_name, // Map first_name to name
                    grade: action.payload.profile.grade_level // Map grade_level to grade
                } : null,
                loading: false
            };
        case 'SET_API_KEY':
            return { ...state, apiKey: action.payload };
        case 'SET_HOMEWORK':
            return { ...state, homework: action.payload };
        case 'ADD_GRADE':
            // TODO: persist to database
            const newGrades = [...state.grades, action.payload];
            return { ...state, grades: newGrades };
        case 'SET_SETTINGS':
            localStorage.setItem('settings', JSON.stringify(action.payload));
            return { ...state, settings: action.payload };
        case 'LOGOUT':
            // Clear session from Supabase
            supabase.auth.signOut();
            // Clear any cached data
            localStorage.removeItem('abacus_gamification');
            return { ...state, session: null, profile: null, user: null };
        case 'TOGGLE_THEME':
            const newTheme = state.theme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            return { ...state, theme: newTheme };
        default:
            return state;
    }
};

export const StoreProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            fetchProfile(session, dispatch);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            fetchProfile(session, dispatch);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Helper to fetch additional profile data
    const fetchProfile = async (session, dispatch) => {
        if (!session) {
            dispatch({ type: 'SET_SESSION', payload: { session: null, profile: null } });
            return;
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

        // If no profile exists yet (new sign up), we might pass partial data
        // But ideally we create profile on sign up.
        console.log("Fetched Profile:", profile);
        dispatch({ type: 'SET_SESSION', payload: { session, profile } });
    };

    return (
        <StoreContext.Provider value={{ state, dispatch }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => useContext(StoreContext);
