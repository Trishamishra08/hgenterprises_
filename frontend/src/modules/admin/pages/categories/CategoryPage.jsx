import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Edit2, Trash2, Eye, Box, CheckCircle, Plus, EyeOff } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import AdminStatsCard from '../../components/AdminStatsCard';
import api from '../../../../utils/api';
import toast from 'react-hot-toast';
import { useShop } from '../../../../context/ShopContext';

const CategoryPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { products } = useShop();
    const queryParams = new URLSearchParams(location.search);
    let department = queryParams.get('department') || 'jewellery';
    department = department.toLowerCase();
    if (department === 'machine') department = 'machines';
    if (department === 'tool') department = 'tools';

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/categories?department=${department}`);
            setCategories(res.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [department]);

    const handleDelete = async (itemId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await api.delete(`/categories/${itemId}`);
                setCategories(prev => prev.filter(cat => (cat._id || cat.id) !== itemId));
                toast.success("Category deleted");
            } catch (error) {
                toast.error("Failed to delete category");
            }
        }
    };

    const toggleStatus = async (item, field) => {
        try {
            const itemId = item._id || item.id;
            const updatedVal = field === 'status'
                ? (item.status === 'Active' ? 'Hidden' : 'Active')
                : !item[field];

            const payload = { [field]: updatedVal };
            await api.patch(`/categories/${itemId}`, payload);

            setCategories(prev => prev.map(cat =>
                (cat._id || cat.id) === itemId ? { ...cat, ...payload } : cat
            ));
            toast.success("Status updated");
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const columns = [
        {
            header: 'CATEGORY MATRIX',
            render: (item) => (
                <div className="flex items-center gap-4 text-gray-900">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                        <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="font-bold text-black text-sm uppercase">{item.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.id}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Products',
            render: (item) => {
                const count = products.filter(p => p.category?.toLowerCase() === item.name.toLowerCase()).length;
                return <span className="font-bold text-sm text-gray-800">{count}</span>
            }
        },
        {
            header: 'COLLECTION',
            render: (item) => (
                <button
                    onClick={() => toggleStatus(item, 'showInCollection')}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-none text-[8px] font-black uppercase tracking-wider transition-all ${item.showInCollection ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}
                >
                    {item.showInCollection ? 'Shown' : 'Hidden'}
                </button>
            )
        },
        {
            header: 'NAVBAR',
            render: (item) => (
                <button
                    onClick={() => toggleStatus(item, 'showInNavbar')}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-none text-[8px] font-black uppercase tracking-wider transition-all ${item.showInNavbar ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}
                >
                    {item.showInNavbar ? 'Shown' : 'Hidden'}
                </button>
            )
        },
        {
            header: 'Global Status',
            render: (item) => (
                <button
                    onClick={() => toggleStatus(item, 'status')}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-none text-[8px] font-black uppercase tracking-wider border transition-all ${item.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : 'bg-red-50 text-red-600 border-red-100'
                        }`}
                >
                    {item.status}
                </button>
            )
        },
        {
            header: 'Actions',
            render: (item) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => navigate(`/admin/categories/view/${item._id || item.id}`)}
                        className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-none transition-all"
                        title="View Category"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => navigate(`/admin/categories/edit/${item._id || item.id}`)}
                        className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-none transition-all"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(item._id || item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-none transition-all"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            )
        }
    ];

    const stats = [
        {
            label: 'TOTAL DEPTH',
            value: categories.length.toString().padStart(2, '0'),
            icon: Box,
            color: 'text-footerBg',
            bgColor: 'bg-gray-50'
        },
        {
            label: 'ACTIVE PROTOCOLS',
            value: categories.filter(c => c.status === 'Active').length.toString().padStart(2, '0'),
            icon: CheckCircle,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50'
        },
        {
            label: 'HIDDEN REGISTRIES',
            value: categories.filter(c => c.status === 'Hidden').length.toString().padStart(2, '0'),
            icon: EyeOff,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
        }
    ];

    return (
        <div className="space-y-4 animate-in fade-in duration-500 pb-12 font-outfit text-left">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 border border-black/5 rounded-none shadow-sm gap-4">
                <div>
                    <h1 className="text-2xl font-serif font-black text-black tracking-tight leading-none uppercase">
                        {department} Matrix
                    </h1>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-2">
                        System level categorization for active business units
                    </p>
                </div>
                <button
                    onClick={() => navigate(`/admin/categories/new?department=${department}`)}
                    className="px-5 py-2.5 bg-black text-white rounded-none text-[9px] font-black uppercase tracking-widest hover:bg-primary shadow-xl shadow-black/20 transition-all flex items-center gap-3 active:scale-95 group"
                >
                    <Plus size={14} className="group-hover:rotate-90 transition-transform" />
                    <span>Initialize New Category</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, idx) => (
                    <AdminStatsCard
                        key={idx}
                        label={stat.label}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color}
                        bgColor={stat.bgColor}
                    />
                ))}
            </div>

            <DataTable
                columns={columns}
                data={categories}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchPlaceholder={`Search within ${department} matrix...`}
                loading={loading}
            />
        </div>
    );
};

export default CategoryPage;
