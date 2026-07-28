import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productModel from './models/productModel.js';

dotenv.config();

const dummyProducts = [
  {
    name: 'Classic White Oxford Shirt',
    description: 'A timeless white Oxford shirt crafted from premium 100% cotton. Perfect for formal and casual occasions. Features a button-down collar and tailored fit.',
    category: 'Men', subCategory: 'Topwear', price: 1299, stock: 50, bestseller: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    image: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&h=500&fit=crop'],
    date: Date.now()
  },
  {
    name: 'Slim Fit Stretch Chinos',
    description: 'Modern slim-fit chinos with 2% stretch fabric for maximum comfort. Flat front waistband, two side pockets and two back pockets.',
    category: 'Men', subCategory: 'Bottomwear', price: 1899, stock: 35, bestseller: true,
    sizes: ['S', 'M', 'L', 'XL'],
    image: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop'],
    date: Date.now()
  },
  {
    name: 'Floral Wrap Midi Dress',
    description: 'Elegant floral-print wrap dress with a flattering V-neckline and adjustable tie waist. Made from lightweight viscose fabric.',
    category: 'Women', subCategory: 'Topwear', price: 2499, stock: 28, bestseller: true,
    sizes: ['S', 'M', 'L', 'XL'],
    image: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop'],
    date: Date.now()
  },
  {
    name: 'High-Waist Wide Leg Trousers',
    description: 'Fashion-forward wide leg trousers with a high waist cut. Crafted from premium polyester blend.',
    category: 'Women', subCategory: 'Bottomwear', price: 1699, stock: 42, bestseller: false,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    image: ['https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=400&h=500&fit=crop'],
    date: Date.now()
  },
  {
    name: 'Oversized Graphic Hoodie',
    description: 'Stay cozy and stylish in this oversized hoodie with bold graphic print. Soft cotton-fleece blend with kangaroo pocket.',
    category: 'Men', subCategory: 'Winterwear', price: 2199, stock: 60, bestseller: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    image: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&h=500&fit=crop'],
    date: Date.now()
  },
  {
    name: 'Flared Denim Skirt',
    description: 'Trendy flared denim skirt with button-front closure and raw-hem finish. Premium stretch denim for a flattering fit.',
    category: 'Women', subCategory: 'Bottomwear', price: 1499, stock: 20, bestseller: false,
    sizes: ['XS', 'S', 'M', 'L'],
    image: ['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=500&fit=crop'],
    date: Date.now()
  },
  {
    name: 'Kids Dino Print T-Shirt',
    description: 'Fun and vibrant dinosaur print t-shirt for kids. Made from 100% soft cotton, breathable and comfortable for all-day play.',
    category: 'Kids', subCategory: 'Topwear', price: 599, stock: 80, bestseller: true,
    sizes: ['S', 'M', 'L'],
    image: ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=500&fit=crop'],
    date: Date.now()
  },
  {
    name: 'Premium Linen Kurta',
    description: 'Elegant linen kurta with mandarin collar and subtle embroidery on the neckline. Perfect for festive occasions.',
    category: 'Men', subCategory: 'Topwear', price: 1799, stock: 45, bestseller: false,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    image: ['https://images.unsplash.com/photo-1614251056798-0a63eda2bb25?w=400&h=500&fit=crop'],
    date: Date.now()
  },
  {
    name: 'Velvet Evening Blazer',
    description: 'Luxurious velvet blazer with peak lapels and a slim tailored cut. Ideal for formal events, weddings and festive evenings.',
    category: 'Women', subCategory: 'Winterwear', price: 4999, stock: 15, bestseller: true,
    sizes: ['XS', 'S', 'M', 'L'],
    image: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop'],
    date: Date.now()
  },
  {
    name: 'Kids Jogger Set',
    description: 'Comfortable 2-piece jogger set for kids with crewneck sweatshirt and matching jogger pants. Soft cotton-blend fleece.',
    category: 'Kids', subCategory: 'Bottomwear', price: 899, stock: 55, bestseller: false,
    sizes: ['S', 'M', 'L'],
    image: ['https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=500&fit=crop'],
    date: Date.now()
  },
  {
    name: 'Striped Casual Polo',
    description: 'Classic striped polo shirt in a relaxed fit. Rib-knit collar, two-button placket and breathable pique cotton fabric.',
    category: 'Men', subCategory: 'Topwear', price: 999, stock: 70, bestseller: false,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    image: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&h=500&fit=crop'],
    date: Date.now()
  },
  {
    name: 'Silk Blend Saree Blouse',
    description: 'Exquisite silk-blend blouse with intricate zari embroidery. Sweetheart neckline with hook-and-eye back closure.',
    category: 'Women', subCategory: 'Topwear', price: 2899, stock: 18, bestseller: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    image: ['https://images.unsplash.com/photo-1610189020754-5ce8e06dcee1?w=400&h=500&fit=crop'],
    date: Date.now()
  },
  {
    name: 'Vintage Leather Biker Jacket',
    description: 'Rugged genuine leather jacket with asymmetrical zip closure, quilted shoulder pads, and multiple zipped pockets.',
    category: 'Men', subCategory: 'Winterwear', price: 6499, stock: 25, bestseller: true,
    sizes: ['M', 'L', 'XL', 'XXL'],
    image: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop'],
    date: Date.now()
  },
  {
    name: 'Bohemian Printed Summer Maxi',
    description: 'Breezy bohemian maxi dress with vibrant floral motifs, tier ruffle skirt, and smocked stretch bodice.',
    category: 'Women', subCategory: 'Topwear', price: 3199, stock: 30, bestseller: true,
    sizes: ['S', 'M', 'L', 'XL'],
    image: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop'],
    date: Date.now()
  },
  {
    name: 'Kids Winter Puffer Jacket',
    description: 'Warm windproof puffer jacket with fleece lining and detachable hood. Bright water-resistant exterior.',
    category: 'Kids', subCategory: 'Winterwear', price: 1499, stock: 40, bestseller: false,
    sizes: ['S', 'M', 'L'],
    image: ['https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400&h=500&fit=crop'],
    date: Date.now()
  },
  {
    name: 'Classic Indigo Denim Trucker',
    description: 'Iconic denim trucker jacket crafted from heavy-duty indigo cotton denim with brass button hardware.',
    category: 'Men', subCategory: 'Winterwear', price: 2799, stock: 50, bestseller: true,
    sizes: ['S', 'M', 'L', 'XL'],
    image: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=500&fit=crop'],
    date: Date.now()
  },
  {
    name: 'Tailored Wool Trench Coat',
    description: 'Sophisticated double-breasted wool blend trench coat with belt tie waist and notch collar in classic camel.',
    category: 'Women', subCategory: 'Winterwear', price: 5999, stock: 12, bestseller: true,
    sizes: ['S', 'M', 'L'],
    image: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=500&fit=crop'],
    date: Date.now()
  },
  {
    name: 'Casual Slim Cargo Pants',
    description: 'Utility cargo pants with 6 reinforced tactical pockets, elasticated ankle cuffs, and comfortable stretch twill.',
    category: 'Men', subCategory: 'Bottomwear', price: 2199, stock: 45, bestseller: false,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    image: ['https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=400&h=500&fit=crop'],
    date: Date.now()
  }
];

const seedDatabase = async () => {
  try {
    const rawMongoUrl = process.env.MONGODB_URL?.trim();
    const mongoBaseUrl = rawMongoUrl ? rawMongoUrl.replace(/\/+$/, '') : 'mongodb://127.0.0.1:27017';
    const mongoUri = mongoBaseUrl.endsWith('/ecommerce') ? mongoBaseUrl : `${mongoBaseUrl}/ecommerce`;

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    
    for (const item of dummyProducts) {
      const exists = await productModel.findOne({ name: item.name });
      if (!exists) {
        await productModel.create(item);
        console.log(`Added new dummy product: ${item.name}`);
      }
    }
    
    const count = await productModel.countDocuments();
    console.log(`Database seeding completed! Total products: ${count}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
