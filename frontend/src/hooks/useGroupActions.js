import { useState } from 'react';
import toast from 'react-hot-toast';
import useConversation from '../zustand/useConversation';
// import { useAuthContext } from '../context/AuthContext'; // May not be needed if actions rely on existing state

// Hook for creating a new group
export const useCreateGroup = () => {
    const [loading, setLoading] = useState(false);
    const { userGroups, setUserGroups, setSelectedConversations } = useConversation();

    const createGroup = async ({ name, participants }) => {
        setLoading(true);
        try {
            // Basic validation (can be more extensive)
            if (!name.trim()) throw new Error("Group name cannot be empty.");
            if (!participants || participants.length === 0) throw new Error("Please select participants for the group.");

            const res = await fetch('/api/groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, participants }),
            });

            const data = await res.json();

            if (!res.ok || data.error) {
                throw new Error(data.error || `Server responded with ${res.status}`);
            }

            setUserGroups([...userGroups, data]);
            setSelectedConversations({...data, isDM: false }); // Select the new group, mark as not DM
            toast.success(`Group "${data.name}" created successfully!`);
            return true; // Indicate success
        } catch (error) {
            console.error("Error creating group:", error);
            toast.error(error.message || "Failed to create group.");
            return false; // Indicate failure
        } finally {
            setLoading(false);
        }
    };
    return { loading, createGroup };
};

// Hook for fetching user's groups
export const useFetchUserGroups = () => {
    const [loading, setLoading] = useState(false);
    const { setUserGroups } = useConversation();

    const fetchUserGroups = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/groups');
            const data = await res.json();

            if (!res.ok || data.error) {
                throw new Error(data.error || `Server responded with ${res.status}`);
            }
            setUserGroups(Array.isArray(data) ? data : []);
            // No toast for fetch, usually silent unless error
        } catch (error) {
            console.error("Error fetching user groups:", error);
            toast.error(error.message || "Failed to fetch groups.");
            setUserGroups([]); // Clear groups on error
        } finally {
            setLoading(false);
        }
    };
    return { loading, fetchUserGroups };
};


// Placeholder for other hooks - to be implemented sequentially

// Hook for updating group details (name or icon)
export const useUpdateGroupDetails = () => {
    const [loading, setLoading] = useState(false);
    const { userGroups, setUserGroups, selectedConversation, setSelectedConversations } = useConversation();

    const updateGroupDetails = async (groupId, { name, groupIcon }) => {
        setLoading(true);
        let updatedData = null;
        try {
            if (name !== undefined) {
                const resName = await fetch(`/api/groups/${groupId}/name`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name }),
                });
                const dataName = await resName.json();
                if (!resName.ok || dataName.error) throw new Error(dataName.error || `Failed to update group name`);
                updatedData = dataName;
                toast.success("Group name updated!");
            }
            if (groupIcon !== undefined) {
                const resIcon = await fetch(`/api/groups/${groupId}/icon`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ groupIcon }),
                });
                const dataIcon = await resIcon.json();
                if (!resIcon.ok || dataIcon.error) throw new Error(dataIcon.error || `Failed to update group icon`);
                updatedData = dataIcon; // Overwrite or merge if both name and icon were updated in separate calls
                toast.success("Group icon updated!");
            }

            if (updatedData) {
                // Update userGroups list
                const updatedGroups = userGroups.map(g => g._id === groupId ? { ...g, ...updatedData, isDM: false } : g);
                setUserGroups(updatedGroups);

                // Update selectedConversation if it's the one being edited
                if (selectedConversation?._id === groupId) {
                    setSelectedConversations({ ...selectedConversation, ...updatedData, isDM: false });
                }
            }
            return true;
        } catch (error) {
            console.error("Error updating group details:", error);
            toast.error(error.message || "Failed to update group details.");
            return false;
        } finally {
            setLoading(false);
        }
    };
    return { loading, updateGroupDetails };
};

// Hook for deleting a group
export const useDeleteGroup = () => {
    const [loading, setLoading] = useState(false);
    const { userGroups, setUserGroups, selectedConversation, setSelectedConversations } = useConversation();

    const deleteGroup = async (groupId) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/groups/${groupId}`, { method: 'DELETE' });
            const data = await res.json(); // Expects { message: "..." } on success

            if (!res.ok || data.error) {
                throw new Error(data.error || `Failed to delete group`);
            }

            setUserGroups(userGroups.filter(g => g._id !== groupId));
            if (selectedConversation?._id === groupId) {
                setSelectedConversations(null);
            }
            toast.success(data.message || "Group deleted successfully!");
            return true;
        } catch (error) {
            console.error("Error deleting group:", error);
            toast.error(error.message || "Failed to delete group.");
            return false;
        } finally {
            setLoading(false);
        }
    };
    return { loading, deleteGroup };
};

// Hook for adding members to a group
export const useAddMembers = () => {
    const [loading, setLoading] = useState(false);
    const { userGroups, setUserGroups, selectedConversation, setSelectedConversations } = useConversation();

    const addMembers = async (groupId, memberIds) => {
        setLoading(true);
        try {
            if (!memberIds || memberIds.length === 0) throw new Error("No members selected to add.");

            const res = await fetch(`/api/groups/${groupId}/members`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ members: memberIds }),
            });
            const data = await res.json(); // Expects { message, group }

            if (!res.ok || data.error) {
                throw new Error(data.error || `Failed to add members`);
            }

            const updatedGroup = {...data.group, isDM: false};

            // Update userGroups list
            const updatedUserGroups = userGroups.map(g => g._id === groupId ? updatedGroup : g);
            setUserGroups(updatedUserGroups);

            // Update selectedConversation if it's the current group
            if (selectedConversation?._id === groupId) {
                setSelectedConversations(updatedGroup);
            }
            toast.success(data.message || "Members added successfully!");
            return true;
        } catch (error) {
            console.error("Error adding members:", error);
            toast.error(error.message || "Failed to add members.");
            return false;
        } finally {
            setLoading(false);
        }
    };
    return { loading, addMembers };
};

// Hook for removing a member from a group
export const useRemoveMember = () => {
    const [loading, setLoading] = useState(false);
    const { userGroups, setUserGroups, selectedConversation, setSelectedConversations } = useConversation();
    // const { authUser } = useAuthContext(); // Needed if we check against authUser._id

    const removeMember = async (groupId, userIdToRemove) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/groups/${groupId}/members/${userIdToRemove}`, {
                method: 'DELETE',
            });
            const data = await res.json(); // Expects { message, group } or { message } if group deleted

            if (!res.ok || data.error) {
                throw new Error(data.error || `Failed to remove member`);
            }

            if (data.group) { // Group still exists
                const updatedGroup = {...data.group, isDM: false};
                const updatedUserGroups = userGroups.map(g => g._id === groupId ? updatedGroup : g);
                setUserGroups(updatedUserGroups);

                if (selectedConversation?._id === groupId) {
                    setSelectedConversations(updatedGroup);
                }
            } else { // Group might have been deleted (e.g., last member removed)
                 setUserGroups(userGroups.filter(g => g._id !== groupId));
                 if (selectedConversation?._id === groupId) {
                    setSelectedConversations(null);
                }
            }

            toast.success(data.message || "Member removed successfully!");
            return true;

            // Note: If authUser._id === userIdToRemove, the backend socket event 'removedFromGroup'
            // should trigger client-side cleanup for that user. Here, we update the group state for admins.
        } catch (error) {
            console.error("Error removing member:", error);
            toast.error(error.message || "Failed to remove member.");
            return false;
        } finally {
            setLoading(false);
        }
    };
    return { loading, removeMember };
};

// Hook for leaving a group
export const useLeaveGroup = () => {
    const [loading, setLoading] = useState(false);
    const { userGroups, setUserGroups, selectedConversation, setSelectedConversations } = useConversation();

    const leaveGroup = async (groupId) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/groups/${groupId}/members/leave`, {
                method: 'POST',
            });
            const data = await res.json(); // Expects { message }

            if (!res.ok || data.error) {
                throw new Error(data.error || `Failed to leave group`);
            }

            setUserGroups(userGroups.filter(g => g._id !== groupId));
            if (selectedConversation?._id === groupId) {
                setSelectedConversations(null);
            }
            toast.success(data.message || "Successfully left the group.");
            return true;
        } catch (error) {
            console.error("Error leaving group:", error);
            toast.error(error.message || "Failed to leave group.");
            return false;
        } finally {
            setLoading(false);
        }
    };
    return { loading, leaveGroup };
};
