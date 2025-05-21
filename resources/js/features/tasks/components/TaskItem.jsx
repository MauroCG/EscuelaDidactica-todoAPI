import React, { useState, useEffect, memo } from 'react'; // Import memo

const TaskItemInternal = ({ task, onToggleComplete, onDelete }) => { // Rename original component
    const [isMounted, setIsMounted] = useState(false);
    // const [isRemoving, setIsRemoving] = useState(false); // Example for removal, not fully implemented here

    useEffect(() => {
        // Trigger animation on mount
        setIsMounted(true);
    }, []);

    // Example handler for triggering removal animation
    // const handleDelete = () => {
    //     setIsRemoving(true);
    //     setTimeout(() => {
    //         onDelete(task.id);
    //     }, 300); // Match duration of animation
    // };

    return (
        <li
            className={`flex items-center justify-between p-3 bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-lg shadow-sm 
                        hover:bg-slate-50 dark:hover:bg-slate-700/70
                        transition-all duration-300 ease-out 
                        ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
                        `}
                        // ${isRemoving ? 'opacity-0 scale-90' : ''} // Example for removal
        >
            <div className="flex items-center flex-grow mr-2 min-w-0">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggleComplete(task.id, task.completed)}
                    className="h-5 w-5 text-indigo-600 border-slate-400 dark:border-slate-500 rounded 
                               focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 
                               focus:ring-offset-1 dark:focus:ring-offset-slate-800 
                               dark:bg-slate-700 mr-3 cursor-pointer flex-shrink-0
                               transition-all duration-150 ease-in-out" // Added transition to checkbox
                />
                <span className={`text-sm break-words truncate ${task.completed ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>
                    {task.title}
                </span>
            </div>
            <button
                onClick={() => onDelete(task.id)} // Using direct onDelete for now
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 
                           text-xs font-medium transition-all duration-150 ease-in-out 
                           flex-shrink-0 ml-3 focus:outline-none focus:ring-1 focus:ring-red-500 rounded" // Changed to transition-all
                aria-label={`Delete task ${task.title}`}
            >
                Eliminar
            </button>
        </li>
    );
}

export default memo(TaskItemInternal); // Wrap with memo and export
