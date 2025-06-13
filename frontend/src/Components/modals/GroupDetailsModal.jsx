import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
// import useUpdateGroup from '../../hooks/useUpdateGroup'; // Example hook for API calls
// import useManageGroupMembers from '../../hooks/useManageGroupMembers'; // Example hook

const GroupDetailsModal = ({ group, isOpen, onClose }) => {
    const { authUser } = useAuthContext();
    const [editedName, setEditedName] = useState(group?.name || '');
    const [editedIcon, setEditedIcon] = useState(group?.groupIcon || '');
    // const { loadingUpdate, updateGroupName, updateGroupIcon } = useUpdateGroup();
    // const { loadingMembers, addMembers, removeMember, leaveGroup } = useManageGroupMembers();

    useEffect(() => {
        if (group) {
            setEditedName(group.name);
            setEditedIcon(group.groupIcon || '');
        }
    }, [group]);

    if (!isOpen || !group) return null;

    const isCurrentUserAdmin = group.admins.some(admin => admin._id === authUser._id);

    const handleSaveChanges = async () => {
        // TODO: API calls to update name and icon if changed
        if (editedName !== group.name) {
            console.log("Updating group name to:", editedName);
            // await updateGroupName(group._id, editedName);
        }
        if (editedIcon !== (group.groupIcon || '')) {
            console.log("Updating group icon to:", editedIcon);
            // await updateGroupIcon(group._id, editedIcon);
        }
        onClose(); // Close modal after saving
    };

    const handleLeaveGroup = async () => {
        // TODO: API call to leave group
        console.log("Leaving group:", group._id);
        // await leaveGroup(group._id);
        onClose();
    };

    const handleRemoveMember = async (memberId) => {
        // TODO: API call to remove member
        if (memberId === authUser._id && group.admins.length === 1 && group.admins[0]._id === authUser._id) {
            alert("You are the last admin. You cannot remove yourself. Either delete the group or promote another admin first.");
            return;
        }
        console.log("Removing member:", memberId, "from group:", group._id);
        // await removeMember(group._id, memberId);
    };

    const handleAddMembers = () => {
        // TODO: Implement UI for selecting users to add
        alert("Add members functionality to be implemented.");
    };

    const defaultUserIcon = "https://img.icons8.com/ios-glyphs/30/ffffff/user--v1.png";
    const defaultGroupIcon = "https://img.icons8.com/ios-filled/50/ffffff/conference-call.png";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">Group Details</h2>
                    <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost text-white">✕</button>
                </div>

                <div className="overflow-y-auto pr-2 flex-grow">
                    {/* Group Icon and Name */}
                    <div className="flex items-center mb-6">
                        <div className="avatar mr-4">
                            <div className="w-20 h-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img src={editedIcon || group.groupIcon || defaultGroupIcon} alt="Group Icon" className="object-cover w-full h-full"/>
                            </div>
                        </div>
                        {isCurrentUserAdmin ? (
                            <input
                                type="text"
                                className="input input-bordered w-full bg-gray-700 text-white text-xl font-semibold"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                            />
                        ) : (
                            <h3 className="text-xl font-semibold text-white">{group.name}</h3>
                        )}
                    </div>

                    {isCurrentUserAdmin && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-300 mb-1">Group Icon URL</label>
                            <input
                                type="text"
                                placeholder="Enter image URL for group icon"
                                className="input input-bordered w-full bg-gray-700 text-white"
                                value={editedIcon}
                                onChange={(e) => setEditedIcon(e.target.value)}
                            />
                        </div>
                    )}

                    {/* Participants List */}
                    <h4 className="text-lg font-semibold text-gray-200 mb-2">Participants ({group.participants.length})</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
                        {group.participants.map(participant => (
                            <div key={participant._id} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                                <div className="flex items-center">
                                    <div className="avatar mr-3">
                                        <div className="w-8 h-8 rounded-full">
                                            <img src={participant.profilePic || defaultUserIcon} alt="avatar" />
                                        </div>
                                    </div>
                                    <span className="text-white">{participant.fullName} (@{participant.username})</span>
                                    {group.admins.some(admin => admin._id === participant._id) && (
                                        <span className="badge badge-sm badge-primary ml-2">Admin</span>
                                    )}
                                </div>
                                {isCurrentUserAdmin && participant._id !== authUser._id && (
                                    <button
                                        className="btn btn-xs btn-error btn-outline"
                                        onClick={() => handleRemoveMember(participant._id)}
                                        // disabled={loadingMembers}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {isCurrentUserAdmin && (
                        <button
                            className="btn btn-sm btn-outline btn-info mb-4 w-full"
                            onClick={handleAddMembers}
                            // disabled={loadingMembers}
                        >
                            Add Members
                        </button>
                    )}
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-gray-700 flex flex-col sm:flex-row justify-end gap-3">
                    <button
                        className="btn btn-error"
                        onClick={handleLeaveGroup}
                        // disabled={loadingMembers}
                    >
                        {/* {loadingMembers && group.participants.some(p => p._id === authUser._id) ? <span className="loading loading-spinner"></span> : "Leave Group"} */}
                        Leave Group
                    </button>
                    {isCurrentUserAdmin && (
                        <button
                            className="btn btn-primary"
                            onClick={handleSaveChanges}
                            // disabled={loadingUpdate}
                        >
                            {/* {loadingUpdate ? <span className="loading loading-spinner"></span> : "Save Changes"} */}
                            Save Changes
                        </button>
                    )}
                     <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default GroupDetailsModal;
