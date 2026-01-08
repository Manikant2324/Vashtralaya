import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import About from './pages/About'
import Collection from './pages/collection'
import Product from './pages/Product'
import Contacts from './pages/Contacts'
import Login from './pages/Login'
import Orders from './pages/Orders'
import Placeorder from './pages/Placeorder'
import Cart from './pages/Cart'
import Footer from './components/Footer'
import Searchbar from './components/Searchbar'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'

const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />
      <Navbar />
      <Searchbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/placeorder" element={<Placeorder />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App