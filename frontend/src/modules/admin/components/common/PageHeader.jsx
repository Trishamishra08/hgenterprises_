import React from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PageHeader = ({ title, subtitle, action, backPath }) => {
    const navigate = useNavigate();

    return (
        <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300 px-1">
            <div className="flex items-center gap-3 md:gap-5">
                {backPath && (
                    <button
                        onClick={() => navigate(backPath)}
                        className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center bg-white rounded-none hover:bg-gray-50 transition-all text-black shadow-sm border border-black/5 active:scale-95"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                )}
                <div>
                    <h1 className="text-xl md:text-2xl font-serif font-black text-black uppercase tracking-widest">{title}</h1>
                    {subtitle && <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mt-1 font-outfit">{subtitle}</p>}
                </div>
            </div>

            {action && (
                <button
                    onClick={action.onClick}
                    className="bg-black text-white px-4 md:px-5 py-2 md:py-2.5 rounded-none text-[10px] font-black flex items-center justify-center gap-2 hover:bg-gold hover:text-black transition-all shadow-md active:scale-95 uppercase tracking-widest"
                >
                    {action.icon || <Plus className="w-3.5 h-3.5" />}
                    <span>{action.label}</span>
                </button>
            )}
        </div>
    );
};

export default PageHeader;
