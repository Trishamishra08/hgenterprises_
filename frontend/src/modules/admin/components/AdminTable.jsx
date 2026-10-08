import React from 'react';

const AdminTable = ({ columns, data, onRowClick }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-white border-b border-gray-200">
                    <tr>
                        {columns.map((col, idx) => (
                            <th
                                key={idx}
                                className={`py-4 px-4 text-[10px] md:text-xs font-bold text-gray-800 uppercase tracking-widest ${col.className || ''}`}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.length > 0 ? (
                        data.map((row, rowIdx) => (
                            <tr
                                key={row.id || rowIdx}
                                onClick={() => onRowClick && onRowClick(row)}
                                className={`group hover:bg-gray-50/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                            >
                                {columns.map((col, colIdx) => (
                                    <td key={colIdx} className={`py-4 px-4 align-top ${col.className || ''}`}>
                                        {col.render ? col.render(row) : (
                                            <span className="text-xs font-medium text-black">
                                                {row[col.accessor]}
                                            </span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="py-8 text-center text-xs font-semibold text-gray-400 uppercase tracking-widest">
                                No Data Available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminTable;
