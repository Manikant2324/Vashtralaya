import React from 'react'

const Footer = () => {
  return (
    <>
      <footer className="border-t mt-24">
        <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-16 text-sm">

          {/* BRAND */}
          <div className="flex flex-col gap-4">
            {/* TEXT LOGO */}
            <h1 className="text-2xl font-semibold tracking-wide">
              VASHTRALAYA<span className="text-gray-400">.</span>
            </h1>

            <p className="text-gray-600 leading-relaxed max-w-sm">
              Vashtralaya is your one-stop destination for modern fashion,
              crafted with quality, comfort, and timeless style in mind.
            </p>
          </div>

          {/* COMPANY */}
          <div className="flex flex-col gap-4">
            <p className="text-base font-semibold tracking-wide">
              COMPANY
            </p>
            <ul className="flex flex-col gap-2 text-gray-600">
              <li className="hover:text-black cursor-pointer transition">
                Home
              </li>
              <li className="hover:text-black cursor-pointer transition">
                About Us
              </li>
              <li className="hover:text-black cursor-pointer transition">
                Delivery
              </li>
              <li className="hover:text-black cursor-pointer transition">
                Privacy Policy
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div className="flex flex-col gap-4">
            <p className="text-base font-semibold tracking-wide">
              GET IN TOUCH
            </p>
            <ul className="flex flex-col gap-2 text-gray-600">
              <li className="hover:text-black cursor-pointer transition">
                +91-8647652456
              </li>
              <li className="hover:text-black cursor-pointer transition">
                contact@vashtralaya.com
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="border-t">
          <p className="py-4 text-center text-xs text-gray-500">
            © 2025 Vashtralaya.com — All Rights Reserved
          </p>
        </div>
      </footer>
    </>
  )
}

export default Footer
