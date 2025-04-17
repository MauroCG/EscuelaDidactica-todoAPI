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

    return (
        <form onSubmit={handleSubmit} className="border-t pt-6">
            <h3 className="text-lg font-medium mb-2 text-gray-600">
                Agregar Nueva Tarea
            </h3>
            {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
            <div className="flex items-center gap-3">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Descripción de la tarea..."
                    required
                    disabled={isLoading}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out disabled:opacity-50"
                >
                    {isLoading ? 'Agregando...' : 'Agregar Tarea'}
                </button>
            </div>
        </form>
    );
}

export default TaskForm;
