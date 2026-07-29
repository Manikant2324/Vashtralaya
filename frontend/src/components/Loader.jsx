import React from 'react';
import { BsStars } from 'react-icons/bs';

// Sleek Product Card Skeleton Loader
export const ProductSkeleton = ({ count = 5 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 animate-pulse">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <div className="w-full aspect-[3/4] bg-gray-200 rounded-lg"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
};

// Circular Spinner Loader
export const Spinner = ({ size = "md", text = "" }) => {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} border-gray-200 border-t-black rounded-full animate-spin`}
      ></div>
      {text && <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase">{text}</p>}
    </div>
  );
};

// Full Page Brand Loader
export const PageLoader = ({ text = "Loading Vashtralaya..." }) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 py-16">
      <div className="relative flex items-center justify-center">
        <div className="w-14 h-14 border-4 border-gray-100 border-t-black rounded-full animate-spin"></div>
        <BsStars className="absolute text-amber-500 text-lg animate-pulse" />
      </div>
      <p className="text-xs font-bold text-gray-700 uppercase tracking-widest animate-pulse">{text}</p>
    </div>
  );
};

export default Spinner;
