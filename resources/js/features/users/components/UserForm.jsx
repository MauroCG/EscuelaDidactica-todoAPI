import React, { useState } from 'react';

function UserForm({ onSubmit, error, isLoading }) { // Accept isLoading if you add it to useUsers.addUser
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email) return;
        try {
            await onSubmit({ name, email });
            setName(''); // Clear form on success
            setEmail('');
        } catch (err) {
            // Error is handled by the hook and displayed via the error prop
            console.log("User creation failed in form component");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-gray-600">
                Add Nuevo Usuario
            </h3>
            <div className="mb-3">
                <label htmlFor="userName" className="block text-sm font-medium text-gray-500 mb-1">
                    Nombre
                </label>
                <input
                    id="userName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    required
                    disabled={isLoading} // Disable while submitting
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50"
                />
            </div>
            <div className="mb-3">
                <label htmlFor="userEmail" className="block text-sm font-medium text-gray-500 mb-1">
                    Email
                </label>
                <input
                    id="userEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    required
                    disabled={isLoading} // Disable while submitting
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50"
                />
            </div>
            <button
                type="submit"
                disabled={isLoading} // Disable while submitting
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50"
            >
                {isLoading ? 'Agregando...' : 'Agregar Usuario'}
            </button>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </form>
    );
}

export default UserForm;
