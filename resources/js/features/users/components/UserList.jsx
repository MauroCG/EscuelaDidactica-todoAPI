const UserList = ({ users, selectedUser, onSelectUser, loading, error }) => {
    // Helper for conditional message transitions
    const Message = ({ children, className }) => (
        <div className={`transition-opacity duration-300 ease-in-out opacity-100 ${className}`}>
            {children}
        </div>
    );

    if (loading) {
        return <Message className="text-slate-500 dark:text-slate-400 px-3 py-2">Loading users...</Message>;
    }

    if (!loading && error && users.length === 0) {
         return <Message className="text-red-500 dark:text-red-400 text-sm px-3 py-2">{error}</Message>;
    }

    if (!loading && users.length === 0) {
        return <Message className="text-slate-500 dark:text-slate-400 text-sm px-3 py-2">No users found</Message>;
    }

    return (
        <ul className="space-y-1.5 max-h-64 overflow-y-auto -mr-2 pr-2"> {/* Added negative margin and padding to hide scrollbar visually but keep functionality */}
            {users.map((user) => (
                <li key={user.id}>
                    <button
                        onClick={() => onSelectUser(user)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-1 dark:focus:ring-offset-slate-800 ${
                            selectedUser?.id === user.id
                                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/30 dark:text-indigo-300 font-semibold"
                                : "text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
                        }`} // Changed to transition-all
                    >
                        {user.name}
                        <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                            ({user.email})
                        </span>
                    </button>
                </li>
            ))}
        </ul>
    );
}

export default UserList;
