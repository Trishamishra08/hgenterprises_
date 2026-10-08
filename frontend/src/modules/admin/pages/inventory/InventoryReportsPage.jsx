import React, { useState, useEffect } from 'react';
import { Calendar, Download, PieChart as PieIcon, TrendingUp, DollarSign, Package, Filter, ChevronDown, Activity, ArrowUpRight, BarChart3, AlertCircle } from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import PageHeader from '../../components/common/PageHeader';
import api from '../../../../utils/api';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const InventoryReportsPage = () => {
    const [activeTab, setActiveTab] = useState('category'); // 'category' or 'sales'
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState(null);
    const [period, setPeriod] = useState('all'); // all, today, week, month, year
    const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

    const periods = [
        { id: 'all', label: 'All Time Registry' },
        { id: 'today', label: 'Daily Ledger' },
        { id: 'week', label: '7-Day Velocity' },
        { id: 'month', label: '30-Day Matrix' },
        { id: 'year', label: 'Annual Audit' }
    ];

    const COLORS = ['#722F37', '#3E2723', '#A67C00', '#2F4F4F', '#4B0082', '#000000'];

    useEffect(() => {
        fetchReports();
    }, [period]);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/inventory-reports?period=${period}`);
            setReportData(data);
        } catch (error) {
            console.error('Error fetching reports:', error);
            toast.error('Failed to load real-time analytics');
        } finally {
            setLoading(false);
        }
    };

    const downloadAnalysis = () => {
        if (!reportData) return;

        const doc = new jsPDF();
        const timestamp = new Date().toLocaleString();

        doc.setFontSize(22);
        doc.setTextColor(114, 47, 55); // Brand color
        doc.text('HG ENTERPRISES - INVENTORY INTELLIGENCE', 14, 22);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Operational Report ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`, 14, 30);
        doc.text(`Generation Timestamp: ${timestamp}`, 14, 35);
        doc.text(`Analytical Period: ${periods.find(p => p.id === period)?.label}`, 14, 40);

        if (activeTab === 'category') {
            doc.text('CATEGORY VALUATION MATRIX', 14, 55);
            const tableData = reportData.categoryData.map(item => [
                item.category.toUpperCase(),
                item.uniqueProducts,
                item.totalQty,
                `Rs. ${item.value.toLocaleString()}`
            ]);

            doc.autoTable({
                startY: 60,
                head: [['INVESTMENT SECTOR', 'SKU DENSITY', 'AGGREGATE QTY', 'APPRAISED VALUE']],
                body: tableData,
                theme: 'grid',
                headStyles: { fillColor: [114, 47, 55], textColor: [255, 255, 255], fontSize: 9, fontStyle: 'bold' },
                bodyStyles: { fontSize: 8 }
            });
        } else {
            doc.text('SALES LIQUIDATION VELOCITY', 14, 55);
            const tableData = reportData.salesData.map(item => [
                item.name.toUpperCase(),
                item.category,
                item.sold,
                `Rs. ${item.avgPrice.toFixed(0)}`,
                `Rs. ${item.revenue.toLocaleString()}`
            ]);

            doc.autoTable({
                startY: 60,
                head: [['ASSET NOMENCLATURE', 'SECTOR', 'UNITS SOLD', 'AVG PRICE', 'TOTAL REVENUE']],
                body: tableData,
                theme: 'grid',
                headStyles: { fillColor: [62, 39, 35], textColor: [255, 255, 255], fontSize: 9, fontStyle: 'bold' },
                bodyStyles: { fontSize: 8 }
            });
        }

        doc.save(`HG_Intelligence_${period}_${activeTab}.pdf`);
        toast.success('Professional Analysis Document Exported');
    };

    if (loading && !reportData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] bg-white">
                <div className="w-16 h-16 border-[3px] border-[#722F37]/10 border-t-[#722F37] rounded-full animate-spin mb-4"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Recalibrating Intelligence Matrix...</p>
            </div>
        );
    }

    if (!reportData) return null;

    const { categoryData, salesData, summary, timeSeriesData } = reportData;

    // Formatting Pie Data
    const pieData = categoryData.map(c => ({ name: c.category, value: c.value }));

    return (
        <div className="space-y-6 font-outfit pb-12 animate-in fade-in duration-700 bg-[#FAFAFA] min-h-screen px-4 py-6">
            {/* Precision Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 border border-black/[0.03] rounded-3xl shadow-sm gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-[#722F37]" />
                        <span className="text-[10px] font-black text-gold uppercase tracking-[0.4em]">Live Intelligence Feed</span>
                    </div>
                    <h1 className="text-3xl font-serif font-black text-black tracking-tight leading-none uppercase">Analytical Command</h1>
                    <p className="text-[11px] font-medium text-gray-400 mt-3 flex items-center gap-2">
                        System status: <span className="text-emerald-500 font-bold uppercase tracking-tighter">Synchronized</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        Last sync: {new Date().toLocaleTimeString()}
                    </p>
                </div>

                <div className="flex flex-wrap gap-3 relative">
                    <div className="relative">
                        <button
                            onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                            className="px-6 py-3.5 bg-white border border-black/5 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-[#722F37]/30 hover:bg-gray-50 shadow-sm flex items-center gap-4 transition-all min-w-[220px] justify-between group"
                        >
                            <div className="flex items-center gap-3">
                                <Calendar size={16} strokeWidth={2} className="text-[#722F37]" />
                                <span>{periods.find(p => p.id === period)?.label}</span>
                            </div>
                            <ChevronDown size={14} className={`transition-transform duration-300 ${showPeriodDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {showPeriodDropdown && (
                            <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-black/5 shadow-2xl rounded-2xl z-50 overflow-hidden animate-in slide-in-from-top-2">
                                {periods.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => {
                                            setPeriod(p.id);
                                            setShowPeriodDropdown(false);
                                        }}
                                        className={`w-full text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-[#722F37] hover:text-white transition-all ${period === p.id ? 'bg-[#722F37]/5 text-[#722F37]' : 'text-gray-600'}`}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={downloadAnalysis}
                        className="px-8 py-3.5 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#3E2723] shadow-xl shadow-black/10 transition-all flex items-center gap-3 active:scale-95 group"
                    >
                        <Download size={16} className="group-hover:-translate-y-0.5 transition-transform" />
                        <span>Export Intelligence</span>
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Asset Valuation', value: `₹${summary.totalValuation.toLocaleString()}`, color: 'emerald', icon: DollarSign, perc: 100 },
                    { label: 'Registry Units', value: summary.totalQty.toLocaleString(), color: 'blue', icon: Package, perc: 75 },
                    { label: 'Risk Thresholds', value: summary.lowStockCount || 0, color: 'red', icon: AlertCircle, perc: 15, isAlert: (summary.lowStockCount > 0) },
                    { label: 'AOV Protocol', value: `₹${Number(summary.avgOrderValue).toLocaleString()}`, color: 'gold', icon: TrendingUp, perc: 45 }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-black/[0.03] shadow-sm group hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                                <stat.icon size={18} />
                            </div>
                            <span className={`text-[9px] font-black tracking-tighter uppercase ${stat.isAlert ? 'text-red-600 animate-pulse' : 'text-emerald-500'}`}>
                                {stat.isAlert ? 'Needs Action' : 'Stable'}
                            </span>
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                        <h3 className="text-2xl font-serif font-black text-black tracking-tighter">{stat.value}</h3>
                        <div className="w-full bg-gray-50 h-1.5 rounded-full mt-5 overflow-hidden">
                            <div
                                className={`h-full transition-all duration-1000 bg-${stat.color}-500`}
                                style={{ width: `${stat.perc}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Advanced Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Time-Series Trend */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-black/[0.03] shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-base font-serif font-black uppercase text-black">Liquidation Velocity</h3>
                            <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-black mt-1">Daily Revenue Projection Matrix</p>
                        </div>
                        <div className="flex items-center gap-2 text-[#722F37] bg-[#722F37]/5 px-3 py-1 rounded-full">
                            <TrendingUp size={12} />
                            <span className="text-[10px] font-black uppercase">{summary.growthRate}</span>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={timeSeriesData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#722F37" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#722F37" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#999', fontWeight: 900 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#999', fontWeight: 900 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: '10px', textTransform: 'uppercase', fontWeight: 900 }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#722F37" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart: Sector Concentration */}
                <div className="bg-white p-8 rounded-3xl border border-black/[0.03] shadow-sm flex flex-col">
                    <div className="mb-8">
                        <h3 className="text-base font-serif font-black uppercase text-black">Sector Volume</h3>
                        <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-black mt-1">Investment Concentration Registry</p>
                    </div>
                    <div className="h-[250px] w-full flex-grow relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <span className="block text-2xl font-serif font-black text-black leading-none">{summary.concentration}%</span>
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{summary.dominantSector.slice(0, 8)}</span>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2">
                        {pieData.slice(0, 3).map((d, i) => (
                            <div key={i} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: COLORS[i] }}></div>
                                    <span>{d.name}</span>
                                </div>
                                <span className="text-black">₹{(d.value / 100000).toFixed(1)}L</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-white/50 p-1.5 rounded-2xl w-fit border border-black/5 shadow-inner">
                {[
                    { id: 'category', label: 'Sector Ledger', icon: BarChart3 },
                    { id: 'sales', label: 'Sales Velocity', icon: Activity }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 border ${activeTab === tab.id
                            ? 'bg-black text-white shadow-xl border-black'
                            : 'text-gray-400 hover:text-gray-600 border-transparent hover:bg-white hover:shadow-sm'
                            }`}
                    >
                        <tab.icon size={14} strokeWidth={2} /> {tab.label}
                    </button>
                ))}
            </div>

            {/* Data Tables */}
            <div className="bg-white rounded-[2rem] border border-black/[0.03] shadow-sm overflow-hidden animate-in slide-in-from-bottom-4">
                {activeTab === 'category' ? (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-black/5 text-[10px] font-black uppercase text-gray-400 tracking-[0.25em]">
                                <th className="px-8 py-6">Operational Sector</th>
                                <th className="px-8 py-6 text-center">SKU Density</th>
                                <th className="px-8 py-6 text-center">Aggr. Volume</th>
                                <th className="px-8 py-6 text-right">Appraised Value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                            {categoryData.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-base font-serif font-black text-black uppercase tracking-tight group-hover:text-[#722F37] transition-colors">{item.category}</span>
                                            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest mt-1">Sector Class Alpha</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center text-sm font-serif font-black text-gray-400">{item.uniqueProducts.toString().padStart(2, '0')}</td>
                                    <td className="px-8 py-5 text-center text-sm font-serif font-black text-black">
                                        {item.totalQty.toLocaleString()}
                                        <span className="text-[9px] text-gray-400 ml-2 uppercase font-outfit font-black tracking-tighter">Units</span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-xl font-serif font-black text-black italic">₹{item.value.toLocaleString()}</span>
                                            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter">Verified Valuation</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-black/5 text-[10px] font-black uppercase text-gray-400 tracking-[0.25em]">
                                <th className="px-8 py-6 w-[40%]">Asset Nomenclature</th>
                                <th className="px-8 py-6">Sector</th>
                                <th className="px-8 py-6 text-center">Liquidation Vol.</th>
                                <th className="px-8 py-6 text-right">Avg Val.</th>
                                <th className="px-8 py-6 text-right">Total Realized</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                            {salesData.length > 0 ? (
                                salesData.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-base font-serif font-black text-black uppercase tracking-tight group-hover:text-[#3E2723] transition-colors">{item.name}</span>
                                                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest mt-1">Internal Log: {Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="px-3 py-1 bg-gray-100 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-500">{item.category}</span>
                                        </td>
                                        <td className="px-8 py-5 text-center text-sm font-serif font-black text-black">
                                            {item.sold.toString().padStart(3, '0')}
                                        </td>
                                        <td className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                                            ₹{item.avgPrice.toLocaleString()}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <span className="text-xl font-serif font-black text-emerald-600">₹{item.revenue.toLocaleString()}</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center flex flex-col items-center">
                                        <Package className="w-12 h-12 text-gray-100 mb-4" />
                                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                            Analytical database empty for selected registry period
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default InventoryReportsPage;
