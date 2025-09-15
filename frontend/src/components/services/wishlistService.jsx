// src/services/wishlistService.js
import axios from './axiosInstance';



const API = 'http://localhost:8000/api/wishlist/';

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getWishlist = async () => {
  const response = await axios.get(API, getAuthHeaders());
  return response.data;
};

export const addToWishlist = async (productId) => {
  const response = await axios.post(API, { product: productId }, getAuthHeaders());
  return response.data;
};

export const removeFromWishlist = async (wishlistItemId) => {
  const response = await axios.delete(`${API}${wishlistItemId}/`, getAuthHeaders());
  return response.data;
};

