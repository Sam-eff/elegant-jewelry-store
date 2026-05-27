import { create } from 'zustand';
import axiosInstance from '../services/axiosInstance';
import { toast } from 'react-toastify';

export const useCartStore = create((set, get) => ({
    cart: [],
    loading: false,
    error: null,

    fetchCart: async (navigate) => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.get('cart/');
            set({ cart: res.data.items, loading: false });
        } catch (err) {
            if (err.response && err.response.status === 401 && navigate) {
                toast.error('Please log in to view cart.');
                navigate('/login');
            } else {
                set({ error: 'Failed to fetch cart.', loading: false });
            }
        }
    },

    addToCart: async (productId, quantity = 1, navigate) => {
        set({ loading: true, error: null });
        try {
            await axiosInstance.post('cart/add/', {
                product_id: productId,
                quantity: quantity,
            });
            await get().fetchCart();
            toast.success('Added to cart!');
        } catch (err) {
            if (err.response && err.response.status === 401 && navigate) {
                toast.error('Please log in to add items to cart.');
                navigate('/login');
            } else {
                set({ error: 'Failed to add to cart.', loading: false });
            }
        }
    },

    updateCartItem: async (itemId, newQuantity) => {
        set({ loading: true, error: null });
        try {
            await axiosInstance.post(`cart/update/${itemId}/`, {
                quantity: newQuantity
            });
            await get().fetchCart();
        } catch (err) {
            set({ error: 'Failed to update cart item.', loading: false });
        }
    },

    removeFromCart: async (itemId) => {
        set({ loading: true, error: null });
        try {
            await axiosInstance.delete(`cart/remove/${itemId}/`);
            await get().fetchCart();
        } catch (err) {
            set({ error: 'Failed to remove item.', loading: false });
        }
    },

    clearCart: async () => {
        set({ loading: true, error: null });
        try {
            await axiosInstance.delete(`cart/clear/`);
            set({ cart: [], loading: false });
        } catch (err) {
            set({ error: 'Failed to clear cart.', loading: false });
        }
    }
}));
