import { useState } from 'react';

const UserForm = ({ onSubmit, error, isLoading }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // Creation of the user
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validations
        if (!name || !email) return;

        try {
            await onSubmit({ name, email });
            setName('');
            setEmail('');
        } catch (err) {
            console.log("User creation failed in form component");
        }
    };

import { useState, useCallback } from 'react'; // Added useCallback
import InputField from '../../../components/forms/InputField'; // Adjusted path

const UserForm = ({ onSubmit, error, isLoading }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // Creation of the user
    const handleSubmit = async (e) => { // onSubmit is from props, assumed stable
        e.preventDefault();

        // Validations
        if (!name || !email) return;

        try {
            await onSubmit({ name, email });
            setName('');
            setEmail('');
        } catch (err) {
            console.log("User creation failed in form component");
        }
    };

    const handleNameChange = useCallback((e) => {
        setName(e.target.value);
    }, []); // setName is stable

    const handleEmailChange = useCallback((e) => {
        setEmail(e.target.value);
    }, []); // setEmail is stable

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-slate-700 dark:text-slate-300">
                Add Nuevo Usuario
            </h3>
            <InputField
                id="userName"
                label="Nombre"
                type="text"
                value={name}
                onChange={handleNameChange} // Use memoized handler
                placeholder="Tu nombre"
                required
                disabled={isLoading}
            />
            <InputField
                id="userEmail"
                label="Email"
                type="email"
                value={email}
                onChange={handleEmailChange} // Use memoized handler
                placeholder="user@example.com"
                required
                disabled={isLoading}
            />
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 transition-all duration-150 ease-in-out disabled:opacity-60 dark:disabled:opacity-50" // Changed to transition-all
            >
                {isLoading ? 'Agregando...' : 'Agregar Usuario'}
            </button>
            <div className={`transition-opacity duration-300 ease-in-out ${error ? 'opacity-100' : 'opacity-0'}`}>
                {error && <p className="text-red-500 dark:text-red-400 text-sm mt-2">{error}</p>}
            </div>
        </form>
    );
}

export default UserForm;
