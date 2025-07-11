import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getProductById, getRelatedProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../context/WishlistContext";
import {
  IoRemoveOutline,
  IoAddOutline,
  IoHeart,
  IoHeartOutline,
} from "react-icons/io5";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isProductInWishlist } =
    useWishlist();
  const [searchParams] = useSearchParams();
  const urlColor = searchParams.get("color");

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(null);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const fetchAllData = async () => {
      if (!id) return;
      window.scrollTo(0, 0);
      try {
        setLoading(true);
        const [productData, relatedData] = await Promise.all([
          getProductById(id),
          getRelatedProducts(id),
        ]);
        setProduct(productData);
        setRelatedProducts(relatedData);

        if (productData) {
          const availableColors = productData.variants
            ? [...new Set(productData.variants.map((v) => v.color))]
            : [];
          const initialColor =
            urlColor && availableColors.includes(urlColor)
              ? urlColor
              : availableColors[0] || null;
          setSelectedColor(initialColor);

          if (initialColor) {
            const newImage =
              productData.images.find((img) => img.color_hint === initialColor)
                ?.image_url || productData.images?.[0]?.image_url;
            setMainImage(newImage || "");
          } else {
            setMainImage(productData.images?.[0]?.image_url || "");
          }
          setSelectedSize(null);
          setQuantity(1);
        }
      } catch (err) {
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [id, urlColor]);

  const { availableColors, availableSizes, currentVariant } = useMemo(() => {
    if (!product?.variants)
      return { availableColors: [], availableSizes: [], currentVariant: null };
    const colors = [...new Set(product.variants.map((v) => v.color))];
    const sizes = product.variants
      .filter((v) => v.color === selectedColor)
      .map((v) => v.size);
    const variant = product.variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );
    return {
      availableColors: colors,
      availableSizes: sizes,
      currentVariant: variant,
    };
  }, [product, selectedColor, selectedSize]);

  const buttonState = useMemo(() => {
    if (!selectedSize) {
      return "SELECT_SIZE";
    }
    if (currentVariant && currentVariant.stock_quantity > 0) {
      return "ADD_TO_CART";
    }
    if (currentVariant && currentVariant.stock_quantity === 0) {
      return "OUT_OF_STOCK";
    }
    return "SELECT_SIZE";
  }, [selectedSize, currentVariant]);

  const buttonText = {
    SELECT_SIZE: "Select a Size",
    ADD_TO_CART: "Add to Cart",
    OUT_OF_STOCK: "Out of Stock",
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedSize(null);
    setQuantity(1);
    const newImage =
      product.images.find((img) => img.color_hint === color)?.image_url ||
      product.images[0]?.image_url;
    if (newImage) setMainImage(newImage);
  };

  const handleAddToCart = () => {
    if (!selectedSize || !currentVariant) {
      setNotification("Please select a size.");
      setTimeout(() => setNotification(""), 2000);
      return;
    }
    if (currentVariant.stock_quantity < quantity) {
      setNotification("Not enough items in stock.");
      setTimeout(() => setNotification(""), 2000);
      return;
    }

    const variantImage =
      product.images.find((img) => img.color_hint === selectedColor)
        ?.image_url || mainImage;

    const productToAdd = {
      ...product,
      variantId: currentVariant.id,
      color: selectedColor,
      size: selectedSize,
      image_url: variantImage,
    };

    addToCart(productToAdd, quantity);

    setNotification(`${product.name} added to cart!`);
    setTimeout(() => setNotification(""), 2000);
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    if (isProductInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const maxQuantity = currentVariant ? currentVariant.stock_quantity : 0;
  const inWishlist = product ? isProductInWishlist(product.id) : false;

  if (loading) return <p className='text-center py-20'>Loading...</p>;
  if (error) return <p className='text-center py-20 text-red-500'>{error}</p>;
  if (!product) return <p className='text-center py-20'>Product not found.</p>;

  const descriptionPoints = product.description?.split(";") || [];

  return (
    <div className='container mx-auto max-w-7xl p-4 md:p-8'>
      {notification && (
        <div
          className={`fixed top-24 right-8 text-white px-6 py-3 rounded-lg shadow-lg z-50 ${
            buttonState === "ADD_TO_CART" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notification}
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-12 gap-8'>
        <div className='md:col-span-1 order-first md:order-first'>
          <div className='flex md:flex-col gap-2'>
            {product.images?.map((img) => (
              <button
                key={img.id}
                onClick={() => setMainImage(img.image_url)}
                className={`w-16 md:w-full border-2 ${
                  mainImage === img.image_url
                    ? "border-black"
                    : "border-transparent"
                } p-1 rounded-md`}
              >
                <img
                  src={img.image_url}
                  alt='thumbnail'
                  className='w-full h-auto object-cover'
                />
              </button>
            ))}
          </div>
        </div>

        <div className='md:col-span-7 order-2 md:order-2'>
          {mainImage && (
            <img
              src={mainImage}
              alt={product.name}
              className='w-full h-auto rounded-lg'
            />
          )}
        </div>

        <div className='md:col-span-4 order-3 md:order-3 flex flex-col'>
          <p className='text-sm uppercase tracking-widest text-gray-500'>
            {product.brand}
          </p>
          <h1 className='text-3xl font-semibold mt-1'>{product.name}</h1>
          <p className='text-2xl font-bold text-black my-4'>${product.price}</p>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2'>
              COLOUR: {selectedColor}
            </label>
            <div className='flex flex-wrap gap-2'>
              {availableColors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color ? "border-black" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                ></button>
              ))}
            </div>
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2'>
              SIZE: {selectedSize}
            </label>
            <div className='flex flex-wrap gap-2'>
              {availableSizes.map((size) => {
                const variantForSize = product.variants.find(
                  (v) => v.color === selectedColor && v.size === size
                );
                const sizeIsOutOfStock =
                  !variantForSize || variantForSize.stock_quantity === 0;
                return (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setQuantity(1);
                    }}
                    disabled={sizeIsOutOfStock}
                    className={`w-12 h-10 border rounded-md text-sm transition ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-gray-300"
                    } ${
                      sizeIsOutOfStock
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed line-through"
                        : "hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2'>QUANTITY</label>
            <div className='flex items-center border border-gray-300 rounded-md w-fit'>
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className='w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50'
                disabled={buttonState !== "ADD_TO_CART"}
              >
                <IoRemoveOutline />
              </button>
              <span className='w-10 text-center font-medium'>
                {buttonState === "ADD_TO_CART" ? quantity : 0}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
                className='w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50'
                disabled={
                  buttonState !== "ADD_TO_CART" || quantity >= maxQuantity
                }
              >
                <IoAddOutline />
              </button>
            </div>
          </div>

          <div className='flex items-center space-x-3 mt-4'>
            <button
              onClick={handleAddToCart}
              disabled={buttonState !== "ADD_TO_CART"}
              className={`w-full py-3 rounded-md transition text-sm font-semibold tracking-wider ${
                buttonState === "ADD_TO_CART"
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-gray-400 text-white cursor-not-allowed"
              }`}
            >
              {buttonText[buttonState]}
            </button>
            <button
              onClick={handleWishlistToggle}
              className='p-3 border border-gray-300 rounded-md hover:bg-gray-100'
              title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              {inWishlist ? (
                <IoHeart className='text-red-500' size={24} />
              ) : (
                <IoHeartOutline className='text-gray-600' size={24} />
              )}
            </button>
          </div>

          <div className='pt-6 mt-4 text-sm'>
            <ul className='space-y-1'>
              {descriptionPoints.map(
                (point, index) => point && <li key={index}>- {point.trim()}</li>
              )}
            </ul>
            {product.style_code && (
              <p className='mt-4'>Style: {product.style_code}</p>
            )}
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className='mt-16 pt-8 border-t border-gray-200'>
          <h2 className='text-2xl font-bold text-center mb-8'>
            You May Also Like
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
