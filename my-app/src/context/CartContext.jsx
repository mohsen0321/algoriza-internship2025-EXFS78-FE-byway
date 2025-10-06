import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);


    const fetchCartCount = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setCartCount(0);
            return;
        }

        try {
            const response = await axios.get("https://mohsenkhaled-001-site1.jtempurl.com/api/Cart", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCartCount(response.data.length);
        } catch (err) {
            console.error("Failed to fetch cart count:", err);
            setCartCount(0);
        }
    }, []);

    useEffect(() => {
        fetchCartCount();
    }, [fetchCartCount]);

    const addToCart = async (courseId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            return { success: false, error: "No token found" };
        }

        try {
            await axios.post(
                "https://mohsenkhaled-001-site1.jtempurl.com/api/Cart",
                { courseId: parseInt(courseId) },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setCartCount(prev => prev + 1);
            return { success: true };
        } catch (err) {
            console.error("Error adding to cart:", err);
            return { success: false, error: err };
        }
    };

    const removeFromCart = async (itemId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            return { success: false, error: "No token found" };
        }

        try {
            await axios.delete(`https://mohsenkhaled-001-site1.jtempurl.com/api/Cart/${itemId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setCartCount(prev => Math.max(0, prev - 1));
            return { success: true };
        } catch (err) {
            console.error("Error removing from cart:", err);
            return { success: false, error: err };
        }
    };

    return (
        <CartContext.Provider value={{
            cartCount,
            setCartCount,
            addToCart,
            removeFromCart,
            fetchCartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};