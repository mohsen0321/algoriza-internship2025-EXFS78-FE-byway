import React, { useState, useContext } from 'react';
import { ArrowRight, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import signupimage from './Homeimages/signuppage.jpg';
import { toast } from "react-toastify";

export default function SignUpPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        isAdmin: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup, googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            toast.error("❌ Passwords do not match");
            setLoading(false);
            return;
        }

        const { firstName, lastName, username, email, password, confirmPassword, isAdmin } = formData;
        const result = await signup(firstName, lastName, username, email, password, confirmPassword, isAdmin);

        setLoading(false);
        if (result.success) {
            toast.success("✅ Account created successfully!");
            navigate('/');
        } else {
            if (typeof result.error === 'string') {
                toast.error(`❌ ${result.error}`);
            } else if (Array.isArray(result.error)) {
                toast.error(result.error.map(err => err.description).join(', '));
            } else {
                toast.error("❌ Signup failed. Please try again.");
            }
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        const result = await googleLogin();
        setLoading(false);
        if (result.success) {
        } else {
            toast.error(result.error || "Google signup failed ❌");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex mt-14">
            <div className="hidden lg:block relative w-[500px] bg-gray-100">
                <div className="absolute inset-0">
                    <img
                        className="h-full w-full max-w-[500px] object-cover"
                        src={signupimage}
                        alt="Workspace with laptop, hands typing, and office supplies"
                    />
                </div>
            </div>

            <div className="flex-1 flex items-center mt-8 justify-center pl-10 pr-10">
                <div className="w-full space-y-8">
                    <div className="text-center relative mt-10 sm:mt-0">
                        <Link
                            to="/"
                            className="absolute hidden sm:inline left-4 top-4 md:flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
                        >
                            <Home className="w-6 h-6" />
                        </Link>

                        <h2 className="text-4xl font-bold text-gray-900 mb-2">
                            Create Your Account
                        </h2>

                        {error && <p className="text-red-500 text-sm">{error}</p>}
                    </div>

                    <form className="mt-8 space-y-6 w-full" onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="firstName"
                                        className="block text-sm font-bold text-gray-900 mb-2"
                                    >
                                        Full Name
                                    </label>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        required
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                                        placeholder="First Name"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="lastName"
                                        className="block text-sm font-bold text-gray-900 mb-2 "
                                    >
                                        Last Name
                                    </label>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        required
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                                        placeholder="Last Name"
                                    />
                                </div>
                            </div>

                            <div className="w-full">
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-bold text-gray-900 mb-2"
                                >
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                                    placeholder="Username"
                                />
                            </div>

                            <div className="w-full">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-bold text-gray-900 mb-2"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                                    placeholder="Email ID"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-bold text-gray-900 mb-2"
                                    >
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                                        placeholder="Enter Password"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-sm font-bold text-gray-900 mb-2"
                                    >
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                                        placeholder="Confirm Password"
                                    />
                                </div>
                            </div>

                            <div className="w-full flex items-center">
                                <input
                                    id="isAdmin"
                                    name="isAdmin"
                                    type="checkbox"
                                    checked={formData.isAdmin}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="isAdmin"
                                    className="ml-2 block text-sm font-medium text-gray-900"
                                >
                                    Admin Account
                                </label>
                            </div>
                        </div>

                        <div className="w-full">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex justify-center max-w-[200px] items-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800'
                                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all hover:scale-105 cursor-pointer w-full`}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </button>
                        </div>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-2 border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-gray-50 text-gray-500">Sign up with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                        <button
                            type="button"
                            className="w-full inline-flex mb-4 justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all hover:scale-105 cursor-pointer"
                            disabled={loading}
                        >
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="#1877F2"
                                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                                    />
                                </svg>
                                <span>Facebook</span>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full mb-4 inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all hover:scale-105 cursor-pointer"
                            disabled={loading}
                        >
                            <div className="flex items-center gap-2">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M22.56 12.75C22.56 11.97 22.49 11.22 22.36 10.5H12V14.76H17.92C17.66 16.13 16.88 17.29 15.71 18.07V20.84H19.28C21.36 18.92 22.56 16.1 22.56 12.75Z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M11.9999 23.5001C14.9699 23.5001 17.4599 22.5201 19.2799 20.8401L15.7099 18.0701C14.7299 18.7301 13.4799 19.1301 11.9999 19.1301C9.13993 19.1301 6.70993 17.2001 5.83993 14.6001H2.17993V17.4401C3.98993 21.0301 7.69993 23.5001 11.9999 23.5001Z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.5901C5.62 13.9301 5.49 13.2301 5.49 12.5001C5.49 11.7701 5.62 11.0701 5.84 10.4101V7.57007H2.18C1.43 9.05007 1 10.7201 1 12.5001C1 14.2801 1.43 15.9501 2.18 17.4301L5.03 15.2101L5.84 14.5901Z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M11.9999 5.88C13.6199 5.88 15.0599 6.44 16.2099 7.52L19.3599 4.37C17.4499 2.59 14.9699 1.5 11.9999 1.5C7.69993 1.5 3.98993 3.97 2.17993 7.57L5.83993 10.41C6.70993 7.81 9.13993 5.88 11.9999 5.88Z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                <span className="text-red-500 font-semibold">Google</span>
                            </div>
                        </button>

                        <button
                            type="button"
                            className="w-full mb-4 inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all hover:scale-105 cursor-pointer"
                            disabled={loading}
                        >
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#F25022" d="M0 0h11.377v11.372H0z" />
                                    <path fill="#00BCF2" d="M12.623 0H24v11.372H12.623z" />
                                    <path fill="#00D427" d="M0 12.623h11.377V24H0z" />
                                    <path fill="#FFBA08" d="M12.623 12.623H24V24H12.623z" />
                                </svg>
                                <span>Microsoft</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}