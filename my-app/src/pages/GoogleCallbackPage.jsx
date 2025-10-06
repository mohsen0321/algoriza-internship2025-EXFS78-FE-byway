import React, { useEffect, useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const GoogleCallbackPage = () => {
    const { handleGoogleCallback } = useContext(AuthContext);
    const location = useLocation();
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const handleCallback = async () => {
            try {
                const query = new URLSearchParams(location.search);
                const token = query.get('token');
                const expiry = query.get('expiry');
                const isAdmin = query.get('isAdmin') === 'true';

                console.log('Query Parameters:', { token, expiry, isAdmin });

                if (!token || !expiry) {
                    console.error('Missing token or expiry in query parameters');
                    throw new Error('Invalid callback parameters');
                }

                const result = await handleGoogleCallback(token, expiry, isAdmin);
                console.log('handleGoogleCallback result:', result);

                if (result.success) {
                    console.log('Google login successful, navigating to home');
                    toast.success('Successfully logged in with Google');
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 500);
                    return;
                } else {
                    throw new Error(result.error || 'Google login failed');
                }
            } catch (error) {
                console.error('Google callback error:', error.message);
                toast.error(error.message || 'Google login failed ❌');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 500);
            }
        };

        handleCallback();
    }, [handleGoogleCallback, location.search]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">Processing Google Login...</h2>
            </div>
        </div>
    );
};

export default GoogleCallbackPage;