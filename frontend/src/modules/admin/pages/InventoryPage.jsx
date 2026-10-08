import React from 'react';
import { Package } from 'lucide-react';

const InventoryPage = () => {
    return (
        <div className="flex flex-col items-center justify-center p-20 text-center animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6 border border-gray-100">
                <Package size={48} />
            </div>
            <h1 className="text-2xl font-serif font-black text-footerBg mb-2 uppercase tracking-widest">Inventory Management</h1>
            <p className="text-gray-400 font-bold text-sm mb-6 uppercase tracking-widest">Track stock levels and adjustments.</p>
            <p className="text-[10px] font-black text-white bg-footerBg px-4 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-footerBg/20">🚧 Feature Coming Soon</p>
        </div>
    );
};

export default InventoryPage;
