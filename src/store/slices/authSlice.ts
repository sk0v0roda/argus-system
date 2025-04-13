import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    isAuthenticated: boolean;
    email: string | null;
    token: string | null;
}

const initialState: AuthState = {
    isAuthenticated: !!localStorage.getItem('token'),
    email: localStorage.getItem('email'),
    token: localStorage.getItem('token'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ email: string; token: string }>) => {
            state.isAuthenticated = true;
            state.email = action.payload.email;
            state.token = action.payload.token;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('email', action.payload.email);
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.email = null;
            state.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('email');
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer; 