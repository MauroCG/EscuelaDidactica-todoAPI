import React from 'react';

const FILTERS = [
    { id: 'all', label: 'Todas', color: 'indigo' },
    { id: 'completed', label: 'Completadas', color: 'green' },
    { id: 'pending', label: 'Pendientes', color: 'yellow' },
];

function TaskFilters({ activeFilter, onFilterChange }) {
    const getButtonClasses = (filterId, color) => {
        const base = "px-4 py-1 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out";
        if (activeFilter === filterId) {
            // Using dynamic classes requires Tailwind JIT or safelisting,
            // or define the full class strings explicitly.
            // Let's define explicitly for simplicity here:
            switch (color) {
                case 'green': return `${base} bg-green-600 text-white shadow-sm`;
                case 'yellow': return `${base} bg-yellow-500 text-white shadow-sm`;
                default: return `${base} bg-indigo-600 text-white shadow-sm`; // indigo for 'all'
            }
        } else {
            return `${base} bg-gray-100 text-gray-600 hover:bg-gray-200`;
        }
    };

    return (
        <div className="flex justify-center space-x-3 mb-5 border-b pb-4">
            {FILTERS.map(filter => (
                <button
                    key={filter.id}
                    onClick={() => onFilterChange(filter.id)}
                    className={getButtonClasses(filter.id, filter.color)}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    );
}

export default TaskFilters;
