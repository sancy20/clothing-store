import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!product) return null;

  const availableColors = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return [];
    }
    const uniqueColors = new Set(product.variants.map((v) => v.color));
    return Array.from(uniqueColors);
  }, [product.variants]);

  const mainImageUrl = product.image_url;
  const hoverImageUrl = product.image_url_alt || mainImageUrl;
  const imageUrlToShow = isHovered ? hoverImageUrl : mainImageUrl;

  return (
    <div className='relative group text-center p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300'>
      <Link
        to={`/product/${product.id}`}
        className='block'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className='relative h-[350px] sm:h-[450px] w-full overflow-hidden'>
          <img
            src={imageUrlToShow || "https://placehold.co/600x700"}
            alt={product.name}
            className='h-full w-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-105'
          />
        </div>
        <div className='mt-4'>
          <h2 className='mt-2 text-sm font-semibold text-black truncate'>
            {product.name}
          </h2>
          <p className='text-xs text-gray-600 uppercase mt-1'>
            {product.brand}
          </p>
          <p className='mt-1 text-sm text-black font-bold'>${product.price}</p>
        </div>
      </Link>

      {availableColors.length > 0 && (
        <div className='flex justify-center items-center gap-2 mt-3 h-4'>
          {availableColors.map((color) => (
            <Link
              key={color}
              to={`/product/${product.id}?color=${encodeURIComponent(color)}`}
              title={color}
              className='w-4 h-4 rounded-full border border-gray-300 block'
              style={{ backgroundColor: color.toLowerCase() }}
              onClick={(e) => e.stopPropagation()}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
