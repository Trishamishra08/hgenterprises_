import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import CategoryNav from '../components/CategoryNav';
import OfferStrip from '../components/OfferStrip';
import Footer from '../components/Footer';

const UserLayout = () => {
    const location = useLocation();
    const isShopPage = location.pathname.includes('/shop');

    return (
        <div className="flex flex-col min-h-screen font-sans bg-background">
            <header className="sticky top-0 z-50 flex flex-col shrink-0 bg-white shadow-md">
                <TopBar />
                <Navbar />
                <CategoryNav />
                <OfferStrip />
            </header>
            <main className="flex-grow">
                <Outlet />
            </main>
            {!isShopPage && <Footer />}
        </div>
    );
};

export default UserLayout;
