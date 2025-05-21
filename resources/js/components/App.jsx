import { useState, useCallback } from "react"; // Added useCallback
import { useUsers } from "../features/users/hooks/useUsers";
import { useTasks } from "../features/tasks/hooks/useTasks";
// import UserForm from "../features/users/components/UserForm"; // No longer directly used
// import UserList from "../features/users/components/UserList"; // No longer directly used
// import TaskFilters from "../features/tasks/components/TaskFilters"; // No longer directly used
// import TaskList from "../features/tasks/components/TaskList"; // No longer directly used
// import TaskForm from "../features/tasks/components/TaskForm"; // No longer directly used
import { ThemeProvider } from '../context/ThemeContext';
import ThemeSwitcher from './ThemeSwitcher';
import UserSection from '../features/users/components/UserSection'; // Added
import TaskSection from '../features/tasks/components/TaskSection'; // Added


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
        // originalTaskCount, // Replaced by totalTasks
        totalTasks,
        loading: loadingTasks, // This is the initial page loading
        isLoadingMore,
        error: taskError,
        activeFilter,
        setActiveFilter,
        currentPage,
        totalPages,
        loadMoreTasks,
        addTask,
        toggleTaskCompletion,
        removeTask,
        setError: setTaskError, // Get setError to clear it if required
    } = useTasks(selectedUser?.id);

    // Selects a user from the list to show their tasks
    const handleUserSelect = useCallback((user) => {
        setSelectedUser(user);
        setTaskError(null); // setTaskError from useTasks is stable
    }, [setTaskError]); // Include setTaskError if it's from useState and not from useTasks hook directly

    // Creates a new user
    const handleUserSubmit = useCallback(async (userData) => {
        setUserError(null); // setUserError from useUsers is stable
        try {
            await addUser(userData); // addUser from useUsers is memoized
        } catch (err) {
            console.error("User creation failed in App component");
        }
    }, [addUser, setUserError]);

    // Creates a new task
    const handleTaskSubmit = useCallback(async (taskData) => {
        setTaskError(null); // setTaskError from useTasks is stable
        try {
            await addTask(taskData); // addTask from useTasks is memoized
        } catch (err) {
            console.error("Task creation failed in App component");
        }
    }, [addTask, setTaskError]);

    return (
        <ThemeProvider> {/* Added ThemeProvider wrapper */}
            <div className="min-h-screen container mx-auto p-4 sm:p-6 md:p-8 max-w-5xl font-sans bg-slate-100 dark:bg-slate-950"> {/* Changed bg, padding, max-width */}
                <div className="flex justify-between items-center mb-10 md:mb-12"> {/* Increased margin bottom */}
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50"> {/* Changed size and color */}
                        TODO App
                    </h1>
                    <ThemeSwitcher /> {/* Added ThemeSwitcher */}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <UserSection
                        users={users}
                        loadingUsers={loadingUsers}
                        userError={userError}
                        onUserSubmit={handleUserSubmit}
                        selectedUser={selectedUser}
                        onUserSelect={handleUserSelect}
                    />
                    <TaskSection
                        selectedUser={selectedUser}
                        tasks={filteredTasks}
                        loadingTasks={loadingTasks} // For initial load indication
                        taskError={taskError}
                        activeFilter={activeFilter}
                        onFilterChange={setActiveFilter}
                        onTaskSubmit={handleTaskSubmit}
                        onToggleComplete={toggleTaskCompletion}
                        onDeleteTask={removeTask}
                        // originalTaskCount={originalTaskCount} // Replaced
                        totalTasks={totalTasks}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        isLoadingMore={isLoadingMore}
                        loadMoreTasks={loadMoreTasks}
                    />
                </div>
            </div>
        </ThemeProvider>
    );
}

export default App;