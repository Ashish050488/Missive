import React, { useState } from 'react';
import {useCreateGroup} from '../../hooks/useGroupActions'; // Example hook for API call

const CreateGroupModal = ({ isOpen, onClose }) => {
    const [groupName, setGroupName] = useState('');
    const [participantsInput, setParticipantsInput] = useState(''); // Simple comma-separated IDs/usernames for now
    const { loading, createGroup } = useCreateGroup(); // Example

    const handleSubmit = async (e) => {
        e.preventDefault();
        // TODO: Validate inputs
        if (!groupName.trim() || !participantsInput.trim()) {
            alert("Group name and participants are required.");
            return;
        }

        const participantIds = participantsInput.split(',').map(id => id.trim()).filter(id => id);
        if (participantIds.length === 0) {
            alert("Please enter valid participant IDs or usernames, separated by commas.");
            return;
        }

        console.log("Creating group with:", { groupName, participantIds });
        await createGroup({ name: groupName, participants: participantIds });
        onClose(); // Close modal on success
    };

    if (!isOpen) return null;

    return (
        // Basic modal structure - styling will depend on DaisyUI or custom CSS
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold text-white mb-4">Create New Group</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="groupName" className="block text-sm font-medium text-gray-300 mb-1">
                            Group Name
                        </label>
                        <input
                            type="text"
                            id="groupName"
                            className="input input-bordered w-full bg-gray-700 text-white"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="Enter group name"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="participants" className="block text-sm font-medium text-gray-300 mb-1">
                            Participants
                        </label>
                        <input
                            type="text"
                            id="participants"
                            className="input input-bordered w-full bg-gray-700 text-white"
                            value={participantsInput}
                            onChange={(e) => setParticipantsInput(e.target.value)}
                            placeholder="Enter user IDs/usernames, comma-separated"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Enter comma-separated user IDs or usernames. (Full user search/selection UI is a future enhancement).
                        </p>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            className="btn btn-ghost text-gray-300"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading || !groupName.trim() || !participantsInput.trim()}
                        >
                            {loading ? <span className="loading loading-spinner"></span> : "Create Group"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGroupModal;
