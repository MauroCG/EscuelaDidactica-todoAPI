import React from 'react'; // Added import

const FILTERS_CONFIG = [
    { id: 'all', label: 'Todas' },
    { id: 'completed', label: 'Completadas' },
    { id: 'pending', label: 'Pendientes' },
];

const TaskFilters = ({ activeFilter, onFilterChange }) => {
    const baseButtonClasses = "py-2 px-3 sm:px-4 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800/50 transition-colors duration-150 ease-in-out";

    return (
        <div className="flex justify-center space-x-2 sm:space-x-3 mb-6 border-b border-slate-300 dark:border-slate-700 pb-4">
            {FILTERS_CONFIG.map(filter => {
                const isActive = activeFilter === filter.id;
                const activeClasses = "bg-indigo-600 text-white hover:bg-indigo-700";
                const inactiveClasses = "bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200";
                
                return (
                    <button
                        key={filter.id}
                        onClick={() => onFilterChange(filter.id)}
                        className={`${baseButtonClasses} ${isActive ? activeClasses : inactiveClasses}`}
                    >
                        {filter.label}
                    </button>
                );
            })}
        </div>
    );
}

export default React.memo(TaskFilters); // Wrapped with React.memo
