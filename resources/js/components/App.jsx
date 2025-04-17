import React, { useState } from 'react';
import { useUsers } from '../features/users/hooks/useUsers';
import { useTasks } from '../features/tasks/hooks/useTasks';
import UserForm from '../features/users/components/UserForm';
import UserList from '../features/users/components/UserList';
import TaskFilters from '../features/tasks/components/TaskFilters';
import TaskList from '../features/tasks/components/TaskList';
import TaskForm from '../features/tasks/components/TaskForm';

function App() {
    const [selectedUser, setSelectedUser] = useState(null);

    // --- User Feature ---
    const {
        users,
        loading: loadingUsers,
        error: userError,
        addUser,
        setError: setUserError // Get setError to clear it
    } = useUsers();

    // --- Task Feature ---
    // Pass selectedUser.id to the hook, it will be null initially
    const {
        tasks: filteredTasks, // The hook now returns filtered tasks
        originalTaskCount,    // Get original count for messages
        loading: loadingTasks,
        error: taskError,
        activeFilter,
        setActiveFilter,
        addTask,
        toggleTaskCompletion,
        removeTask,
        setError: setTaskError // Get setError to clear it
    } = useTasks(selectedUser?.id); // Pass the selected user's ID

    // --- Event Handlers ---
    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setTaskError(null); // Clear task error when switching users
    };

    const handleUserSubmit = async (userData) => {
         // Clear previous user error before attempting to add
        setUserError(null);
        try {
            await addUser(userData);
            // Success message or further actions can be added here
        } catch (err) {
            // Error is set within the hook, no need to set it again here
            console.error("User creation failed in App component");
        }
    };

     const handleTaskSubmit = async (taskData) => {
         // Clear previous task error before attempting to add
        setTaskError(null);
        try {
            await addTask(taskData);
             // Success message or further actions can be added here
        } catch (err) {
             // Error is set within the hook
            console.error("Task creation failed in App component");
        }
    };

    // --- Rendering ---
    return (
        <div className="container mx-auto p-4 md:p-8 max-w-4xl font-sans">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                TODO App
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* User Section (Left Column) */}
                <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md flex flex-col"> {/* Added flex flex-col */}
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">
                        Usuarios
                    </h2>
                    <UserForm onSubmit={handleUserSubmit} error={userError} /> {/* Pass error */}
                    <div className="border-t pt-4 mt-4 flex-grow flex flex-col"> {/* Added flex-grow flex flex-col */}
                         <h3 className="text-lg font-medium mb-2 text-gray-600">
                            Selecciona un usuario
                        </h3>
                        <div className="flex-grow"> {/* Wrapper for list to take remaining space */}
                            <UserList
                                users={users}
                                selectedUser={selectedUser}
                                onSelectUser={handleUserSelect}
                                loading={loadingUsers}
                                error={userError} // Pass error for display within UserList if needed
                            />
                        </div>
                    </div>
                </div>

                {/* Task Section (Right Column) */}
                <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">
                        {selectedUser
                            ? `Tareas de ${selectedUser.name}`
                            : "Selecciona un usuario"}
                    </h2>

                    {selectedUser ? (
                        <>
                            <TaskFilters
                                activeFilter={activeFilter}
                                onFilterChange={setActiveFilter}
                            />
                            <TaskList
                                tasks={filteredTasks}
                                onToggleComplete={toggleTaskCompletion}
                                onDelete={removeTask}
                                loading={loadingTasks}
                                error={taskError}
                                activeFilter={activeFilter}
                                originalTaskCount={originalTaskCount}
                            />
                            <TaskForm onSubmit={handleTaskSubmit} error={taskError} /> {/* Pass taskError */}
                        </>
                    ) : (
                        <p className="text-gray-500">
                            Por favor selecciona un usuario de la lista para ver
                            y administrar sus tareas.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
