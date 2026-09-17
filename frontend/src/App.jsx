

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './modules/user/components/Navbar';
import Footer from './modules/user/components/Footer';
import Home from './modules/user/pages/Home';
import Shop from './modules/user/pages/Shop';
import CollectionSubcategories from './modules/user/pages/CollectionSubcategories';
import Cart from './modules/user/pages/Cart';
import ProductDetails from './modules/user/pages/ProductDetails';
import Login from './modules/user/pages/Login';
import ServicesPage from './modules/user/pages/ServicesPage';
import Wishlist from './modules/user/pages/Wishlist';
import Profile from './modules/user/pages/Profile';
import AdminDashboard from './modules/admin/pages/Dashboard';
import AboutUs from './modules/user/pages/AboutUs';
import Checkout from './modules/user/pages/Checkout';
import OrderSuccess from './modules/user/pages/OrderSuccess';
import OrderTracking from './modules/user/pages/OrderTracking';
import HelpCenter from './modules/user/pages/HelpCenter';
import TermsAndConditions from './modules/user/pages/TermsAndConditions';
import PrivacyPolicy from './modules/user/pages/PrivacyPolicy';
import Notifications from './modules/user/pages/Notifications';
import AnnouncementBar from './modules/user/components/AnnouncementBar';
import BlogsPage from './modules/user/pages/BlogsPage';
import OffersPage from './modules/user/pages/OffersPage';
import OfferLandingPage from './modules/user/pages/OfferLandingPage';
import SmoothScroll from './components/SmoothScroll';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import WhatsAppButton from './modules/user/components/WhatsAppButton';



// Admin Imports
import AdminLogin from './modules/admin/pages/Login';
import AdminLayout from './modules/admin/components/AdminLayout';
import AdminProtectedRoute from './modules/admin/components/AdminProtectedRoute';
import CategoryPage from './modules/admin/pages/categories/CategoryPage';
import CategoryView from './modules/admin/pages/categories/CategoryView';
import SubcategoryManagement from './modules/admin/pages/SubcategoryManagement';
import SubcategoryView from './modules/admin/pages/SubcategoryView';
import ProductManagement from './modules/admin/pages/ProductManagement';
import ProductView from './modules/admin/pages/ProductView';
import ItemEditor from './modules/admin/pages/ItemEditor';
import SubcategoryAssets from './modules/admin/pages/SubcategoryAssets';
import OrderListPage from './modules/admin/pages/OrderListPage';
import OrderDetailPage from './modules/admin/pages/OrderDetailPage';
import ReturnDetailPage from './modules/admin/pages/ReturnDetailPage';
import ReturnsPage from './modules/admin/pages/ReturnsPage';
import ReplacementsPage from './modules/admin/pages/ReplacementsPage';
import ReplacementDetailPage from './modules/admin/pages/ReplacementDetailPage';
import InventoryPage from './modules/admin/pages/InventoryPage';
import StockAdjustmentPage from './modules/admin/pages/inventory/StockAdjustmentPage';
import StockHistoryPage from './modules/admin/pages/inventory/StockHistoryPage';
import LowStockAlertsPage from './modules/admin/pages/inventory/LowStockAlertsPage';
import InventoryReportsPage from './modules/admin/pages/inventory/InventoryReportsPage';
import UserManagement from './modules/admin/pages/UserManagement';
import UserView from './modules/admin/pages/UserView';
import ReviewModeration from './modules/admin/pages/ReviewModeration';
import SupportManagement from './modules/admin/pages/SupportManagement';
import ContactInquiries from './modules/admin/pages/ContactInquiries';
import BannerManagement from './modules/admin/pages/BannerManagement';
import OfferManagement from './modules/admin/pages/OfferManagement';
import GlobalNotificationManager from './modules/admin/pages/GlobalNotificationManager';
import AddNotification from './modules/admin/pages/AddNotification';
import FAQManagement from './modules/admin/pages/FAQManagement';
import ContentManagement from './modules/admin/pages/ContentManagement';
import BlogManagement from './modules/admin/pages/BlogManagement';
import CouponListPage from './modules/admin/pages/CouponListPage';
import CouponFormPage from './modules/admin/pages/CouponFormPage';
import GlobalSettings from './modules/admin/pages/GlobalSettings';
import SectionManagement from './modules/admin/pages/SectionManagement';
import SectionEditor from './modules/admin/pages/SectionEditor';
import DynamicPageEditor from './modules/admin/pages/DynamicPageEditor';
import PlatformSettingsPage from './modules/admin/pages/PlatformSettingsPage';

import SuggestionList from './modules/admin/pages/SuggestionList';
import SubscriptionList from './modules/admin/pages/SubscriptionList';
import CancellationPolicy from './modules/user/pages/CancellationPolicy';
import ShippingPolicy from './modules/user/pages/ShippingPolicy';
import ContactPage from './modules/user/pages/ContactPage';
import CareGuidePage from './modules/user/pages/CareGuidePage';
import CraftsmanshipPage from './modules/user/pages/CraftsmanshipPage';
import StoreLocator from './modules/user/pages/StoreLocator';
import ReturnsPolicy from './modules/user/pages/ReturnsPolicy';
import WarrantyInfo from './modules/user/pages/WarrantyInfo';
import CustomizationPage from './modules/user/pages/CustomizationPage';
import VideoCallLobby from './modules/user/pages/VideoCallLobby';
import VideoCallRoom from './modules/user/pages/VideoCallRoom';
import VideoCallCart from './modules/user/pages/VideoCallCart';
import VideoCallSchedule from './modules/user/pages/VideoCallSchedule';
import VideoCallBookings from './modules/user/pages/VideoCallBookings';
import AdminVideoCalls from './modules/admin/pages/AdminVideoCalls';

const ScrollToTop = () => {
  const { pathname, key } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, key]);
  return null;
};

const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const isCallPath = location.pathname.startsWith('/call/');
  const noFooterPaths = ['/about', '/blogs', '/help', '/order-tracking', '/profile', '/offers', '/video-call'];
  const hideFooter = isAdminPath || isCallPath || noFooterPaths.some(path => location.pathname.startsWith(path));
  const hideChrome = isAdminPath || isCallPath;

  return (
    <SmoothScroll>
      <div className={`min-h-screen flex flex-col font-sans text-gray-900 ${!isAdminPath && !isCallPath ? 'bg-[#FDF5F6]' : isCallPath ? 'bg-[#1a0f10]' : 'bg-gray-50'}`}>
        <ScrollToTop />
        {!hideChrome && (
          <>
            <div className="sticky top-0 z-[100] w-full bg-white">
              <AnnouncementBar />
              <Navbar />
            </div>
            <WhatsAppButton />
          </>
        )}
        <main className={`flex-grow ${!hideChrome ? 'pb-16 md:pb-0' : ''}`}>
          <Routes>
            {/* User Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/collection/:categoryId" element={<CollectionSubcategories />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/order-tracking/:orderId/:view?" element={<OrderTracking />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Login />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile/:activeTab?/:subId?" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/returns" element={<ReturnsPolicy />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/cancellation-policy" element={<CancellationPolicy />} />
            <Route path="/care-guide" element={<CareGuidePage />} />
            <Route path="/warranty-info" element={<WarrantyInfo />} />
            <Route path="/customization" element={<CustomizationPage />} />
            <Route path="/stores" element={<StoreLocator />} />
            <Route path="/services/:category/:slug" element={<ServicesPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/craft" element={<CraftsmanshipPage />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/new-arrivals" element={<Shop />} />
            <Route path="/trending" element={<Shop />} />
            <Route path="/category/:category" element={<Shop />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/offers/:slug" element={<OfferLandingPage />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/video-call" element={<VideoCallLobby />} />
            <Route path="/video-call-cart" element={<VideoCallCart />} />
            <Route path="/video-call/schedule" element={<VideoCallSchedule />} />
            <Route path="/video-call/bookings" element={<VideoCallBookings />} />
            <Route path="/call/:callId" element={<VideoCallRoom />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/categories" element={<CategoryPage />} />
                    <Route path="/categories/view/:id" element={<CategoryView />} />
                    <Route path="/categories/new" element={<ItemEditor />} />
                    <Route path="/categories/edit/:id" element={<ItemEditor />} />
                    <Route path="/subcategories" element={<SubcategoryManagement />} />
                    <Route path="/subcategories/view/:id" element={<SubcategoryView />} />
                    <Route path="/subcategories/new" element={<ItemEditor />} />
                    <Route path="/subcategories/edit/:id" element={<ItemEditor />} />
                    <Route path="/category-assets" element={<SubcategoryAssets />} />
                    <Route path="/products" element={<ProductManagement />} />
                    <Route path="/products/view/:id" element={<ItemEditor />} />
                    <Route path="/products/new" element={<ItemEditor />} />
                    <Route path="/products/edit/:id" element={<ItemEditor />} />
                    <Route path="/coupons" element={<CouponListPage />} />
                    <Route path="/offers" element={<OfferManagement />} />
                    <Route path="/coupons/add" element={<CouponFormPage />} />
                    <Route path="/coupons/edit/:id" element={<CouponFormPage />} />
                    <Route path="/orders" element={<OrderListPage />} />
                    <Route path="/orders/:id" element={<OrderDetailPage />} />
                    <Route path="/returns" element={<ReturnsPage />} />
                    <Route path="/returns/:id" element={<ReturnDetailPage />} />
                    <Route path="/replacements" element={<ReplacementsPage />} />
                    <Route path="/replacements/:id" element={<ReplacementDetailPage />} />
                    <Route path="/inventory" element={<InventoryPage />} />
                    <Route path="/inventory/adjust" element={<StockAdjustmentPage />} />
                    <Route path="/inventory/history" element={<StockHistoryPage />} />
                    <Route path="/inventory/alerts" element={<LowStockAlertsPage />} />
                    <Route path="/inventory/reports" element={<InventoryReportsPage />} />
                    <Route path="/users" element={<UserManagement />} />
                    <Route path="/users/view/:id" element={<UserView />} />
                    <Route path="/video-calls" element={<AdminVideoCalls />} />
                    <Route path="/suggestions" element={<SuggestionList />} />
                    <Route path="/subscriptions" element={<SubscriptionList />} />
                    <Route path="/reviews" element={<ReviewModeration />} />
                    <Route path="/support" element={<SupportManagement />} />
                    <Route path="/support/inquiries" element={<ContactInquiries />} />
                    <Route path="/banners" element={<BannerManagement />} />
                    <Route path="/notifications" element={<GlobalNotificationManager />} />
                    <Route path="/notifications/add" element={<AddNotification />} />
                    <Route path="/faq" element={<FAQManagement />} />
                    <Route path="/about-us" element={<ContentManagement />} />
                    <Route path="/blogs" element={<BlogManagement />} />
                    <Route path="/sections" element={<SectionManagement />} />
                    <Route path="/sections/:id" element={<SectionEditor />} />
                    <Route path="/pages/:pageId" element={<DynamicPageEditor />} />
                    <Route path="/settings" element={<GlobalSettings />} />
                    <Route path="/platform-settings" element={<PlatformSettingsPage />} />

                  </Routes>
                </AdminLayout>
              </AdminProtectedRoute>
            } />

            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        {!hideFooter && <Footer />}
      </div>
    </SmoothScroll>
  );
};

function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <Router>
          <AppContent />
        </Router>
      </ShopProvider>
    </AuthProvider>
  );
}

export default App;
