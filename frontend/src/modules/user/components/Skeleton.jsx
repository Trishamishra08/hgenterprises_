import React from 'react';

const Skeleton = ({ className }) => {
    return (
        <div className={`animate-pulse bg-zinc-200/50 rounded-xl ${className}`}>
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-[shimmer_2s_infinite]"></div>
            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%) skewX(-20deg); }
                    100% { transform: translateX(200%) skewX(-20deg); }
                }
            `}</style>
        </div>
    );
};

export default Skeleton;
