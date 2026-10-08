import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import { useShop } from '../../../context/ShopContext';
import api from '../../../utils/api';
import toast from 'react-hot-toast';

const CategoryManagement = () => {
    const navigate = useNavigate();
    const { categories, setCategories } = useShop();
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await api.delete(`/categories/${id}`);
                setCategories(prev => (prev || []).filter(cat => (cat.id || cat._id) !== id));
                toast.success("Category deleted");
            } catch (error) {
                toast.error("Failed to delete category");
            }
        }
    };

    const toggleVisibility = async (id, field) => {
        try {
            const cat = (categories || []).find(c => (c.id || c._id) === id);
            const updatedValue = !cat[field];

            // Optimistic update
            setCategories(prev => (prev || []).map(c =>
                (c.id || c._id) === id ? { ...c, [field]: updatedValue } : c
            ));

            await api.patch(`/categories/${id}`, { [field]: updatedValue });
            toast.success(`${field} updated`);
        } catch (error) {
            toast.error("Failed to update visibility");
        }
    };

    const columns = [
        {
            header: 'Category',
            render: (item) => (
                <div className="flex items-center gap-4 text-gray-700">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="font-bold text-gray-800 uppercase tracking-wider">{item.name}</p>
                        <p className="text-[10px] text-gray-400 capitalize">{item.department || 'Jewellery'}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Department',
            render: (item) => (
                <span className="font-bold text-[10px] text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">{item.department || 'jewellery'}</span>
            )
        },
        {
            header: 'In Collection',
            render: (item) => (
                <button
                    onClick={() => toggleVisibility(item.id || item._id, 'showInCollection')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-bold transition-all ${item.showInCollection ? 'bg-[#8D6E63]/10 text-[#8D6E63]' : 'bg-gray-50 text-gray-400'
                        }`}
                >
                    {item.showInCollection ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {item.showInCollection ? 'Shown' : 'Hidden'}
                </button>
            )
        },
        {
            header: 'In Navbar',
            render: (item) => (
                <button
                    onClick={() => toggleVisibility(item.id || item._id, 'showInNavbar')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-bold transition-all ${item.showInNavbar ? 'bg-[#8D6E63]/10 text-[#8D6E63]' : 'bg-gray-50 text-gray-400'
                        }`}
                >
                    {item.showInNavbar ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {item.showInNavbar ? 'Shown' : 'Hidden'}
                </button>
            )
        },
        {
            header: 'Status',
            render: (item) => (
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.status === 'Active'
                    ? 'bg-green-50 text-green-700 border border-green-100'
                    : 'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}>
                    {item.status}
                </span>
            )
        },
        {
            header: 'Actions',
            align: 'right',
            render: (item) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => navigate(`/admin/categories/edit/${item.id || item._id}`)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(item.id || item._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    const filters = [
        {
            options: [
                { label: 'All Status', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Hidden', value: 'hidden' }
            ],
            onChange: (val) => console.log('Filter by status:', val)
        }
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Category Management"
                subtitle="Manage main collections and their global visibility settings."
                action={{
                    label: "Add New Category",
                    onClick: () => navigate('/admin/categories/new')
                }}
            />

            <DataTable
                columns={columns}
                data={(categories || []).filter(cat => cat.name?.toLowerCase().includes((searchTerm || '').toLowerCase()))}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchPlaceholder="Search categories..."
                filters={filters}
            />
        </div>
    );
};

export default CategoryManagement;
