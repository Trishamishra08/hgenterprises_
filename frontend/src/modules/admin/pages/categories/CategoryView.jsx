import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import api from '../../../../utils/api';
import toast from 'react-hot-toast';

const CategoryView = () => {
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await api.get(`/categories/${id}`);
                setCategory(res.data);
            } catch (error) {
                console.error("Error fetching category:", error);
                toast.error("Failed to load category details");
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
    }, [id]);

    if (loading) return <div className="p-12 text-center font-serif text-[10px] uppercase tracking-[0.3em] text-gray-400">Loading Matrix Data...</div>;
    if (!category) return <div className="p-12 text-center font-serif text-[10px] uppercase tracking-[0.3em] text-red-400">Category Not Found</div>;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
            <PageHeader
                title="Category Details"
                subtitle={`View details for ${category.name}`}
                backPath="/admin/categories"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Category Overview</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-1 md:col-span-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Category Name</label>
                                <p className="text-xl font-bold text-gray-900">{category.name}</p>
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Department</label>
                                <p className="text-sm font-medium text-primary uppercase tracking-widest">{category.department}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="aspect-square relative bg-gray-100 border-b border-gray-200">
                            <img src={category.image || 'https://via.placeholder.com/400'} alt={category.name} className="w-full h-full object-cover" />
                            <div className="absolute top-4 right-4">
                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border ${category.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                    {category.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryView;
