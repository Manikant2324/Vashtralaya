import React from 'react'
import { assets } from '../assets/frontend-assests/assets'

const Newsletterbox = () => {
    const onSubmitHandler = (event) => {
        event.preventDefault();
        // Add your form submission logic here
    }
  return (
    <div className=' text-center'>
        <p className='text-2xl font-medium text-gray-800'>Subscribe now & get 20% off</p>
        <p className='text-gray-500 mt-3'>Subscribe to the newsletter to receive updates on new arrivals, special offers and other discount information.</p>
         <form className='w-full sm:w-1/2 flex item-center gap-3 mx-auto my-6 border pl-3'>
            <input className='w-full sm:flex-1 outline-none' type='email' placeholder='Enter your email address' required />
            <button type='submit' className='bg-black text-white text-xs px-10 py-4'>SUBSCRIBE</button>
         </form>
    </div>
  )
}

export default Newsletterbox