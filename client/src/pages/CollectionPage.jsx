import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { getAllProducts, getNavigationData } from "../services/productService";
import ProductCard from "../components/ProductCard";
import {
  IoOptionsOutline,
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoClose,
  IoSquare,
} from "react-icons/io5";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const CollectionPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [sortCriteria, setSortCriteria] = useState("Newest Arrivals");

  const query = useQuery();
  const navigate = useNavigate();
  const location = useLocation();

  const [filterOptions, setFilterOptions] = useState({
    Brand: [],
    Category: ["Hoodie", "T-Shirt", "Sneakers", "Jacket", "Pants", "Accessory"],
  });

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const navData = await getNavigationData();
        setFilterOptions((prev) => ({ ...prev, Brand: navData.brands }));
      } catch (error) {
        console.error("Failed to fetch filter options:", error);
      }
    };
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = Object.fromEntries(query.entries());
        const data = await getAllProducts(params);

        switch (sortCriteria) {
          case "Price: Low to High":
            data.sort((a, b) => a.price - b.price);
            break;
          case "Price: High to Low":
            data.sort((a, b) => b.price - a.price);
            break;
          case "Newest Arrivals":
          default:
            data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        }
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search, sortCriteria]);

  const handleCheckboxChange = (category, value) => {
    const newQuery = new URLSearchParams(query);
    const categoryKey = category.toLowerCase();

    if (categoryKey === "brand") {
      const selectedBrands = newQuery.get("brand")?.split(",") || [];
      const newBrands = selectedBrands.includes(value)
        ? selectedBrands.filter((b) => b !== value)
        : [...selectedBrands, value];

      if (newBrands.length) {
        newQuery.set("brand", newBrands.join(","));
      } else {
        newQuery.delete("brand");
      }
    } else {
      if (newQuery.get(categoryKey) === value) {
        newQuery.delete(categoryKey);
      } else {
        newQuery.set(categoryKey, value);
      }
    }
    navigate(`/collection?${newQuery.toString()}`);
  };

  const clearAllFilters = () => {
    navigate("/collection");
  };

  const activeFilters = useMemo(() => {
    const filters = {};
    for (let [key, value] of query.entries()) {
      filters[key] = value.split(",");
    }
    return filters;
  }, [location.search]);

  const pageTitle =
    query.get("brand")?.split(",").join(", ") || "All Collections";

  if (loading)
    return <p className='text-center py-20'>Loading Collection...</p>;

  return (
    <div className='container mx-auto p-4 md:p-8'>
      <h1 className='text-2xl text-center font-bold'>{pageTitle}</h1>
      <div className='border-t-2 border-black w-16 mx-auto mt-2 mb-8'></div>

      <div className='flex justify-between items-center mb-4'>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className='border border-black text-black px-4 py-2 flex items-center space-x-2'
        >
          <span>Filters</span>
          <IoOptionsOutline />
        </button>
        <select
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
          className='border border-black px-4 py-2'
        >
          <option>Newest Arrivals</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
        </select>
      </div>
      <div className='border-b border-gray-200 w-full mx-auto mt-3 mb-4'></div>

      {Object.keys(activeFilters).length > 0 && (
        <div className='flex items-center space-x-2 mb-5 flex-wrap gap-2'>
          {Object.entries(activeFilters).map(([key, values]) =>
            values.map((value) => (
              <div
                key={`${key}-${value}`}
                className='text-black px-3 py-1 space-x-2 border border-gray-300 text-sm flex items-center capitalize'
              >
                <span>
                  {key}: {value}
                </span>
                <button onClick={() => handleCheckboxChange(key, value)}>
                  <IoClose />
                </button>
              </div>
            ))
          )}
          <button
            onClick={clearAllFilters}
            className='text-sm text-gray-500 underline'
          >
            Clear All
          </button>
        </div>
      )}

      <div className='flex'>
        <aside
          className={`transition-all duration-300 ${
            showFilter ? "w-64 pr-8" : "w-0"
          } overflow-hidden`}
        >
          <div>
            {Object.entries(filterOptions).map(([name, items]) => (
              <div key={name}>
                <button
                  onClick={() =>
                    setActiveAccordion(activeAccordion === name ? null : name)
                  }
                  className='w-full flex justify-between items-center text-md font-bold py-2'
                >
                  {name}
                  {activeAccordion === name ? (
                    <IoChevronUpOutline />
                  ) : (
                    <IoChevronDownOutline />
                  )}
                </button>
                <div
                  className={`mt-2 space-y-2 transition-all duration-300 overflow-hidden ${
                    activeAccordion === name ? "max-h-96" : "max-h-0"
                  }`}
                >
                  {items.map((item) => (
                    <label
                      key={item}
                      className='flex items-center text-sm space-x-3 cursor-pointer group'
                    >
                      <input
                        type='checkbox'
                        checked={
                          name === "Brand"
                            ? query.get("brand")?.split(",").includes(item) ||
                              false
                            : query.get(name.toLowerCase()) === item
                        }
                        onChange={() => handleCheckboxChange(name, item)}
                        className='absolute opacity-0 h-0 w-0'
                      />
                      <span
                        className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center transition-all duration-200 
                        ${
                          (
                            name === "Brand"
                              ? query.get("brand")?.split(",").includes(item)
                              : query.get(name.toLowerCase()) === item
                          )
                            ? "bg-black"
                            : "bg-white"
                        }`}
                      >
                        <IoSquare
                          className={`h-4 w-4 text-black transition-opacity duration-200 ${
                            (
                              name === "Brand"
                                ? query.get("brand")?.split(",").includes(item)
                                : query.get(name.toLowerCase()) === item
                            )
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                      </span>
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Product Grid */}
        <main
          className={`transition-all duration-300 ${
            showFilter ? "w-[calc(100%-16rem)]" : "w-full"
          }`}
        >
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8'>
            {products.length > 0 ? (
              products.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))
            ) : (
              <p className='col-span-full text-center text-gray-500'>
                No products match your criteria.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CollectionPage;
