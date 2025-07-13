import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getActiveHeroPanels } from "../services/heroPanelService";

const Hero = () => {
  const [heroPanels, setHeroPanels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPanels = async () => {
      try {
        const data = await getActiveHeroPanels();
        setHeroPanels(data);
      } catch (error) {
        console.error("Failed to fetch hero panels:", error);
        setHeroPanels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPanels();
  }, []);

  if (loading) {
    return (
      <div className='mt-10 py-16'>
        <div className='flex justify-center items-center mt-16 animate-pulse'>
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className='w-[150px] h-[400px] mx-2 bg-gray-200 rounded-md'
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (heroPanels.length === 0) {
    return null;
  }

  return (
    <div className='mt-10 py-16'>
      <div className='flex justify-center items-center mt-16'>
        {heroPanels.map((panel) => (
          <div
            key={panel.id}
            className='relative w-[150px] h-[400px] mx-2 group overflow-hidden'
          >
            <Link
              to={`/collection?brand=${panel.brand}`}
              aria-label={`Explore ${panel.brand}`}
            >
              <img
                src={panel.imageUrl}
                alt={`Hero Image for ${panel.brand}`}
                className='h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:brightness-75'
              />
            </Link>

            <div>
              <img
                src={panel.logoUrl}
                alt={`Logo for {panel.logoUrl}`}
                className='absolute w-10 h-10 object-contain bottom-2 left-2 group-hover:w-24 group-hover:h-24 group-hover:bottom-1/2 group-hover:left-1/2 group-hover:translate-x-[-50%] group-hover:translate-y-[-50%] opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out'
              />
            </div>
          </div>
        ))}
      </div>

      <div className='flex justify-center mt-8'>
        <Link
          to='/collection'
          className='text-gray-500 text-sm font-medium uppercase hover:text-black transition duration-300'
        >
          Shop All
        </Link>
      </div>
    </div>
  );
};

export default Hero;
