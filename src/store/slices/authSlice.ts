import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    isAuthenticated: boolean;
    username: string | null;
}

const initialState: AuthState = {
    isAuthenticated: !!localStorage.getItem('authToken'),
    username: localStorage.getItem('username'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<string>) => {
            state.isAuthenticated = true;
            state.username = action.payload;
            localStorage.setItem('authToken', 'example_token');
            localStorage.setItem('username', action.payload);
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.username = null;
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer; 