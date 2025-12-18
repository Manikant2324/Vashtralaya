import React, { useContext, useState, useEffect, use } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/frontend-assests/assets'
import Title from '../components/Title'
import Productitems from '../components/Productitems'

const Collection = () => {

  const { products } = useContext(ShopContext)
  const [showFilter, setShowFilter] = useState(false)
  const [filterProducts, setFilterProducts] = useState([])
  const [category,setCategory]=useState([]);
  const [subCategory,setSubCategory]=useState([]);
  const [sortType,setSortType]=useState('relevant');

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value));
    } else {
      setCategory(prev=>[...prev, e.target.value]);
    }
  }
const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(item => item !== e.target.value));
    } else {
      setSubCategory(prev =>[...prev, e.target.value]);
    }
  }

  const applyFilters = () => {
    let productsCopy =products.slice();
    if(category.length>0){
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }
    if(subCategory.length>0){
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
    }
    setFilterProducts(productsCopy);
  }
  const sortProduct = () => {
    // Sorting logic can be implemented here
    let fpcopy = filterProducts.slice();
    switch(sortType){
      case 'low-high':
       setFilterProducts(fpcopy.sort((a,b) => a.price - b.price));
        break;
      case 'high-low':
        setFilterProducts(fpcopy.sort((a,b) => b.price - a.price));
        break;
      default:
        applyFilters();
        break;
    }
  }



  useEffect(() => {
   applyFilters();
  },[category, subCategory])

  useEffect(() => {
    sortProduct();
  }, [sortType])



  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">

      {/* Filter Options */}
      <div className="min-w-60">

        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        {/* Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>

          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value="Men" onChange={toggleCategory} /> Men 
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value="Women" onChange={toggleCategory} /> Women
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value="Kids" onChange={toggleCategory} /> Kids
            </p>
          </div>
        </div>

        {/* Types */}
        <div className={`border border-gray-300 pl-5 py-3 my-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className="mb-3 text-sm font-medium">TYPES</p>

          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={'Topwear'} onChange={toggleSubCategory} /> Topwear
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={'Bottomwear'} onChange={toggleSubCategory} /> Bottomwear
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={'Winterwear'} onChange={toggleSubCategory} /> Winterwear
            </p>
          </div>
        </div>

      </div>

      {/* Right Side */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1="ALL" text2="COLLECTIONS" />
          <select onChange={(e)=>setSortType(e.target.value)} className="border border-gray-300 text-sm px-2">
            <option value="relevant">Sort by Relevance</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {filterProducts.map((item, index) => (
            <Productitems
              key={index}
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
            />
          ))}
        </div>
      </div>

    </div>
  )
}

export default Collection
