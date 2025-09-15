import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';

export const useCartStore = create((set, get) => ({
    cart: [],
    loading: false,
    error: null,

    fetchCart: async (navigate) => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('accessToken');
            const res = await axios.get('http://localhost:8000/api/cart/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ cart: res.data.items, loading: false });
        } catch (err) {
            if (err.response && err.response.status === 401 && navigate) {
                toast.error('Please log in to view cart.')
                navigate('/login');
            }
            else {
                set({ error: 'Failed to fetch cart.', loading: false });
            }
        }
    },

    addToCart: async (productId, quantity = 1, navigate) => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('accessToken');
            await axios.post('http://localhost:8000/api/cart/add/', {
                product_id: productId,
                quantity: quantity,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await get().fetchCart();
        } catch (err) {
            if (err.response && err.response.status === 401 && navigate) {
                toast.error('Please log in to add items to cart.')
                navigate('/login');
            } else {
                set({ error: 'Failed to add to cart.', loading: false });
            }
        }
    },
    

    updateCartItem: async (itemId, newQuantity) => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('accessToken');
            await axios.post(`http://localhost:8000/api/cart/update/${itemId}/`, {
                quantity: newQuantity
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await get().fetchCart();
        } catch (err) {
            set({ error: 'Failed to update cart item.', loading: false });
        }
    },
    
    

    removeFromCart: async (itemId) => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('accessToken');
            await axios.delete(`http://localhost:8000/api/cart/remove/${itemId}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await get().fetchCart();  // ✅ this works now
        } catch (err) {
            set({ error: 'Failed to remove item.', loading: false });
        }
    },

    clearCart: async () => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('accessToken');
            await axios.delete(`http://localhost:8000/api/cart/clear/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ cart: [], loading: false });
        } catch (err) {
            set({ error: 'Failed to clear cart.', loading: false });
        }
    }
}));
