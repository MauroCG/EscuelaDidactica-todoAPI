import { useState } from 'react';

const TaskForm = ({ onSubmit, error, isLoading }) => {
    const [title, setTitle] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) return;

        try {
            await onSubmit({ title });
            setTitle('');
        } catch (err) {
             console.log("Task creation failed in form component");
        }
    };

import { useState, useCallback } from 'react'; // Added useCallback
import InputField from '../../../components/forms/InputField'; // Adjusted path

const TaskForm = ({ onSubmit, error, isLoading }) => {
    const [title, setTitle] = useState('');

    const handleSubmit = async (e) => { // onSubmit is from props, assumed stable
        e.preventDefault();

        if (!title.trim()) return;

        try {
            await onSubmit({ title });
            setTitle('');
        } catch (err) {
             console.log("Task creation failed in form component");
        }
    };

    const handleTitleChange = useCallback((e) => {
        setTitle(e.target.value);
    }, []); // setTitle is stable

    return (
        <form onSubmit={handleSubmit} className="border-t border-slate-300 dark:border-slate-700 pt-6 mt-6">
            <h3 className="text-lg font-semibold mb-3 text-slate-700 dark:text-slate-300">
                Agregar Nueva Tarea
            </h3>
            {/* Error message was here, moved below the button div for consistency with UserForm */}
            <div className="flex items-center gap-3">
                <InputField
                    id="taskTitle" // Added id
                    // label="Descripción de la tarea"
                    type="text"
                    value={title}
                    onChange={handleTitleChange} // Use memoized handler
                    placeholder="Descripción de la tarea..."
                    required
                    disabled={isLoading}
                    wrapperClassName="flex-grow"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 transition-all duration-150 ease-in-out disabled:opacity-60 dark:disabled:opacity-50" // Changed to transition-all
                >
                    {isLoading ? 'Agregando...' : 'Agregar Tarea'}
                </button>
            </div>
            <div className={`transition-opacity duration-300 ease-in-out ${error ? 'opacity-100' : 'opacity-0'}`}>
                {error && <p className="text-red-500 dark:text-red-400 text-sm mt-3">{error}</p>} 
                {/* Error was mb-3, now it's inside a div, so the p needs mt-3 if the div itself doesn't have spacing */}
            </div>
        </form>
    );
}

export default TaskForm;
