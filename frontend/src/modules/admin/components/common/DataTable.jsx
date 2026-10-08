import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const DataTable = ({
    columns,
    data,
    searchTerm,
    setSearchTerm,
    searchPlaceholder = "Search...",
    filters,
    children,
    itemsPerPage = 10
}) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate pagination
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="space-y-2 md:space-y-3 animate-in fade-in duration-500 font-outfit text-left">
            {/* Toolbar - Ultra Compact Geometric */}
            <div className="bg-[#FDF5F6] p-2 md:p-3 rounded-none border border-black/5 shadow-sm flex flex-col md:flex-row gap-2 md:gap-3 items-center">
                <div className="relative flex-grow w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gold" />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset to page 1 on search
                        }}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-black/5 rounded-none text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-gold transition-all text-gray-900 placeholder-gray-400"
                    />
                </div>
                {filters && (
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                        {filters.map((filter, index) => (
                            <div key={index} className="relative shrink-0">
                                <select
                                    onChange={(e) => {
                                        filter.onChange(e.target.value);
                                        setCurrentPage(1); // Reset to page 1 on filter change
                                    }}
                                    className="bg-white border border-black/5 rounded-none pl-3 md:pl-4 pr-8 md:pr-10 py-1.5 md:py-2 text-[9px] font-black uppercase tracking-widest text-gray-800 focus:outline-none focus:border-gold appearance-none cursor-pointer"
                                >
                                    {filter.options.map((opt, i) => (
                                        <option key={i} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gold pointer-events-none" />
                            </div>
                        ))}
                    </div>
                )}
                {children}
            </div>

            {/* Table - High Density Geometric */}
            <div className="bg-white rounded-none border border-black/5 shadow-sm overflow-hidden">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gold/20">
                    <table className="w-full text-left">
                        <thead className="bg-[#FDF5F6]/50 border-b border-black/5">
                            <tr>
                                {columns.map((col, index) => (
                                    <th key={index} className={`px-4 md:px-6 py-2.5 text-gold font-black uppercase tracking-[0.2em] text-[8px] md:text-[9px] ${col.align === 'right' ? 'text-right' : ''}`}>
                                        {col.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5 text-gray-900">
                            {paginatedData.length > 0 ? (
                                paginatedData.map((item, rowIndex) => (
                                    <tr key={startIndex + rowIndex} className="hover:bg-[#FDF5F6]/30 transition-colors group">
                                        {columns.map((col, colIndex) => (
                                            <td key={colIndex} className={`px-4 md:px-6 py-1.5 md:py-2 ${col.align === 'right' ? 'text-right' : ''}`}>
                                                <div className="text-[10px] md:text-[11px]">
                                                    {col.render ? col.render(item) : (
                                                        <span className="font-medium text-black uppercase tracking-tight">{item[col.key]}</span>
                                                    )}
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-400 font-black uppercase tracking-widest text-[8px]">
                                        Dataset Empty: No results mapped
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls - Sharp & Compact */}
                {data.length > 0 && (
                    <div className="px-4 md:px-6 py-2.5 border-t border-black/5 flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-gray-400 bg-[#FDF5F6]/20">
                        <span>Showing {startIndex + 1}—{Math.min(startIndex + itemsPerPage, data.length)} of {data.length} records</span>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-1 border border-black/5 hover:border-gold hover:text-gold disabled:opacity-30 disabled:hover:border-black/5 disabled:hover:text-gray-400 transition-all bg-white"
                            >
                                <ChevronLeft className="w-3 h-3" />
                            </button>
                            <span className="font-serif font-black text-black text-[10px] tabular-nums tracking-tighter">
                                <span className="text-gold italic mr-1">{currentPage}</span> / {totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-1 border border-black/5 hover:border-gold hover:text-gold disabled:opacity-30 disabled:hover:border-black/5 disabled:hover:text-gray-400 transition-all bg-white"
                            >
                                <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DataTable;
