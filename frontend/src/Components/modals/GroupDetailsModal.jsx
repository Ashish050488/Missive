import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import LazyImage from '../common/LazyImage';
import {
    useUpdateGroupDetails,
    useAddMembers,
    useRemoveMember,
    useLeaveGroup,
    useDeleteGroup
} from '../../hooks/useGroupActions';
import toast from 'react-hot-toast'; // Import toast

const GroupDetailsModal = ({ isOpen, onClose, group }) => {
    const { authUser } = useAuthContext();

    const [groupName, setGroupName] = useState('');
    const [groupIconUrl, setGroupIconUrl] = useState('');
    const [usernamesToAdd, setUsernamesToAdd] = useState('');

    const { updateGroupDetails, loading: loadingUpdateDetails } = useUpdateGroupDetails();
    const { addMembers, loading: loadingAddMembers } = useAddMembers();
    const { removeMember, loading: loadingRemoveMember } = useRemoveMember();
    const { leaveGroup, loading: loadingLeaveGroup } = useLeaveGroup();
    const { deleteGroup, loading: loadingDeleteGroup } = useDeleteGroup();

    const overallLoading = loadingUpdateDetails || loadingAddMembers || loadingRemoveMember || loadingLeaveGroup || loadingDeleteGroup;

    const isAuthUserAdmin = group?.admins?.some(admin => admin._id === authUser?._id);

    useEffect(() => {
        if (group) {
            setGroupName(group.name || '');
            setGroupIconUrl(group.groupIcon || '');
        } else {
            // Reset fields if group is null (e.g. modal closed and re-opened without a group)
            setGroupName('');
            setGroupIconUrl('');
            setUsernamesToAdd('');
        }
    }, [group, isOpen]);

    if (!isOpen || !group) return null;

    const handleUpdateName = async () => {
        if (!groupName.trim() || groupName.trim() === group.name) {
            if(!groupName.trim()) toast.error("Group name cannot be empty.");
            return;
        }
        await updateGroupDetails(group._id, { name: groupName.trim() });
        // Toast is handled by the hook
    };

    const handleUpdateIcon = async () => {
        // Allow empty URL to remove icon, or check if it's same as current
        if (groupIconUrl.trim() === (group.groupIcon || '')) return;
        await updateGroupDetails(group._id, { groupIcon: groupIconUrl.trim() });
        // Toast is handled by the hook
    };

    const handleAddMembersAction = async () => {
        if (!usernamesToAdd.trim()) return;
        const usernamesArray = usernamesToAdd.split(',').map(name => name.trim()).filter(name => name);
        if (usernamesArray.length === 0) {
            toast.error("Please enter valid usernames, comma-separated.");
            return;
        }
        const success = await addMembers(group._id, usernamesArray);
        if (success) {
            setUsernamesToAdd(''); // Clear input
            // The hook should update Zustand, triggering re-render of participant list by parent if group prop updates
        }
        // Toast (success/error) handled by the hook
    };

    const handleRemoveMemberAction = async (memberIdToRemove) => {
        // Prevent removing self if last admin
        if (memberIdToRemove === authUser._id && group.admins?.length === 1 && group.admins[0]._id === authUser._id && group.participants?.length > 1) {
            toast.error("You are the last admin. Promote another admin or delete the group.");
            return;
        }
        if (window.confirm("Are you sure you want to remove this member?")) {
            await removeMember(group._id, memberIdToRemove);
            // Toast handled by hook
        }
    };

    const handleLeaveGroupAction = async () => {
        if (window.confirm("Are you sure you want to leave this group?")) {
            const success = await leaveGroup(group._id);
            if (success) {
                onClose();
            }
            // Toast handled by hook
        }
    };

    const handleDeleteGroupAction = async () => {
        if (window.confirm("Are you sure you want to DELETE this group? This action cannot be undone.")) {
            const success = await deleteGroup(group._id);
            if (success) {
                onClose();
            }
            // Toast handled by hook
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] p-4 overflow-y-auto">
            <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-lg sm:max-w-2xl my-8 max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4 sm:mb-6 border-b border-gray-700 pb-3">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Group Details</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-200 text-2xl sm:text-3xl" disabled={overallLoading}>&times;</button>
                </div>

                <div className="overflow-y-auto pr-1 custom-scrollbar flex-grow">
                    {/* Group Icon and Name Display/Edit */}
                    <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-6">
                        <div className="avatar mb-3 sm:mb-0 sm:mr-4">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full ring ring-sky-500 ring-offset-base-100 ring-offset-2 overflow-hidden">
                                <LazyImage src={group.groupIcon || '/default-avatar.png'} alt="Group Icon" className="w-full h-full object-cover" placeholderSrc="/default-avatar.png" />
                            </div>
                        </div>
                        <div className="flex-grow w-full text-center sm:text-left">
                            {isAuthUserAdmin ? (
                                <input
                                    type="text"
                                    className="input input-bordered w-full bg-gray-700 text-white text-lg sm:text-xl font-semibold mb-2"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    disabled={overallLoading}
                                />
                            ) : (
                                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">{group.name}</h3>
                            )}
                             {isAuthUserAdmin && (
                                <button onClick={handleUpdateName} className="btn btn-xs btn-info sm:btn-sm" disabled={overallLoading || groupName === group.name}>
                                    {loadingUpdateDetails ? <span className="loading loading-spinner loading-xs"></span> : "Update Name"}
                                </button>
                            )}
                        </div>
                    </div>

                    {isAuthUserAdmin && (
                        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-700 rounded-md">
                            <h3 className="text-lg sm:text-xl font-semibold text-sky-400 mb-2 sm:mb-3">Admin Controls</h3>
                            <div className="mb-3">
                                <label htmlFor="groupIconEdit" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Group Icon URL</label>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        type="text"
                                        id="groupIconEdit"
                                        className="input input-bordered w-full bg-gray-600 text-white text-sm sm:text-base"
                                        value={groupIconUrl}
                                        onChange={(e) => setGroupIconUrl(e.target.value)}
                                        placeholder="https://example.com/icon.png"
                                        disabled={overallLoading}
                                    />
                                    <button onClick={handleUpdateIcon} className="btn btn-info btn-sm sm:btn-md" disabled={overallLoading || groupIconUrl === (group.groupIcon || '')}>
                                        {loadingUpdateDetails ? <span className="loading loading-spinner loading-xs"></span> : "Update Icon"}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="addMembersInput" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Add Members by Username</label>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        type="text"
                                        id="addMembersInput"
                                        className="input input-bordered w-full bg-gray-600 text-white text-sm sm:text-base"
                                        value={usernamesToAdd}
                                        onChange={(e) => setUsernamesToAdd(e.target.value)}
                                        placeholder="user1, user2, ..."
                                        disabled={overallLoading}
                                    />
                                    <button onClick={handleAddMembersAction} className="btn btn-success btn-sm sm:btn-md" disabled={overallLoading || !usernamesToAdd.trim()}>
                                        {loadingAddMembers ? <span className="loading loading-spinner loading-xs"></span> : "Add Members"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mb-4 sm:mb-6">
                        <h4 className="text-lg sm:text-xl font-semibold text-sky-400 mb-2 sm:mb-3">Participants ({group.participants?.length || 0})</h4>
                        <div className="max-h-48 sm:max-h-60 overflow-y-auto bg-gray-750 p-2 sm:p-3 rounded-md custom-scrollbar">
                            {group.participants?.map(participant => (
                                <div key={participant._id} className="flex items-center justify-between p-1.5 sm:p-2 hover:bg-gray-700 rounded-md">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <LazyImage
                                            src={participant.profilePic || '/default-avatar.png'}
                                            alt={participant.fullName}
                                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                                            placeholderSrc="/default-avatar.png"
                                        />
                                        <div>
                                            <p className="text-sm sm:text-base font-medium text-white">{participant.fullName}</p>
                                            <p className="text-xs text-gray-400">@{participant.username}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        {group.admins?.some(admin => admin._id === participant._id) && (
                                            <span className="badge badge-info badge-xs sm:badge-sm text-white">Admin</span>
                                        )}
                                        {isAuthUserAdmin && authUser._id !== participant._id && (
                                            <button
                                                onClick={() => handleRemoveMemberAction(participant._id)}
                                                className="btn btn-xs btn-error btn-outline"
                                                disabled={overallLoading}
                                            >
                                                {loadingRemoveMember ? <span className="loading loading-spinner loading-xs"></span> : "Remove"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-700 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                    {!isAuthUserAdmin && group.participants?.some(p => p._id === authUser._id) && ( // Show leave if I am a participant and not admin
                         <button onClick={handleLeaveGroupAction} className="btn btn-warning btn-sm sm:btn-md" disabled={overallLoading}>
                            {loadingLeaveGroup ? <span className="loading loading-spinner"></span> : "Leave Group"}
                        </button>
                    )}
                    {isAuthUserAdmin && ( // Only admins can delete
                        <button onClick={handleDeleteGroupAction} className="btn btn-error btn-sm sm:btn-md" disabled={overallLoading}>
                           {loadingDeleteGroup ? <span className="loading loading-spinner"></span> : "Delete Group"}
                        </button>
                    )}
                     <button className="btn btn-ghost btn-sm sm:btn-md" onClick={onClose} disabled={overallLoading}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default GroupDetailsModal;
