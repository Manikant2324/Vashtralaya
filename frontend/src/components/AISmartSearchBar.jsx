import React, { useState, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { BsStars, BsSearch } from 'react-icons/bs';

const AISmartSearchBar = ({ onSearchResults }) => {
  const { backendUrl, setSearch } = useContext(ShopContext);
  const [naturalQuery, setNaturalQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsedTags, setParsedTags] = useState(null);

  const handleAISearch = async (e) => {
    if (e) e.preventDefault();
    if (!naturalQuery.trim()) return;

    try {
      setLoading(true);
      const response = await axios.post(`${backendUrl}/api/ai/search`, {
        query: naturalQuery
      });

      if (response.data.success) {
        setParsedTags(response.data.parsedQuery);
        if (onSearchResults) {
          onSearchResults(response.data.products);
        } else {
          setSearch(naturalQuery);
        }
      }
    } catch (error) {
      console.error('AI Smart Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const sampleQueries = [
    "Men's jacket under ₹3000",
    "Festive saree for women",
    "Kids denim & topwear"
  ];

  return (
    <div className="w-full max-w-3xl mx-auto my-6 p-4 bg-white rounded-2xl border border-gray-200 shadow-md">
      <form onSubmit={handleAISearch} className="flex items-center gap-2">
        <div className="flex-1 relative flex items-center">
          <BsStars className="absolute left-3.5 text-amber-500 text-base" />
          <input
            type="text"
            value={naturalQuery}
            onChange={(e) => setNaturalQuery(e.target.value)}
            placeholder="Try: 'Festive silk kurta under 2500' or 'Women winter coat'..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black bg-gray-50 focus:bg-white transition"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !naturalQuery.trim()}
          className="bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-800 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
        >
          <BsSearch className="text-xs" />
          {loading ? "Parsing..." : "AI Search"}
        </button>
      </form>

      {/* AI Parsed Tag Highlights */}
      {parsedTags && (
        <div className="mt-3 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-[10px] font-bold uppercase text-gray-400">AI Filters Applied:</span>
          {parsedTags.category && (
            <span className="px-2.5 py-0.5 bg-black text-white rounded-full font-semibold text-[11px]">
              Gender: {parsedTags.category}
            </span>
          )}
          {parsedTags.subCategory && (
            <span className="px-2.5 py-0.5 bg-black text-white rounded-full font-semibold text-[11px]">
              Type: {parsedTags.subCategory}
            </span>
          )}
          {parsedTags.maxPrice && (
            <span className="px-2.5 py-0.5 bg-emerald-700 text-white rounded-full font-semibold text-[11px]">
              Max Price: ₹{parsedTags.maxPrice}
            </span>
          )}
        </div>
      )}

      {/* Quick Prompt Pills */}
      <div className="mt-2.5 flex items-center gap-2 flex-wrap text-xs">
        <span className="text-[10px] text-gray-400 font-bold uppercase">Try Searching:</span>
        {sampleQueries.map((sq, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setNaturalQuery(sq);
            }}
            className="text-[11px] text-gray-600 hover:text-black bg-gray-100 hover:bg-gray-200 px-2.5 py-0.5 rounded-full transition cursor-pointer border"
          >
            "{sq}"
          </button>
        ))}
      </div>
    </div>
  );
};

export default AISmartSearchBar;
