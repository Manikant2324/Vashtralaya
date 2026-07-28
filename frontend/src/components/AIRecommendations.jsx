import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import Productitems from './Productitems';
import Title from './Title';
import { BsStars } from 'react-icons/bs';

const AIRecommendations = () => {
  const { backendUrl } = useContext(ShopContext);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/ai/recommendations`);
        if (response.data.success && response.data.recommendations) {
          setRecommendations(response.data.recommendations);
        }
      } catch (error) {
        console.error('AI Recommendations fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [backendUrl]);

  if (loading || recommendations.length === 0) return null;

  return (
    <div className="my-16">
      <div className="text-center py-8 text-3xl">
        <div className="inline-flex items-center gap-2 mb-2 bg-black text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-xs">
          <BsStars className="text-sm" /> AI Personalized Picks
        </div>
        <Title text1={"RECOMMENDED FOR"} text2={"YOU"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Handpicked high-fashion styles intelligently curated based on trending preferences and aesthetic harmony.
        </p>
      </div>

      {/* Rendering Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {recommendations.slice(0, 5).map((item) => (
          <Productitems
            key={item._id}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
            stock={item.stock}
          />
        ))}
      </div>
    </div>
  );
};

export default AIRecommendations;
