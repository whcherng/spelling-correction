"use client";

import Link from "next/link";
import {useState} from "react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="#" className="text-xl font-bold">NLP System</Link>
                {/* Mobile Menu Button */}
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 focus:outline-none" id="menu-btn">
                    {isOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M4 6h16M4 12h16m-7 6h7"/>
                        </svg>
                    )}
                </button>
                {/* Menu */}
                <ul className="hidden md:flex space-x-6">
                    <li><Link href="/spelling-correction" className="hover:text-gray-300">Spelling
                        Correction</Link>
                    </li>
                    <li><Link href="/sentiment-analysis" className="hover:text-gray-300">Sentiment
                        Analysis</Link></li>
                </ul>
            </div>
            {/* Mobile Menu */}
            <ul className={`md:hidden text-center bg-gray-800 w-full py-4 space-y-4 transition-all duration-300 ${isOpen ? "block" : "hidden"}`}>
                <li><Link href="/spelling-correction" className="block py-2"
                          onClick={() => setIsOpen(false)}>Spelling Correction</Link>
                </li>
                <li><Link href="/sentiment-analysis" className="block py-2"
                          onClick={() => setIsOpen(false)}>Sentiment Analysis</Link>
                </li>
            </ul>
        </nav>);
}

export default Navbar;