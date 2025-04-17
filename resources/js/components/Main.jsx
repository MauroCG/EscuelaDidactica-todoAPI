// c:\Users\Pc\Projects\EscuelaDidactica\EscuelaDidactica-todoAPI\resources\js\components\Main.jsx
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // Make sure axios is available (usually via bootstrap.js)

function Main() {
    // State for users
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [userError, setUserError] = useState(null);

    // State for user creation form
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');

    // State for tasks
    const [tasks, setTasks] = useState([]);
    const [loadingTasks, setLoadingTasks] = useState(false);
    const [taskError, setTaskError] = useState(null);

    // State for task creation form
    const [newTaskTitle, setNewTaskTitle] = useState('');

    // State for task filtering
    const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'completed', 'pending'


    // --- API Interaction Functions ---

    const fetchUsers = useCallback(async () => {
        setLoadingUsers(true);
        setUserError(null);
        try {
            const response = await axios.get('/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            setUserError("Failed to load users.");
        } finally {
            setLoadingUsers(false);
        }
    }, []);

    const fetchTasks = useCallback(async (userId) => {
        if (!userId) return;
        setLoadingTasks(true);
        setTaskError(null);
        setTasks([]); // Clear previous tasks
        try {
            // Adjust endpoint if needed
            const response = await axios.get(`/api/tasks`);
            const tasks = response.data.filter(task => task.user_id === userId);
            setTasks(tasks);
        } catch (error) {
            console.error(`Error fetching tasks for user ${userId}:`, error);
            setTaskError("Failed to load tasks.");
        } finally {
            setLoadingTasks(false);
        }
    }, []);

    // --- Effects ---

    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Fetch tasks when selectedUser changes
    useEffect(() => {
        if (selectedUser) {
            fetchTasks(selectedUser.id);
        } else {
            setTasks([]); // Clear tasks if no user is selected
        }
    }, [selectedUser, fetchTasks]);

    // --- Event Handlers ---

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        if (!newUserName || !newUserEmail) return;
        setUserError(null);
        try {
            const response = await axios.post('/api/users', {
                name: newUserName,
                email: newUserEmail,
            });
            setUsers([...users, response.data]); // Add new user to the list
            setNewUserName(''); // Clear form
            setNewUserEmail(''); // Clear form
        } catch (error) {
            console.error("Error creating user:", error);
            setUserError("Failed to create user.");
        }
    };

    const handleUserSelect = (user) => {
        setSelectedUser(user);
    };

    const handleTaskSubmit = async (e) => {
        e.preventDefault();
        if (!newTaskTitle || !selectedUser) return;
        setTaskError(null);
        try {
            // Adjust endpoint if needed
            const response = await axios.post(`/api/tasks`, {
                title: newTaskTitle,
                user_id: selectedUser.id,
            });
            setTasks([...tasks, response.data]); // Add new task
            setNewTaskTitle(''); // Clear form
        } catch (error) {
            console.error("Error creating task:", error);
            setTaskError("Failed to create task.");
        }
    };

    const handleTaskToggle = async (taskId, currentCompletedStatus) => {
        setTaskError(null);
        const updatedCompletedStatus = !currentCompletedStatus;

        // Optimistic update (optional but improves UX)
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, completed: updatedCompletedStatus } : task
            )
        );

        try {
            // Send PUT request to the specific task update endpoint
            // This endpoint should handle marking as complete/incomplete
            await axios.put(`/api/tasks/${taskId}`);
            // If successful, the optimistic update is already done.
            // You could refetch tasks here if needed, but often not necessary
            // fetchTasks(selectedUser.id);
        } catch (error) {
            console.error(`Error updating task ${taskId}:`, error);
            setTaskError("Failed to update task status.");
            // Revert optimistic update on failure
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === taskId ? { ...task, completed: currentCompletedStatus } : task
                )
            );
        }
    };

    const handleTaskDelete = async (taskId) => {
        setTaskError(null);

        // Optimistic update
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));

        try {
            await axios.delete(`/api/tasks/${taskId}`);
            // Task removed successfully
        } catch (error) {
            console.error(`Error deleting task ${taskId}:`, error);
            setTaskError("Failed to delete task.");
            // Revert optimistic update by refetching tasks
            if (selectedUser) fetchTasks(selectedUser.id);
        }
    };

    // --- Calculate filtered tasks ---
    const filteredTasks = tasks.filter(task => {
      if (activeFilter === 'completed') {
          return task.completed;
      }
      if (activeFilter === 'pending') {
          return !task.completed;
      }
      return true; // 'all' filter shows all tasks
    });



    // --- Rendering ---

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-4xl font-sans">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">TODO App</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* User Section (Left Column) */}
                <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Usuarios</h2>

                    {/* User Creation Form */}
                    <form onSubmit={handleUserSubmit} className="mb-6">
                        <h3 className="text-lg font-medium mb-2 text-gray-600">Add Nuevo Usuario</h3>
                        <div className="mb-3">
                            <label htmlFor="userName" className="block text-sm font-medium text-gray-500 mb-1">Nombre</label>
                            <input
                                id="userName"
                                type="text"
                                value={newUserName}
                                onChange={(e) => setNewUserName(e.target.value)}
                                placeholder="Tu nombre"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="userEmail" className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                            <input
                                id="userEmail"
                                type="email"
                                value={newUserEmail}
                                onChange={(e) => setNewUserEmail(e.target.value)}
                                placeholder="user@example.com"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                        >
                            Agregar Usuario
                        </button>
                        {userError && <p className="text-red-500 text-xs mt-2">{userError}</p>}
                    </form>

                    {/* User List */}
                    <h3 className="text-lg font-medium mb-2 text-gray-600 border-t pt-4">Selecciona un usuario</h3>
                    {loadingUsers && <p className="text-gray-500">Loading users...</p>}
                    {!loadingUsers && users.length === 0 && <p className="text-gray-500 text-sm">No users found.</p>}
                    <ul className="space-y-2 max-h-60 overflow-y-auto">
                        {users.map(user => (
                            <li key={user.id}>
                                <button
                                    onClick={() => handleUserSelect(user)}
                                    className={`w-full text-left px-3 py-2 rounded-md transition duration-150 ease-in-out ${selectedUser?.id === user.id
                                            ? 'bg-indigo-100 text-indigo-700 font-semibold'
                                            : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    {user.name} <span className="text-xs text-gray-500">({user.email})</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Task Section (Right Column) */}
                <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">
                        {selectedUser ? `Tareas de ${selectedUser.name}` : 'Selecciona un usuario'}
                    </h2>

                    {selectedUser ? (
                        <>
                            {/* --- Task Filters --- */}
                            <div className="flex justify-center space-x-3 mb-5 border-b pb-4">
                                <button
                                    onClick={() => setActiveFilter('all')}
                                    className={`px-4 py-1 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out ${
                                        activeFilter === 'all'
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    Todas
                                </button>
                                <button
                                    onClick={() => setActiveFilter('completed')}
                                    className={`px-4 py-1 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out ${
                                        activeFilter === 'completed'
                                            ? 'bg-green-600 text-white shadow-sm'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    Completadas
                                </button>
                                <button
                                    onClick={() => setActiveFilter('pending')}
                                    className={`px-4 py-1 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out ${
                                        activeFilter === 'pending'
                                            ? 'bg-yellow-500 text-white shadow-sm'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    Pendientes
                                </button>
                            </div>
                            {/* --- End Task Filters --- */}


                            {/* Task List - Now uses filteredTasks */}
                            {loadingTasks && <p className="text-gray-500">Loading tasks...</p>}
                            {taskError && <p className="text-red-500 text-sm mb-4">{taskError}</p>}
                            {!loadingTasks && filteredTasks.length === 0 && (
                                <p className="text-gray-500 mb-4">
                                    {tasks.length === 0 ? 'No tasks found for this user.' : `No ${activeFilter} tasks found.`}
                                </p>
                            )}

                            {/* Make sure this ul maps over filteredTasks */}
                            <ul className="space-y-3 mb-6 max-h-80 overflow-y-auto"> {/* Adjusted max-h */}
                                {filteredTasks.map(task => ( // <--- Use filteredTasks here
                                    <li
                                        key={task.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors duration-150"
                                    >
                                        <div className="flex items-center flex-grow mr-2"> {/* Added flex-grow and mr-2 */}
                                            <input
                                                type="checkbox"
                                                checked={task.completed}
                                                onChange={() => handleTaskToggle(task.id, task.completed)}
                                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-3 cursor-pointer flex-shrink-0" // Added flex-shrink-0
                                            />
                                            <span className={`text-sm break-words ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}> {/* Added break-words */}
                                                {task.title}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleTaskDelete(task.id)}
                                            className="text-red-500 hover:text-red-700 text-xs font-medium transition duration-150 ease-in-out flex-shrink-0" // Added flex-shrink-0
                                            aria-label={`Delete task ${task.title}`}
                                        >
                                            Eliminar
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            {/* Task Creation Form (remains the same) */}
                            <form onSubmit={handleTaskSubmit} className="border-t pt-6">
                                {/* ... form content ... */}
                                <h3 className="text-lg font-medium mb-2 text-gray-600">Agregar Nueva Tarea</h3>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={newTaskTitle}
                                        onChange={(e) => setNewTaskTitle(e.target.value)}
                                        placeholder="Descripción de la tarea..."
                                        required
                                        className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
                                    >
                                        Agregar Tarea
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <p className="text-gray-500">Por favor selecciona un usuario de la lista para ver y administrar sus tareas.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Main;

