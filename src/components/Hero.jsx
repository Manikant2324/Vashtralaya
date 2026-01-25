import React from "react";
import { assets } from "../assets/frontend-assests/assets";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="w-full pt-4 pb-16 px-6 sm:px-16 bg-white">
      {/* FRAME */}
      <div className="
        max-w-7xl mx-auto
        border border-gray-200
        rounded-sm
        flex flex-col sm:flex-row
        overflow-hidden
      ">
        {/* LEFT TEXT */}
        <div className="
          w-full sm:w-1/2
          flex items-center
          px-6 sm:px-14
          py-14
        ">
          <div className="text-gray-800">

            <p className="text-xs tracking-[0.3em] text-gray-500 mb-4">
              OUR BESTSELLERS
            </p>

            <h1 className="
              font-serif
              text-4xl sm:text-5xl
              leading-tight
              mb-6
            ">
              Latest Arrivals
            </h1>

            <Link
              to="/collection"
              className="
                inline-flex items-center gap-2
                text-sm tracking-widest
                hover:gap-4 transition-all
              "
            >
              SHOP NOW
              <span className="text-lg">→</span>
            </Link>

          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="
          w-full sm:w-1/2
          bg-[#f9d7cf]
          flex items-center justify-center
          border-l border-gray-200
        ">
          <img
            src={assets.hero_img}
            alt="hero"
            className="
              w-full h-full
              object-cover
            "
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
