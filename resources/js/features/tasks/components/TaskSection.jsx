import React from 'react';
import SectionCard from '../../../components/SectionCard'; // Adjust path as needed
import TaskFilters from './TaskFilters';
import TaskList from './TaskList';
import TaskForm from './TaskForm';

const TaskSection = ({
    selectedUser,
    tasks,
    loadingTasks,
    taskError,
    activeFilter,
    onFilterChange,
    onTaskSubmit,
    onToggleComplete,
    onDeleteTask,
    // originalTaskCount, // Replaced by totalTasks
    totalTasks,
    loadMoreTasks,
    currentPage,
    totalPages,
    isLoadingMore,
}) => {
    const taskSectionTitle = selectedUser
        ? `Tareas de ${selectedUser.name}`
        : "Selecciona un usuario";

    return (
        <SectionCard className="lg:col-span-2" title={taskSectionTitle}>
            {selectedUser ? (
                <>
                    <TaskFilters
                        activeFilter={activeFilter}
                        onFilterChange={onFilterChange}
                    />
                    <TaskList
                        tasks={tasks}
                        onToggleComplete={onToggleComplete}
                        onDelete={onDeleteTask}
                        loading={loadingTasks} // This is the initial loading state
                        error={taskError}
                        activeFilter={activeFilter}
                        // originalTaskCount={originalTaskCount} // Replaced
                        totalTasks={totalTasks}
                        loadMoreTasks={loadMoreTasks}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        isLoadingMore={isLoadingMore}
                    />
                    <TaskForm
                        onSubmit={onTaskSubmit}
                        error={taskError}
                        isLoading={loadingTasks || isLoadingMore} // Form might be disabled during any loading
                    />
                </>
            ) : (
                <p className="text-slate-500 dark:text-slate-400">
                    Por favor selecciona un usuario de la lista para ver y administrar sus tareas.
                </p>
            )}
        </SectionCard>
    );
};

export default TaskSection;
