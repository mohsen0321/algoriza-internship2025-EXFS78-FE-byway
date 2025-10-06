import React, { useState, useEffect, useContext } from 'react';
import { ChevronRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';

const ShoppingCart = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const { removeFromCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCartItems = async () => {
            if (authLoading) return;

            const token = localStorage.getItem('token');
            if (!user && !token) {
                setError('Please log in to show your cart.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('https://mohsenkhaled-001-site1.jtempurl.com/api/Cart', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Fetch images for each cart item
                const cartItemsWithImages = await Promise.all(
                    response.data.map(async (item) => {
                        try {
                            const imageResponse = await axios.get(
                                `https://mohsenkhaled-001-site1.jtempurl.com/api/Courses/${item.courseId}/image`,
                                { responseType: 'blob' }
                            );
                            return {
                                ...item,
                                image: URL.createObjectURL(imageResponse.data),
                            };
                        } catch {
                            return {
                                ...item,
                                image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=200&fit=crop', // Fallback image
                            };
                        }
                    })
                );

                setCartItems(cartItemsWithImages);
                setError('');
            } catch (err) {
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    toast.error('Session expired. Please log in again.');
                } else {
                    setError('Failed to load cart items.');
                    toast.error('Failed to load cart items.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [user, authLoading, navigate]);

    // Cleanup blob URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            cartItems.forEach((item) => {
                if (item.image && item.image.startsWith('blob:')) {
                    URL.revokeObjectURL(item.image);
                }
            });
        };
    }, [cartItems]);

    const handleRemove = async (id) => {
        try {
            const result = await removeFromCart(id);
            if (result.success) {
                setCartItems(cartItems.filter((item) => item.id !== id));
                toast.success('Course removed from cart successfully!');
            } else {
                toast.error('Failed to remove course from cart.');
            }
        } catch {
            toast.error('Failed to remove course from cart.');
        }
    };

    const calculateOrderDetails = () => {
        const price = cartItems.reduce((sum, item) => sum + item.price, 0);
        const tax = price * 0.15;
        const total = price + tax;
        return { price, discount: 0, tax, total };
    };

    const orderDetails = calculateOrderDetails();

    const handleCheckout = () => {
        if (!user) {
            navigate('/login');
            toast.error('Please log in to proceed to checkout.');
            return;
        }

        if (orderDetails.total === 0) {
            toast.error('Please buy a course to check out.');
            return;
        }

        navigate('/checkoutpage');
    };

    const renderStars = (rating) => (
        <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => (
                <Star
                    key={index}
                    className={`w-3 h-3 ${index < Math.floor(rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : index < rating
                            ? 'fill-yellow-400/50 text-yellow-400'
                            : 'fill-gray-200 text-gray-200'
                        }`}
                />
            ))}
        </div>
    );

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">Loading cart...</div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 p-4">
                <p>{error}</p>
                <button
                    onClick={() => navigate('/login')}
                    className="mt-2 text-blue-500 underline"
                >
                    Log In
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen mt-16 bg-gray-50 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
                    <h1 className="text-3xl sm:text-4xl font-semibold flex-1">Shopping Cart</h1>
                    <span className="text-sm flex items-center gap-2 text-gray-600 whitespace-nowrap">
                        Courses <ChevronRight size={15} /> Details <ChevronRight size={15} />{' '}
                        <span className="text-blue-600">Shopping Cart</span>
                    </span>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-6 border-b border-gray-200 pb-3">
                            {cartItems.length} {cartItems.length === 1 ? 'Course' : 'Courses'} in cart
                        </p>

                        <div className="space-y-4">
                            {cartItems.length > 0 ? (
                                cartItems.map((item) => (
                                    <div key={item.id} className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow">
                                        <div className="relative flex-shrink-0 w-full sm:w-32 h-20">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover rounded"
                                                onError={(e) => {
                                                    e.target.src = 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=200&fit=crop';
                                                }}
                                            />
                                        </div>
                                        <div className="flex flex-col flex-1 justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                                <p className="text-sm text-gray-600">By {item.instructor}</p>
                                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                    <span className="text-sm font-semibold text-yellow-500">{item.rating.toFixed(1)}</span>
                                                    {renderStars(item.rating)}
                                                    <span className="text-xs text-gray-500">
                                                        {item.totalHours} Total Hours. {item.lectures} Lectures. All levels
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemove(item.id)}
                                                className="text-sm text-red-500 hover:underline mt-2 self-start"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <div className="text-lg font-bold self-start sm:self-center whitespace-nowrap mt-2 sm:mt-0">
                                            ${item.price.toFixed(2)}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-600">Your cart is empty.</p>
                            )}
                        </div>
                    </div>
                    <div className="w-full max-w-md bg-white rounded-lg p-6 shadow flex-shrink-0">
                        <h2 className="text-lg font-semibold mb-6">Order Details</h2>
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Price</span>
                                <span className="font-semibold">${orderDetails.price.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Discount</span>
                                <span className="font-semibold">${orderDetails.discount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tax</span>
                                <span className="font-semibold">${orderDetails.tax.toFixed(2)}</span>
                            </div>
                            <hr className="my-4" />
                            <div className="flex justify-between text-lg">
                                <span className="font-semibold">Total</span>
                                <span className="font-bold">${orderDetails.total.toFixed(2)}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:scale-105 cursor-pointer hover:bg-gray-800 transition-all"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCart;