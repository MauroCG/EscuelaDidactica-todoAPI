import React from 'react';

const SectionCard = ({ className, title, children, titleClassName }) => {
    return (
        <div
            className={`bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 flex flex-col ${className || ''}`}
        >
            {title && (
                <h2 className={`text-2xl font-semibold mb-6 text-slate-800 dark:text-slate-100 ${titleClassName || ''}`}>
                    {title}
                </h2>
            )}
            {children}
        </div>
    );
};

export default React.memo(SectionCard); // Wrapped with React.memo
