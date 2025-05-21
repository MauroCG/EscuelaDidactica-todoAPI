import React from 'react';
import SectionCard from '../../../components/SectionCard'; // Adjust path as needed
import UserForm from './UserForm';
import UserList from './UserList';

const UserSection = ({
    users,
    loadingUsers,
    userError,
    onUserSubmit,
    selectedUser,
    onUserSelect,
}) => {
    return (
        <SectionCard title="Usuarios" className="lg:col-span-1">
            <UserForm
                onSubmit={onUserSubmit}
                error={userError}
                isLoading={loadingUsers} // Assuming form loading state is same as user list loading
            />
            <div className="border-t border-slate-300 dark:border-slate-700 pt-4 mt-4 flex-grow flex flex-col">
                <h3 className="text-xl font-medium mb-3 text-slate-700 dark:text-slate-200">
                    Selecciona un usuario
                </h3>
                <div className="flex-grow">
                    <UserList
                        users={users}
                        selectedUser={selectedUser}
                        onSelectUser={onUserSelect}
                        loading={loadingUsers}
                        error={userError} // Pass error to UserList if it needs to display specific list errors
                    />
                </div>
            </div>
        </SectionCard>
    );
};

export default UserSection;
