import axios from './axiosInstance';

const API = 'wishlist/';

export const getWishlist = async () => {
  const response = await axios.get(API);
  return response.data;
};

export const addToWishlist = async (productId) => {
  const response = await axios.post(API, { product: productId });
  return response.data;
};

export const removeFromWishlist = async (wishlistItemId) => {
  const response = await axios.delete(`${API}${wishlistItemId}/`);
  return response.data;
};
