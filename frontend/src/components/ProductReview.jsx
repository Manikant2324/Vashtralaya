import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';

const ProductReview = ({ productId }) => {
    const { token, backendUrl } = useContext(ShopContext);
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [showAddReview, setShowAddReview] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const response = await axios.post(backendUrl + '/api/product/review/get', {
                productId
            });

            if (response.data.success) {
                setReviews(response.data.reviews);
                setAvgRating(response.data.avgRating || 0);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (!token) {
            toast.error('Please login to add review');
            return;
        }

        if (!rating || !comment.trim()) {
            toast.error('Please fill all fields');
            return;
        }

        try {
            const response = await axios.post(
                backendUrl + '/api/product/review/add',
                {
                    productId,
                    rating,
                    comment
                },
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success('Review added successfully');
                setRating(5);
                setComment('');
                setShowAddReview(false);
                fetchReviews();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to add review');
        }
    };

    const renderStars = (count) => {
        return (
            <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-lg ${i < count ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ★
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="border-t pt-10 mt-10">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold">Reviews & Ratings</h3>
                {token && (
                    <button
                        onClick={() => setShowAddReview(!showAddReview)}
                        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
                    >
                        {showAddReview ? 'Cancel' : 'Add Review'}
                    </button>
                )}
            </div>

            {/* Add Review Form */}
            {showAddReview && (
                <div className="bg-gray-50 p-6 rounded-lg mb-6 border">
                    <form onSubmit={handleSubmitReview}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`text-3xl transition ${
                                            star <= rating ? 'text-yellow-400' : 'text-gray-300'
                                        }`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Your Review</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your experience with this product..."
                                className="w-full border border-gray-300 rounded-lg p-3 min-h-24 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>

                        <p className="text-xs text-gray-500 mb-4 italic">
                            * Reviews are verified and can only be submitted by customers who have purchased and received (Delivered) this item.
                        </p>

                        <button
                            type="submit"
                            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition font-medium"
                        >
                            Submit Review
                        </button>
                    </form>
                </div>
            )}

            {/* Average Rating */}
            {reviews.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
                    <div className="flex items-center gap-4">
                        <div>
                            <p className="text-4xl font-bold">{avgRating.toFixed(1)}</p>
                            {renderStars(Math.round(avgRating))}
                        </div>
                        <div>
                            <p className="text-gray-600">{reviews.length} customer reviews</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {loading ? (
                    <p className="text-center py-8 text-gray-600">Loading reviews...</p>
                ) : reviews.length === 0 ? (
                    <p className="text-center py-8 text-gray-600">No reviews yet. Be the first to review!</p>
                ) : (
                    reviews.map((review, index) => (
                        <div key={index} className="border-b pb-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="font-semibold">{review.userName}</p>
                                    {renderStars(review.rating)}
                                </div>
                                <p className="text-sm text-gray-500">
                                    {new Date(review.date).toLocaleDateString()}
                                </p>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductReview;
