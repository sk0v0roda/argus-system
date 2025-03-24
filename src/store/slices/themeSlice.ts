import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
    isDarkTheme: boolean;
}

const isDarkTheme = localStorage.getItem('theme') === 'dark';
// Применяем тему к DOM при инициализации
document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');

const initialState: ThemeState = {
    isDarkTheme,
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<boolean>) => {
            state.isDarkTheme = action.payload;
            localStorage.setItem('theme', action.payload ? 'dark' : 'light');
            document.documentElement.setAttribute(
                'data-theme',
                action.payload ? 'dark' : 'light'
            );
        },
    },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer; 