import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const AdminProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return null; // Or a loading spinner

    if (!user || user.role !== 'admin') {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};


export default AdminProtectedRoute;
