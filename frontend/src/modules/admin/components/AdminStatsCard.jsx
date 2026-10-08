import React from 'react';

const AdminStatsCard = ({ label, value, icon: Icon, color, bgColor, badge, badgeColor }) => {
    return (
        <div className="bg-white p-3 rounded-none border border-black/5 shadow-sm transition-all hover:border-gold/30 group relative overflow-hidden flex items-center justify-between h-full group">
            <div className="text-left relative z-10">
                <p className="text-[7.5px] font-black text-gray-400 uppercase tracking-widest leading-none mb-0.5">{label}</p>
                <h3 className="text-lg font-serif font-black tracking-tighter text-black tabular-nums leading-tight">{value}</h3>
                {badge && (
                    <div className="mt-1">
                        <span className={`text-[6.5px] font-black px-1.5 py-0.5 rounded-none bg-emerald-50 border border-emerald-100 ${badgeColor || 'text-emerald-600'} uppercase tracking-tight`}>
                            {badge}
                        </span>
                    </div>
                )}
            </div>
            <div className="p-1 border border-black/5 bg-[#FDF5F6] group-hover:scale-110 transition-transform relative z-10 shrink-0">
                <Icon className="w-3.5 h-3.5 text-gold" strokeWidth={3} />
            </div>
            <div className="absolute top-0 right-0 w-10 h-10 bg-gold/5 rotate-45 translate-x-5 -translate-y-5 group-hover:bg-gold/10 transition-colors"></div>
        </div>
    );
};

export default AdminStatsCard;
