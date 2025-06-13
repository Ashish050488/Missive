import React, { useState } from 'react';
import useConversation from '../../zustand/useConversation';
import GroupListItem from './GroupListItem';
// import CreateGroupModal from '../modals/CreateGroupModal'; // Modal is now handled by SideBar

const GroupList = ({ openCreateGroupModal }) => { // Accept prop to open modal
    const { userGroups, setUserGroups } = useConversation(); // Assuming setUserGroups will be used when groups are fetched/updated
    // const [showCreateGroupModal, setShowCreateGroupModal] = useState(false); // Modal visibility now managed by SideBar

    // TODO: Fetch userGroups from API on component mount or when user logs in.
    // For now, userGroups will come from Zustand, initially empty or set by another part of app.

    return (
        <div className="py-2">
            <div className="flex justify-between items-center px-3 mb-2">
                <h3 className="text-xl font-semibold text-gray-300">Groups</h3>
                <button
                    className="btn btn-xs btn-circle btn-neutral"
                    onClick={openCreateGroupModal} // Use the passed prop
                    title="Create new group"
                >
                    +
                </button>
            </div>

            {userGroups.length === 0 && (
                <p className="text-center text-gray-400 text-sm px-3">
                    No groups yet. Create one or get added to a group!
                </p>
            )}

            <div className='overflow-auto max-h-[calc(100vh-200px)]'> {/* Adjust max-h as needed */}
                {userGroups.map((group) => (
                    <GroupListItem key={group._id} group={group} />
                ))}
            </div>

            {/* Modal rendering is now handled by SideBar.jsx */}
            {/*
            {showCreateGroupModal && (
                 <div className="p-4 text-white">Create Group Modal Placeholder. To be implemented. Click button above again to "close".</div>
            )}
            */}
        </div>
    );
};

export default GroupList;
