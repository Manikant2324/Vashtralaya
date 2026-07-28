import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext' 
import { assets } from '../assets/frontend-assests/assets'
import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Searchbar = () => {
    const { search, setSearch, showSearch, setShowSearch, navigate } = useContext(ShopContext)
    const [visible, setVisible] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Restrict search bar visibility strictly to Collection page
        if (location.pathname.includes('collection')) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [location]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && search.trim()) {
            // If not on collection page, navigate to it
            if (location.pathname !== '/collection') {
                navigate('/collection');
            }
        }
    };

    return showSearch && visible ? (
        <div className="border-t border-b bg-gray-50 text-center sticky top-24 z-40">
            <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-4 rounded-full w-3/4 sm:w-1/2">
                <input
                    value={search}
                    onChange={handleSearch}
                    onKeyPress={handleKeyPress}
                    className="flex-1 outline-none bg-inherit text-sm"
                    type="text"
                    placeholder="Search products..."
                    autoFocus
                />

                <img
                    className="w-4 cursor-pointer"
                    src={assets.search_icon}
                    alt="search"
                    onClick={() => {
                        if (search.trim() && location.pathname !== '/collection') {
                            navigate('/collection');
                        }
                    }}
                />
            </div>

            <img
                onClick={() => setShowSearch(false)}
                className="inline w-3 cursor-pointer ml-2"
                src={assets.cross_icon}
                alt="close"
            />
        </div>
    ) : null
}

export default Searchbar