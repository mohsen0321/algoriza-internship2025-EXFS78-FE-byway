import React from "react";
import logo from "../images/logo.png";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub, FaGoogle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaXTwitter } from "react-icons/fa6";
import { BsMicrosoft } from "react-icons/bs";

const Footer = () => {
    return (
        <footer className="bg-slate-800 text-white py-8 md:py-16 border-t border-gray-700">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8">


                    <div className="lg:col-span-4 md:col-span-2">
                        <div className="flex items-center mb-3">
                            <img src={logo} alt="logo" className="h-8 md:h-10" />
                            <span className="text-lg md:text-xl font-semibold ml-2">Byway</span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed mb-2">
                            Empowering learners through accessible and engaging online education.
                        </p>
                        <p className="text-gray-300 text-sm leading-relaxed max-w-full lg:max-w-sm">
                            Byway is a leading online learning platform dedicated to providing high-quality, flexible, and affordable educational experiences.
                        </p>
                    </div>


                    <div className="lg:col-span-2">
                        <h3 className="font-bold text-white mb-3 mt-4 md:mt-2">Get Help</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Contact Us</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Latest Articles</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">FAQ</a></li>
                        </ul>
                    </div>


                    <div className="lg:col-span-2">
                        <h3 className="font-bold text-white mb-3 mt-4 md:mt-2">Programs</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Art & Design</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Business</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">IT & Software</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Languages</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Programming</a></li>
                        </ul>
                    </div>


                    <div className="lg:col-span-4 md:col-span-2">
                        <h3 className="font-bold text-white mb-3 mt-4 md:mt-2">Contact Us</h3>
                        <div className="space-y-3 mb-4">
                            <p className="text-gray-300 text-sm">
                                <span className="font-medium">Address:</span> 123 Main Street, Anytown, CA 12345
                            </p>
                            <p className="text-gray-300 text-sm">
                                <span className="font-medium">Tel:</span> +(123) 456-7890
                            </p>
                            <p className="text-gray-300 text-sm">
                                <span className="font-medium">Mail:</span> bywayedu@webkul.in
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                                className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center hover:opacity-80 transition-all hover:scale-105">
                                <FaFacebookF className="text-white text-xs sm:text-sm" />
                            </a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                                className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center hover:opacity-80 transition-all hover:scale-105">
                                <FaGithub className="text-gray-800 text-xs sm:text-sm" />
                            </a>
                            <a href="https://www.google.com/" target="_blank" rel="noopener noreferrer"
                                className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center hover:opacity-80 transition-all hover:scale-105">
                                <FcGoogle className="text-xs sm:text-sm" />
                            </a>
                            <a href="https://x.com/" target="_blank" rel="noopener noreferrer"
                                className="w-7 h-7 sm:w-8 sm:h-8 bg-pink-500 rounded-full flex items-center justify-center hover:opacity-80 transition-all hover:scale-105">
                                <FaXTwitter className="text-white text-xs sm:text-sm" />
                            </a>
                            <a href="https://www.microsoft.com/ar-eg" target="_blank" rel="noopener noreferrer"
                                className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-700 rounded-full flex items-center justify-center hover:opacity-80 transition-all hover:scale-105">
                                <BsMicrosoft className="text-white text-xs sm:text-sm" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;