import { useState } from "react";
import { useUsers } from "../features/users/hooks/useUsers";
import { useTasks } from "../features/tasks/hooks/useTasks";
import UserForm from "../features/users/components/UserForm";
import UserList from "../features/users/components/UserList";
import TaskFilters from "../features/tasks/components/TaskFilters";
import TaskList from "../features/tasks/components/TaskList";
import TaskForm from "../features/tasks/components/TaskForm";


const App = () => {
    const [selectedUser, setSelectedUser] = useState(null);

    // --- User Feature ---
    const {
        users,
        loading: loadingUsers,
        error: userError,
        addUser,
        setError: setUserError, // Get setError to clear it if required
    } = useUsers();

    // --- Task Feature ---
    const {
        tasks: filteredTasks,
        originalTaskCount,
        loading: loadingTasks,
        error: taskError,
        activeFilter,
        setActiveFilter,
        addTask,
        toggleTaskCompletion,
        removeTask,
        setError: setTaskError, // Get setError to clear it if required
    } = useTasks(selectedUser?.id);

    // Selects a user from the list to show their tasks
    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setTaskError(null);
    };

    // Creates a new user
    const handleUserSubmit = async (userData) => {
        // Clear previous user error before attempting to add
        setUserError(null);

        try {
            await addUser(userData);
        } catch (err) {
            console.error("User creation failed in App component");
        }
    };

    // Creates a new task
    const handleTaskSubmit = async (taskData) => {
        // Clear previous task error before attempting to add
        setTaskError(null);

        try {
            await addTask(taskData);
        } catch (err) {
            console.error("Task creation failed in App component");
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-4xl font-sans">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                TODO App
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* User Section */}
                <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md flex flex-col">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">
                        Usuarios
                    </h2>
                    <UserForm onSubmit={handleUserSubmit} error={userError} />
                    <div className="border-t pt-4 mt-4 flex-grow flex flex-col">
                        <h3 className="text-lg font-medium mb-2 text-gray-600">
                            Selecciona un usuario
                        </h3>
                        <div className="flex-grow">
                            <UserList
                                users={users}
                                selectedUser={selectedUser}
                                onSelectUser={handleUserSelect}
                                loading={loadingUsers}
                                error={userError}
                            />
                        </div>
                    </div>
                </div>

                {/* Task Section */}
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
                            <TaskForm
                                onSubmit={handleTaskSubmit}
                                error={taskError}
                            />{" "}
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