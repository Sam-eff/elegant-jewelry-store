import { create } from 'zustand';
import axios from 'axios';

export const useAuthStore = create((set) => ({
    user: null,
    isLoggedIn: false,
    loading: false,
    error: null,

    // ✅ Initialize and validate token (call this on app load)
    fetchUser: async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            set({ user: null, isLoggedIn: false });
            return;
        }
        set({ loading: true, error: null });
        try {
            const response = await axios.get('http://localhost:8000/api/me/', {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            set({
                user: response.data,
                isLoggedIn: true,
                loading: false
            });
            localStorage.setItem('user', JSON.stringify(response.data));  // optional
        } catch (err) {
            console.error("Failed to fetch user or token expired", err);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            set({
                user: null,
                isLoggedIn: false,
                loading: false,
                error: 'Session expired',
            });
        }
    },

    // ✅ Login manually (optional helper)
    login: (userData) => {
        set({
            user: userData,
            isLoggedIn: true
        });
        localStorage.setItem('user', JSON.stringify(userData));
    },

    // ✅ Logout globally
    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        set({
            user: null,
            isLoggedIn: false
        });
    }
}));
