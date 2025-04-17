import TaskItem from "./TaskItem";

const TaskList = ({
    tasks,
    onToggleComplete,
    onDelete,
    loading,
    error,
    activeFilter,
    originalTaskCount,
}) => {
    if (loading) {
        return <p className="text-gray-500">Loading tasks...</p>;
    }

    if (!loading && error && tasks.length === 0) {
        return <p className="text-red-500 text-sm mb-4">{error}</p>;
    }

    if (!loading && tasks.length === 0) {
        return (
            <p className="text-gray-500 mb-4">
                {originalTaskCount === 0
                    ? "No tasks found for this user."
                    : `No ${activeFilter} tasks found.`}
            </p>
        );
    }

    return (
        <ul className="space-y-3 mb-6 max-h-80 overflow-y-auto">
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={onToggleComplete}
                    onDelete={onDelete}
                />
            ))}
        </ul>
    );
};

export default TaskList;
