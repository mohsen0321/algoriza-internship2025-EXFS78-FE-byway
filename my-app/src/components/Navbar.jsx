import React, { useContext, useState } from 'react';
import logo from '../images/logo.png';
import { Search, ShoppingCart, Menu, X, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
    const { user, logout, loading } = useContext(AuthContext);
    const { cartCount } = useContext(CartContext);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    if (loading) {
        return null;
    }

    return (
        <nav className="bg-white w-full h-[72px] border-b-2 fixed z-50 border-gray-500">
            <div className="container mx-auto flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
                <div className="flex items-center space-x-4 lg:space-x-20">
                    <div className="flex items-center">
                        <img
                            src={logo}
                            alt="Byway Logo"
                            className="w-10 h-10 object-contain"
                        />
                        <Link
                            to="/"
                            className="ml-2 text-xl font-semibold text-[#334155]"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            BywayBywayBywayBywayByway
                        </Link>
                    </div>
                    <div className="hidden lg:block relative">
                        <Search
                            size={20}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                        />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="w-[300px] lg:w-[400px] xl:w-[700px] h-[40px] border font-semibold placeholder:text-[#334155] text-[#334155] border-gray-300 rounded-[8px] pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <Link
                        to="/coursespage"
                        className="hidden md:block md:ml-50 lg:-ml-16 text-[#334155] font-medium hover:scale-105 hover:text-blue-600 transition-transform duration-200"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Courses
                    </Link>
                </div>
                <div className="hidden md:flex items-center space-x-2">
                    {user ? (
                        <>
                            <span className="text-[#334155] font-medium whitespace-nowrap">
                                Welcome, <span className="font-bold text-black">{user.firstName}</span>
                            </span>
                            {user.role !== 'Admin' && (
                                <Link to="/cart" className="relative flex items-center">
                                    <ShoppingCart
                                        size={24}
                                        className="text-gray-700 hover:text-blue-600  hover:scale-110   transition-all "
                                    />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                            )}
                            {user.role === 'Admin' && (
                                <Link
                                    to="/dashboard"
                                    className="border border-gray-300 ml-2 cursor-pointer hover:scale-105 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 transition-all duration-200"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                            )}

                            <LogOut onClick={handleLogout} className=" rounded-lg ml-4 cursor-pointer text-gray-600  hover:text-blue-600 transition-all hover:scale-105 "
                                size={30} />

                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 transition-all duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Log In
                            </Link>
                            <Link
                                to="/signuppage"
                                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 transition-all duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
                <div className="md:hidden flex items-center">
                    {user && user.role !== 'Admin' && (
                        <Link
                            to="/cart"
                            className="relative flex items-center mr-4"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <ShoppingCart
                                size={24}
                                className="text-gray-700 hover:text-blue-600   transition-colors duration-200"
                            />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    )}
                    <button
                        onClick={toggleMenu}
                        className="text-gray-700 hover:text-blue-900 transition-colors duration-200"
                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                    >
                        {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
                    </button>
                </div>
            </div>
            <div
                className={`md:hidden bg-gray-100 border-t border-gray-200 absolute top-[72px] left-0 right-0 shadow-lg transition-all duration-300 ease-in-out transform ${isMenuOpen
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 -translate-y-4 pointer-events-none'
                    }`}
            >
                <div className="container mx-auto px-4 py-4 space-y-3">
                    <Link
                        to="/coursespage"
                        className="block py-2 text-[#334155] font-medium hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Courses
                    </Link>

                    {user ? (
                        <>
                            <div className="text-[#334155] font-medium border-b pb-2">
                                Welcome, <span className="font-bold">{user.firstName}</span>
                            </div>

                            {user.role === 'Admin' && (
                                <Link
                                    to="/dashboard"
                                    className="block border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 transition-all duration-200 text-center"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                            )}

                            <button
                                onClick={handleLogout}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 transition-all duration-200"
                            >
                                Log Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="block border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 transition-all duration-200 text-center"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Log In
                            </Link>

                            <Link
                                to="/signuppage"
                                className="block border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 transition-all duration-200 text-center"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;