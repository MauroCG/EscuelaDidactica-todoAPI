import React from 'react';

function UserList({ users, selectedUser, onSelectUser, loading, error }) {
    if (loading) {
        return <p className="text-gray-500">Loading users...</p>;
    }

    // Display error only if not loading and no users are present due to error
    if (!loading && error && users.length === 0) {
         return <p className="text-red-500 text-sm">{error}</p>;
    }

    if (!loading && users.length === 0) {
        return <p className="text-gray-500 text-sm">No users found.</p>;
    }

    return (
        <ul className="space-y-2 max-h-60 overflow-y-auto">
            {users.map((user) => (
                <li key={user.id}>
                    <button
                        onClick={() => onSelectUser(user)}
                        className={`w-full text-left px-3 py-2 rounded-md transition duration-150 ease-in-out ${
                            selectedUser?.id === user.id
                                ? "bg-indigo-100 text-indigo-700 font-semibold"
                                : "hover:bg-gray-100 text-gray-700"
                        }`}
                    >
                        {user.name}{" "}
                        <span className="text-xs text-gray-500">
                            ({user.email})
                        </span>
                    </button>
                </li>
            ))}
        </ul>
    );
}

export default UserList;
