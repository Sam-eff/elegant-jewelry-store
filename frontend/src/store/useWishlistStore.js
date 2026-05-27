import { create } from 'zustand';
import axiosInstance from '../services/axiosInstance';
import { toast } from 'react-toastify';

export const useWishlistStore = create((set, get) => ({
    wishlist: [],
    loading: false,
    error: null,

    fetchWishlist: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.get('wishlist/');
            set({ wishlist: response.data });
        } catch (err) {
            console.error(err);
            set({ error: 'Failed to load wishlist' });
        } finally {
            set({ loading: false });
        }
    },

    addToWishlist: async (productId, navigate = null) => {
        set({ loading: true, error: null });
        try {
            await axiosInstance.post('wishlist/', { product_id: productId });
            await get().fetchWishlist();
            toast.success('Added to wishlist!');
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 401 && navigate) {
                toast.error('Please log in to add items to your wishlist.');
                navigate('/login');
            } else {
                set({ error: 'Failed to add to wishlist' });
            }
        } finally {
            set({ loading: false });
        }
    },

    removeFromWishlist: async (itemId) => {
        try {
            await axiosInstance.delete(`wishlist/${itemId}/`);
            await get().fetchWishlist();
            toast.success('Removed from wishlist');
        } catch (err) {
            console.error(err);
            set({ error: 'Error removing from wishlist.' });
        }
    }
}));
