import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true },
    category:{ type: String, required: true },
    subCategory:{ type: String, required: true},
    sizes:{ type: Array, required: true },
    bestseller:{ type: Boolean, default: false },
    stock: { type: Number, default: 100 },
    rating: { type: Number, default: 0 },
    reviews: [
        {
            userId: { type: String },
            userName: { type: String },
            rating: { type: Number, min: 1, max: 5 },
            comment: { type: String },
            date: { type: Date, default: Date.now }
        }
    ],
    date:{ type: Date, required: true }
})

const productModel = mongoose.models.product || mongoose.model('product', productSchema); 

export default productModel;