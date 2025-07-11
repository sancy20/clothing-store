import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../services/wishlistService";
import { useAuth } from "../hooks/useAuth";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchWishlist = async () => {
    if (!user) {
      setWishlistItems([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getWishlist();
      setWishlistItems(data);
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const handleAddToWishlist = async (productId) => {
    if (!user) {
      alert("Please log in to add items to your wishlist.");
      return;
    }
    try {
      await addToWishlist(productId);
      fetchWishlist();
    } catch (error) {
      console.error("Failed to add to wishlist", error);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await removeFromWishlist(productId);
      fetchWishlist();
    } catch (error) {
      console.error("Failed to remove from wishlist", error);
    }
  };

  const isProductInWishlist = (productId) => {
    return wishlistItems.some((item) => item.productId === productId);
  };

  const value = {
    wishlistItems,
    addToWishlist: handleAddToWishlist,
    removeFromWishlist: handleRemoveFromWishlist,
    isProductInWishlist,
    loading,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
