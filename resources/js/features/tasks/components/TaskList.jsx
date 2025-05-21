import TaskItem from "./TaskItem";

const TaskList = ({
    tasks,
    onToggleComplete,
    onDelete,
    loading,
    error,
    activeFilter,
    // originalTaskCount, // Replaced by totalTasks
    totalTasks,
    loadMoreTasks,
    currentPage,
    totalPages,
    isLoadingMore,
}) => {
    // Helper for conditional message transitions
    const Message = ({ children, className }) => (
        <div className={`transition-opacity duration-300 ease-in-out opacity-100 ${className}`}>
            {children}
        </div>
    );

    if (loading && currentPage === 1) { // Show initial loading only if it's the first page load
        return <Message className="text-slate-500 dark:text-slate-400 py-3 text-center">Loading tasks...</Message>;
    }

    // Error display: Show error if it occurs and there are no tasks to display (even if loading more failed)
    if (error && tasks.length === 0) { 
        return <Message className="text-red-500 dark:text-red-400 text-sm mb-4 py-3 text-center">{error}</Message>;
    }

    // No tasks message: Based on totalTasks from server after initial load
    if (!loading && totalTasks === 0 && tasks.length === 0) {
        return (
            <Message className="text-slate-500 dark:text-slate-400 mb-4 py-3 text-center">
                No tasks found for this user.
            </Message>
        );
    }
    
    // No tasks for the current filter, but tasks exist for the user
    if (!loading && tasks.length === 0 && totalTasks > 0) {
         return (
            <Message className="text-slate-500 dark:text-slate-400 mb-4 py-3 text-center">
                No {activeFilter} tasks found.
            </Message>
        );
    }


    return (
        <>
            <ul className="space-y-3 mb-6 max-h-96 overflow-y-auto -mr-2 pr-2">
                {tasks.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onToggleComplete={onToggleComplete}
                        onDelete={onDelete}
                    />
                ))}
            </ul>
            <div className="text-center mt-4 mb-2">
                {isLoadingMore && (
                    <p className="text-slate-500 dark:text-slate-400">Loading more tasks...</p>
                )}
                {!isLoadingMore && currentPage < totalPages && tasks.length > 0 && (
                    <button
                        onClick={loadMoreTasks}
                        disabled={isLoadingMore}
                        className="bg-indigo-100 hover:bg-indigo-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-indigo-700 dark:text-slate-200 font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 transition-all duration-150 ease-in-out disabled:opacity-70"
                    >
                        Load More
                    </button>
                )}
                {!isLoadingMore && tasks.length > 0 && currentPage >= totalPages && (
                     <p className="text-slate-500 dark:text-slate-400 text-sm">All tasks loaded.</p>
                )}
            </div>
        </>
    );
};

export default TaskList;
