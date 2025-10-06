import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        const payload = JSON.parse(jsonPayload);
        return payload;
    } catch (error) {
        console.error('Invalid token in parseJwt:', error.message);
        return null;
    }
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const expiry = localStorage.getItem('expiry');

        if (token && storedUser && expiry) {
            const now = new Date();
            const expiryDate = new Date(expiry);

            if (now < expiryDate) {
                const payload = parseJwt(token);
                if (payload) {
                    const firstName = payload['FirstName'];
                    const isAdminClaim = payload['IsAdmin'] === 'True';
                    const role = isAdminClaim ? 'Admin' : 'User';
                    setUser({ firstName, role });
                } else {
                    logout();
                }
            } else {
                logout();
            }
        }

        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post('https://mohsenkhaled-001-site1.jtempurl.com/api/Auth/login', {
                email,
                password,
            });
            const { token, expiry, isAdmin, firstName } = response.data;

            if (!token) {
                throw new Error('No token received');
            }

            const payload = parseJwt(token);
            if (!payload) {
                throw new Error('Invalid token');
            }

            const role = isAdmin ? 'Admin' : 'User';
            const userData = { firstName, role };
            setUser(userData);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('expiry', expiry);

            return { success: true };
        } catch (error) {
            console.error('Login failed:', error.response?.data || error.message);
            return { success: false, error: error.response?.data || 'Login failed' };
        }
    };

    const googleLogin = async () => {
        try {
            const googleAuthUrl = 'https://mohsenkhaled-001-site1.jtempurl.com/api/ExternalAuth/google';
            window.location.href = googleAuthUrl;
            return { success: true };
        } catch (error) {
            console.error('Google login failed:', error.message);
            toast.error('Failed to initiate Google login');
            return { success: false, error: error.message || 'Google login failed' };
        }
    };

    const handleGoogleCallback = async (token, expiry, isAdmin) => {
        try {
            if (!token) {
                throw new Error('No token received');
            }

            const payload = parseJwt(token);
            if (!payload) {
                throw new Error('Invalid token');
            }

            const firstName = payload['FirstName'];
            const role = isAdmin ? 'Admin' : 'User';
            const userData = { firstName, role };
            setUser(userData);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('expiry', expiry);

            return { success: true };
        } catch (error) {
            console.error('Google callback failed:', error.message);
            toast.error('Google login failed');
            return { success: false, error: error.message || 'Google callback failed' };
        }
    };

    const signup = async (firstName, lastName, username, email, password, confirmPassword, isAdmin = false) => {
        try {
            const response = await axios.post('https://mohsenkhaled-001-site1.jtempurl.com/api/Auth/signup', {
                firstName,
                lastName,
                userName: username,
                email,
                password,
                confirmPassword,
                isAdmin
            });
            const { token, expiry, isAdmin: isAdminResponse, firstName: responseFirstName } = response.data;

            if (!token) {
                throw new Error('No token received');
            }

            const payload = parseJwt(token);
            if (!payload) {
                throw new Error('Invalid token');
            }

            const role = isAdminResponse ? 'Admin' : 'User';
            const userData = { firstName: responseFirstName, role };
            setUser(userData);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('expiry', expiry);

            return { success: true };
        } catch (error) {
            console.error('Signup failed:', error.response?.data || error.message);
            return { success: false, error: error.response?.data || 'Signup failed' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('expiry');
    };

    return (
        <AuthContext.Provider value={{ user, login, googleLogin, handleGoogleCallback, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};