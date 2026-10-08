import React from 'react';

export const Input = ({ label, ...props }) => (
    <div className="space-y-1">
        {label && (
            <label className="block text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] font-serif italic mb-1 px-1">
                {label}
            </label>
        )}
        <input
            {...props}
            className="w-full bg-white border border-gray-200 rounded-none py-2 px-3 text-[11px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-gold/40 focus:ring-0 transition-all font-outfit"
        />
    </div>
);

export const Select = ({ label, options, ...props }) => (
    <div className="space-y-1">
        {label && (
            <label className="block text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] font-serif italic mb-1 px-1">
                {label}
            </label>
        )}
        <div className="relative">
            <select
                {...props}
                className="w-full bg-white border border-gray-200 rounded-none py-2 px-3 text-[11px] text-gray-900 focus:outline-none focus:border-gold/40 focus:ring-0 transition-all appearance-none cursor-pointer font-outfit"
            >
                {options.map((opt, i) => (
                    <option key={i} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </div>
        </div>
    </div>
);

export const TextArea = ({ label, ...props }) => (
    <div className="space-y-1">
        {label && (
            <label className="block text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] font-serif italic mb-1 px-1">
                {label}
            </label>
        )}
        <textarea
            {...props}
            rows={props.rows || 4}
            className="w-full bg-white border border-gray-200 rounded-none py-2 px-3 text-[11px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-gold/40 focus:ring-0 transition-all resize-none font-outfit"
        ></textarea>
    </div>
);

export const FormSection = ({ title, children, className = "" }) => (
    <div className={`bg-white p-4 rounded-none border border-black/5 shadow-sm ${className}`}>
        {title && (
            <h3 className="text-[9px] font-serif font-black text-black uppercase tracking-[0.2em] mb-3 pb-2 border-b border-black/5 flex items-center gap-2 italic">
                {title}
            </h3>
        )}
        <div className="space-y-3">
            {children}
        </div>
    </div>
);
