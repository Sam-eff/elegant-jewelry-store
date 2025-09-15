
import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';

export const useWishlistStore = create((set, get) => ({
    wishlist: [],
    loading: false,
    error: null,

    fetchWishlist: async () => {
        set({ loading: true, error: null });
        const accessToken = localStorage.getItem('accessToken');
        try {
            const response = await axios.get('http://localhost:8000/api/wishlist/', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
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
        const accessToken = localStorage.getItem('accessToken');
        try {
            const response = await axios.post(
                'http://localhost:8000/api/wishlist/',
                { product_id: productId },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            // Refresh full wishlist after adding
            await get().fetchWishlist();
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
            await axios.delete(`http://localhost:8000/api/wishlist/${itemId}/`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
              });
          await get().fetchWishlist();
        } catch (err) {
          console.error(err);
          set({ error: 'Error removing from wishlist.' });
        }
      },
      
    
}));

