import React, { useState, useEffect } from "react";
import { getWishlist, removeFromWishlist } from "../services/wishlistService";
import ProductCard from "../components/ProductCard";
import { IoHeartDislikeOutline } from "react-icons/io5";

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await getWishlist();
      setWishlistItems(data);
    } catch (err) {
      setError("Failed to fetch wishlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      fetchWishlist();
    } catch (err) {
      setError("Failed to remove item from wishlist.");
    }
  };

  if (loading)
    return <p className='text-center p-8'>Loading your wishlist...</p>;
  if (error) return <p className='text-center text-red-500 p-8'>{error}</p>;

  return (
    <div>
      <h1 className='text-3xl font-bold mb-6'>My Wishlist</h1>
      {wishlistItems.length === 0 ? (
        <div className='text-center py-16 px-6 bg-white rounded-lg shadow-md'>
          <IoHeartDislikeOutline className='mx-auto text-5xl text-gray-300' />
          <p className='text-gray-500 text-lg mt-4'>Your wishlist is empty.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {wishlistItems.map((item) => (
            <div key={item.id} className='relative'>
              <ProductCard product={item.product} />
              <button
                onClick={() => handleRemove(item.productId)}
                className='absolute top-2 right-2 bg-white p-2 rounded-full shadow-md text-red-500 hover:bg-red-50'
                title='Remove from Wishlist'
              >
                <IoHeartDislikeOutline size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
