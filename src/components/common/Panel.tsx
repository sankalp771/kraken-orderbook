import React from 'react';

interface PanelProps {
    title: string;
    children: React.ReactNode;
    className?: string;
    headerAction?: React.ReactNode;
}

const Panel: React.FC<PanelProps> = ({ title, children, className = '', headerAction }) => {
    return (
        <div className={`flex flex-col bg-[#0b0e11] border border-[#1e2329] rounded-[4px] overflow-hidden ${className}`}>
            {/* Panel Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-[#161a1e] border-b border-[#1e2329] h-9">
                <span className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider">
                    {title}
                </span>
                {headerAction && <div>{headerAction}</div>}
            </div>
            {/* Panel Content */}
            <div className="flex-1 min-h-0 relative">
                {children}
            </div>
        </div>
    );
};

export default Panel;
