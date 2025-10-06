import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Home } from 'lucide-react';
import loginimage from './Homeimages/loginimage.jpg';
import microsoft from './Homeimages/microsoft.png';
import Facebook from './Homeimages/facebook.png';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await login(email, password);
        if (result.success) {
            toast.success("You have successfully logged in");
            navigate('/');
        } else {
            toast.error(result.error || "Login failed ❌");
        }
    };

    const handleGoogleLogin = async () => {
        const result = await googleLogin();
        if (!result.success) {
            toast.error(result.error || "Google login failed ❌");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex mt-20 sm:mt-0">
            <div className="flex-1 flex items-center justify-start sm:-ml-2 pl-14 pr-10">
                <div className="w-full space-y-8">
                    <div className="text-center relative">
                        <Link
                            to="/"
                            className="hidden lg:flex absolute top-4 items-center gap-2 text-gray-700 hover:text-blue-600 transition"
                        >
                            <span><Home /></span>
                        </Link>

                        <h2 className="text-4xl font-bold text-gray-900 mb-2">
                            Sign in to your account
                        </h2>
                    </div>
                    <form className="mt-8 space-y-6 w-full" onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div className="w-full">
                                <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                                    placeholder="Username or Email ID"
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="password" className="block text-sm font-bold text-gray-900 mb-2">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                                    placeholder="Enter Password"
                                />
                            </div>
                        </div>
                        <div className="w-full">
                            <button
                                type="submit"
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all hover:scale-105 cursor-pointer"
                            >
                                Sign In
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </button>
                        </div>
                    </form>
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-2 border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-gray-50 text-gray-500">Sign in with</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 w-full">
                        <button
                            type="button"
                            className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all hover:scale-105 cursor-pointer"
                        >
                            <span className="flex gap-2">
                                <img src={Facebook} alt="Facebook" className="h-5" /> Facebook
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all hover:scale-105 cursor-pointer"
                        >
                            <svg
                                width="24"
                                height="25"
                                viewBox="0 0 24 25"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M22.56 12.75C22.56 11.97 22.49 11.22 22.36 10.5H12V14.76H17.92C17.66 16.13 16.88 17.29 15.71 18.07V20.84H19.28C21.36 18.92 22.56 16.1 22.56 12.75Z" fill="#4285F4" />
                                <path d="M11.9999 23.5001C14.9699 23.5001 17.4599 22.5201 19.2799 20.8401L15.7099 18.0701C14.7299 18.7301 13.4799 19.1301 11.9999 19.1301C9.13993 19.1301 6.70993 17.2001 5.83993 14.6001H2.17993V17.4401C3.98993 21.0301 7.69993 23.5001 11.9999 23.5001Z" fill="#34A853" />
                                <path d="M5.84 14.5901C5.62 13.9301 5.49 13.2301 5.49 12.5001C5.49 11.7701 5.62 11.0701 5.84 10.4101V7.57007H2.18C1.43 9.05007 1 10.7201 1 12.5001C1 14.2801 1.43 15.9501 2.18 17.4301L5.03 15.2101L5.84 14.5901Z" fill="#FBBC05" />
                                <path d="M11.9999 5.88C13.6199 5.88 15.0599 6.44 16.2099 7.52L19.3599 4.37C17.4499 2.59 14.9699 1.5 11.9999 1.5C7.69993 1.5 3.98993 3.97 2.17993 7.57L5.83993 10.41C6.70993 7.81 9.13993 5.88 11.9999 5.88Z" fill="#EA4335" />
                            </svg>
                            <span className="text-red-500 font-semibold ml-2">Google</span>
                        </button>

                        <button
                            type="button"
                            className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all hover:scale-105 cursor-pointer"
                        >
                            <span>
                                <img src={microsoft} alt="Microsoft" className="h-5" />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="hidden lg:block relative flex-1 bg-gray-100">
                <div className="absolute inset-0">
                    <img
                        className="h-full w-full object-cover"
                        src={loginimage}
                        alt="Online learning workspace with computer and student"
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;