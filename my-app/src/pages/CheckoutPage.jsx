import { ChevronRight } from 'lucide-react';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import visaimage from '../images/visaimage.png';
import paypalimage from '../images/paypal.png';

export default function CheckoutPage() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('credit');
    const [formData, setFormData] = useState({
        country: '',
        state: '',
        cardName: '',
        cardNumber: '',
        expiryDate: '',
        cvc: '',
        coupon: ''
    });
    const [errors, setErrors] = useState({});
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCartData = async () => {
            if (authLoading) return;

            if (!user) {
                navigate('/login');
                toast.error('Please log in to proceed to checkout.');
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const cartResponse = await axios.get('https://mohsenkhaled-001-site1.jtempurl.com/api/Cart', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('Cart items:', cartResponse.data);
                setCartItems(cartResponse.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching cart data:', err);
                toast.error('Failed to load cart data.');
                setLoading(false);
            }
        };
        fetchCartData();
    }, [user, authLoading, navigate]);

    const calculateOrderDetails = () => {
        const price = cartItems.reduce((sum, item) => sum + item.price, 0);
        const tax = price * 0.15;
        const total = price + tax;
        return { price, discount: 0, tax, total };
    };
    const orderDetails = calculateOrderDetails();

    const validateForm = () => {
        const newErrors = {};
        if (!formData.country.trim())
            newErrors.country = 'Country is required. Please enter your country.';
        if (!formData.state.trim())
            newErrors.state = 'State is required. Please enter your state or union territory.';
        if (paymentMethod === 'credit') {
            if (!formData.cardName.trim())
                newErrors.cardName = 'Card name is required. Please enter the name on the card.';
            if (!formData.cardNumber.trim())
                newErrors.cardNumber = 'Card number is required. Please enter your 16-digit card number.';
            else if (!/^\d{16}$/.test(formData.cardNumber))
                newErrors.cardNumber = 'Card number must be exactly 16 digits. Please enter a valid card number without spaces or dashes.';
            if (!formData.expiryDate.trim())
                newErrors.expiryDate = 'Expiry date is required. Please enter MM/YY format.';
            else if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(formData.expiryDate))
                newErrors.expiryDate = 'Invalid expiry date. Please enter in MM/YY format (e.g., 09/25).';
            if (!formData.cvc.trim())
                newErrors.cvc = 'CVC is required. Please enter the 3-4 digit code on the back of your card.';
            else if (!/^\d{3,4}$/.test(formData.cvc))
                newErrors.cvc = 'CVC must be 3 or 4 digits. Please enter a valid CVC.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const handleCheckout = async () => {
        if (!validateForm()) {
            toast.error('Please fill all required fields correctly.');
            return;
        }

        if (cartItems.length === 0) {
            toast.error('No courses in cart to process payment.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            for (const item of cartItems) {
                const paymentData = {
                    CourseId: item.courseId || item.id,
                    country: formData.country,
                    state: formData.state,
                    cardName: paymentMethod === 'credit' ? formData.cardName : '',
                    cardNumber: paymentMethod === 'credit' ? formData.cardNumber : '',
                    expiryDate: paymentMethod === 'credit' ? formData.expiryDate : '',
                    cvc: paymentMethod === 'credit' ? formData.cvc : '',
                    paymentMethod: paymentMethod === 'credit' ? 'Credit' : 'PayPal',
                    total: item.price * 1.15,
                    paymentDate: new Date().toISOString()
                };

                console.log('Sending payment data:', paymentData);
                const response = await axios.post('https://mohsenkhaled-001-site1.jtempurl.com/api/Payment', paymentData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('Payment response:', response.data);
            }

            toast.success('Payment processed successfully!');
            navigate('/thanks');
        } catch (err) {
            console.error('Payment error:', err.response?.data);
            toast.error(`Failed to process payment: ${err.response?.data?.message || 'Unknown error'}`);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading checkout...
            </div>
        );
    }
    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 p-4">
                Please log in to proceed.
                <button
                    onClick={() => navigate('/login')}
                    className="mt-2 text-blue-500 underline"
                >
                    Go to Login
                </button>
            </div>
        );
    }
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 p-4">
                Your cart is empty.
                <button
                    onClick={() => navigate('/coursespage')}
                    className="mt-2 text-blue-500 underline"
                >
                    Browse Courses
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen mt-20 p-4 sm:p-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6 px-2 sm:px-6">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                        <span>Details</span>
                        <ChevronRight size={15} className="mt-1" />
                        <span>Shopping Cart</span>
                        <ChevronRight size={15} className="mt-1" />
                        <span className="text-blue-600">Checkout</span>
                    </div>
                    <h1 className="text-3xl font-semibold text-black mt-4">Checkout Page</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 bg-white border border-gray-300 rounded-2xl p-6">
                        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-lg font-semibold text-black mb-2">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    placeholder="Enter Country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-3 border placeholder:text-gray-400 rounded-lg focus:outline-none ${errors.country ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                                        } text-sm text-black font-medium`}
                                />
                                {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                            </div>
                            <div>
                                <label className="block text-lg font-semibold text-black mb-2">State/Union Territory</label>
                                <input
                                    type="text"
                                    name="state"
                                    placeholder="Enter State"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-3 border placeholder:text-gray-400 rounded-lg focus:outline-none ${errors.state ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                                        } text-sm text-black font-medium`}
                                />
                                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-black mb-4">Payment Method</h3>

                            <div className="mb-6 bg-[#f2f5f8] p-4 rounded-2xl">
                                <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
                                    <label className="flex items-center flex-1 sm:flex-none">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="credit"
                                            checked={paymentMethod === 'credit'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4 text-blue-600 mr-3"
                                        />
                                        <span className="text-sm font-semibold text-black">Credit/Debit Card</span>
                                    </label>
                                    <div>
                                        <img src={visaimage} className="w-20" alt="visaimage" />
                                    </div>
                                </div>

                                {paymentMethod === 'credit' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold mb-1">Name of Card</label>
                                            <input
                                                type="text"
                                                name="cardName"
                                                placeholder="Name of card"
                                                value={formData.cardName}
                                                onChange={handleInputChange}
                                                className={`w-full px-3 py-3 border bg-white placeholder:text-gray-400 rounded-lg focus:outline-none ${errors.cardName ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                                                    } text-sm text-black font-medium`}
                                            />
                                            {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold mb-1">Card Number</label>
                                            <input
                                                type="text"
                                                name="cardNumber"
                                                placeholder="Card Number - 16 digits required"
                                                value={formData.cardNumber}
                                                onChange={handleInputChange}
                                                className={`w-full px-3 py-3 border bg-white placeholder:text-gray-400 rounded-lg focus:outline-none ${errors.cardNumber ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                                                    } text-sm text-black font-medium`}
                                            />
                                            {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold mb-1">Expiry Date</label>
                                                <input
                                                    type="text"
                                                    name="expiryDate"
                                                    placeholder="MM/YY"
                                                    value={formData.expiryDate}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-3 py-3 border bg-white placeholder:text-gray-400 rounded-lg focus:outline-none ${errors.expiryDate ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                                                        } text-sm text-black font-medium`}
                                                />
                                                {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold mb-1">CVC/CVV</label>
                                                <input
                                                    type="text"
                                                    name="cvc"
                                                    placeholder="CVC"
                                                    value={formData.cvc}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-3 py-3 border bg-white placeholder:text-gray-400 rounded-lg focus:outline-none ${errors.cvc ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                                                        } text-sm text-black font-medium`}
                                                />
                                                {errors.cvc && <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center bg-[#f2f5f8] p-3 rounded-lg justify-between mt-6">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="paypal"
                                        checked={paymentMethod === 'paypal'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4 text-blue-600 mr-3"
                                    />
                                    <span className="text-lg font-semibold text-black">PayPal</span>
                                </label>
                                <img src={paypalimage} className="w-20" alt="paypalimage" />
                            </div>
                        </div>
                    </div>
                    <div className="w-full max-w-md space-y-6">
                        <div className="bg-white border border-gray-300 rounded-lg p-6">
                            <h3 className="font-medium mb-4 text-black">Order Details ({cartItems.length})</h3>
                            <div className="bg-gray-50 px-4 py-3 border rounded border-gray-200 space-y-3 max-h-48 overflow-auto">
                                {cartItems.length > 0 ? (
                                    cartItems.map((item, index) => (
                                        <div key={index} className="text-sm text-gray-700 border-b border-gray-200 pb-3 last:border-b-0 truncate" title={item.title}>
                                            {item.title}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-gray-700">No courses in cart.</div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white border border-gray-300 rounded-lg p-4">
                            <input
                                type="text"
                                name="coupon"
                                placeholder="Enter Coupon Code"
                                value={formData.coupon}
                                onChange={handleInputChange}
                                className="w-full px-3 py-3 border placeholder:text-gray-400 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm text-black font-medium"
                            />
                        </div>

                        <div className="bg-gray-50 border border-gray-300 rounded-lg">
                            <div className="px-4 py-4 space-y-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Price</span>
                                    <span className="text-black font-bold">${orderDetails.price.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Discount</span>
                                    <span className="text-black font-bold">${orderDetails.discount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="text-black font-bold">${orderDetails.tax.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="px-4 py-3 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-black">Total</span>
                                    <span className="font-bold text-black text-lg">${orderDetails.total.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="px-4 pb-4">
                                <button
                                    onClick={handleCheckout}
                                    className="w-full py-3 text-sm font-medium rounded-lg transition-all hover:scale-105 cursor-pointer bg-gray-900 text-white hover:bg-gray-800"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}