import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('hg_token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await api.get('/auth/profile');
                setUser(res.data);
            } catch (error) {
                console.error("Token verification failed:", error);
                localStorage.removeItem('hg_token');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            const { token, user: userData } = res.data;

            localStorage.setItem('hg_token', token);
            setUser(userData);
            return { success: true };
        } catch (error) {
            console.error("Login Error:", error);
            return { success: false, message: error.response?.data?.message || 'Invalid credentials' };
        }
    };

    const signup = async (userData) => {
        try {
            const res = await api.post('/auth/signup', userData);
            const { token, user: newUser } = res.data;

            localStorage.setItem('hg_token', token);
            setUser(newUser);
            return { success: true };
        } catch (error) {
            console.error("Signup Error:", error);
            return { success: false, message: error.response?.data?.message || 'Signup failed' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('hg_token');
    };

    const sendOTP = async (phone) => {
        try {
            const res = await api.post('/auth/otp/send', { phone });
            return { success: true, exists: res.data.exists };
        } catch (error) {
            console.error('OTP Send Error:', error);
            const isNetwork = !error.response;
            return {
                success: false,
                message: isNetwork
                    ? 'Cannot reach server. Please try again in a moment.'
                    : (error.response?.data?.message || 'Failed to send OTP'),
            };
        }
    };

    const verifyOTP = async (otpData) => {
        try {
            const res = await api.post('/auth/otp/verify', otpData);
            const { token, user: userData } = res.data;

            localStorage.setItem('hg_token', token);
            setUser(userData);
            return { success: true };
        } catch (error) {
            console.error('OTP Verify Error:', error);
            const isNetwork = !error.response;
            return {
                success: false,
                message: isNetwork
                    ? 'Cannot reach server. Please try again in a moment.'
                    : (error.response?.data?.message || 'Invalid OTP'),
            };
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, signup, logout, sendOTP, verifyOTP, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
