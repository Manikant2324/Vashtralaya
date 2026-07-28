import React, { useState, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { BsStars } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';

const AISizeFitAdvisor = ({ isOpen, onClose, onSelectSize }) => {
  const { backendUrl } = useContext(ShopContext);
  const [heightCm, setHeightCm] = useState('172');
  const [weightKg, setWeightKg] = useState('68');
  const [fitPreference, setFitPreference] = useState('regular');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleCalculate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${backendUrl}/api/ai/size-fit`, {
        heightCm,
        weightKg,
        fitPreference
      });

      if (response.data.success) {
        setResult(response.data);
      }
    } catch (error) {
      console.error('Size calculation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black font-bold text-xl"
        >
          <IoClose />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-black text-amber-300 flex items-center justify-center">
            <BsStars className="text-lg" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">AI Size & Fit Advisor</h3>
            <p className="text-xs text-gray-500">Precision fit calculation based on your measurements</p>
          </div>
        </div>

        {!result ? (
          <form onSubmit={handleCalculate} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Your Height (cm)
              </label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="e.g. 175"
                required
                className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Your Weight (kg)
              </label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="e.g. 70"
                required
                className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Fit Preference
              </label>
              <select
                value={fitPreference}
                onChange={(e) => setFitPreference(e.target.value)}
                className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none"
              >
                <option value="slim">Slim / Fitted</option>
                <option value="regular">Regular / Standard</option>
                <option value="oversized">Relaxed / Oversized</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider mt-4"
            >
              <BsStars className="text-amber-300 text-sm" />
              {loading ? "Analyzing Body Profile..." : "Calculate Recommended Size"}
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-center py-2 animate-zoomIn">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-xs uppercase font-bold text-gray-500 tracking-wider">
                Recommended Size
              </p>
              <h2 className="text-4xl font-extrabold text-black my-1">
                {result.recommendedSize}
              </h2>
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                {result.confidenceScore} Accuracy
              </span>
              <p className="text-xs text-gray-600 mt-2 font-medium">
                {result.fitNote}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setResult(null)}
                className="flex-1 py-2.5 border text-xs font-semibold rounded-lg hover:bg-gray-100"
              >
                Recalculate
              </button>
              <button
                onClick={() => {
                  if (onSelectSize) onSelectSize(result.recommendedSize);
                  onClose();
                }}
                className="flex-1 py-2.5 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-800"
              >
                Select Size {result.recommendedSize}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISizeFitAdvisor;
