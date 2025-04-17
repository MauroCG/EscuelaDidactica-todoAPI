import React from 'react';

function TaskItem({ task, onToggleComplete, onDelete }) {
    return (
        <li
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors duration-150"
        >
            <div className="flex items-center flex-grow mr-2">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggleComplete(task.id, task.completed)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-3 cursor-pointer flex-shrink-0"
                />
                <span className={`text-sm break-words ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {task.title}
                </span>
            </div>
            <button
                onClick={() => onDelete(task.id)}
                className="text-red-500 hover:text-red-700 text-xs font-medium transition duration-150 ease-in-out flex-shrink-0"
                aria-label={`Delete task ${task.title}`}
            >
                Eliminar
            </button>
        </li>
    );
}

export default TaskItem;
