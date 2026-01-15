import React, { createContext, useContext, useReducer, useEffect } from 'react';

const StoreContext = createContext();

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null, // { name, age, grade }
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || null,
    homework: [],
    grades: JSON.parse(localStorage.getItem('grades')) || [],
    settings: JSON.parse(localStorage.getItem('settings')) || { questionCount: 5, difficulty: 'Medium' },
    theme: 'light'
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_USER':
            localStorage.setItem('user', JSON.stringify(action.payload));
            return { ...state, user: action.payload };
        // case 'SET_API_KEY': removed for security
        case 'SET_HOMEWORK':
            return { ...state, homework: action.payload };
        case 'ADD_GRADE':
            const newGrades = [...state.grades, action.payload];
            localStorage.setItem('grades', JSON.stringify(newGrades));
            return { ...state, grades: newGrades };
        case 'SET_SETTINGS':
            localStorage.setItem('settings', JSON.stringify(action.payload));
            return { ...state, settings: action.payload };
        case 'LOGOUT':
            localStorage.removeItem('user');
            return { ...state, user: null };
        default:
            return state;
    }
};

export const StoreProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <StoreContext.Provider value={{ state, dispatch }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => useContext(StoreContext);
