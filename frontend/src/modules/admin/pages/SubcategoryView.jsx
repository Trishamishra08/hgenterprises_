import React from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { Box, Layers, Tag } from 'lucide-react';

const SubcategoryView = () => {
    const { id } = useParams();

    // Mock data for display - in real app, fetch by ID
    const subcategory = {
        id: id,
        name: 'Solitaire Rings',
        parentCategory: 'Rings',
        description: 'Classic single stone rings that define elegance and simplicity.',
        status: 'Active',
        productCount: 42,
        createdAt: '2024-02-01',
        updatedAt: '2024-02-15'
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                title="Subcategory Details"
                subtitle={`View details for ${subcategory.name}`}
                backPath="/admin/subcategories"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Info Card */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2 flex items-center gap-2">
                            <Layers className="w-5 h-5 text-gray-500" />
                            Subcategory Overview
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-1 md:col-span-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Subcategory Name</label>
                                <p className="text-xl font-bold text-gray-900">{subcategory.name}</p>
                            </div>

                            <div className="col-span-1 md:col-span-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Parent Category</label>
                                <div className="flex items-center gap-2">
                                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-sm font-medium border border-gray-200">
                                        {subcategory.parentCategory}
                                    </span>
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Description</label>
                                <p className="text-gray-700 leading-relaxed text-sm bg-gray-50 p-4 rounded-lg border border-gray-100">{subcategory.description}</p>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Date Created</label>
                                <p className="text-sm font-medium text-gray-700">{subcategory.createdAt}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Last Updated</label>
                                <p className="text-sm font-medium text-gray-700">{subcategory.updatedAt}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Card */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h4 className="text-sm font-bold text-gray-900 mb-4 border-b pb-2">Status & Stats</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Current Status</label>
                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border inline-block ${subcategory.status === 'Active'
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : 'bg-gray-100 text-gray-600 border-gray-200'
                                    }`}>
                                    {subcategory.status}
                                </span>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Linked Products</label>
                                <div className="flex items-center gap-3">
                                    <Box className="w-8 h-8 text-[#8D6E63]" />
                                    <p className="text-3xl font-bold text-gray-900">{subcategory.productCount}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubcategoryView;
