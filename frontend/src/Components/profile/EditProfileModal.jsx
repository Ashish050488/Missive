import React, { useState, useEffect } from 'react';
import { useUpdateUserProfile } from '../../hooks/useUserProfile'; // Adjust path as needed

const EditProfileModal = ({ isOpen, onClose, currentUserProfile }) => {
    const [fullName, setFullName] = useState('');
    const [bio, setBio] = useState('');
    const [profilePic, setProfilePic] = useState('');

    const { updateUserProfile, loading, error } = useUpdateUserProfile();

    useEffect(() => {
        if (currentUserProfile) {
            setFullName(currentUserProfile.fullName || '');
            setBio(currentUserProfile.bio || '');
            setProfilePic(currentUserProfile.profilePic || '');
        }
    }, [currentUserProfile, isOpen]); // Re-populate form when modal opens or profile changes

    const handleSubmit = async (e) => {
        e.preventDefault();
        const profileData = { fullName, bio, profilePic };

        const success = await updateUserProfile(profileData);
        if (success) {
            onClose(); // Close modal on successful update
        }
        // Error will be displayed via toast by the hook
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-200 text-2xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            className="input input-bordered w-full bg-gray-700 text-white"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Your full name"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
                            Bio
                        </label>
                        <textarea
                            id="bio"
                            rows="3"
                            className="textarea textarea-bordered w-full bg-gray-700 text-white"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell us about yourself..."
                        ></textarea>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="profilePic" className="block text-sm font-medium text-gray-300 mb-1">
                            Profile Picture URL
                        </label>
                        <input
                            type="text"
                            id="profilePic"
                            className="input input-bordered w-full bg-gray-700 text-white"
                            value={profilePic}
                            onChange={(e) => setProfilePic(e.target.value)}
                            placeholder="https://example.com/image.png"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
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
                            disabled={loading}
                        >
                            {loading ? <span className="loading loading-spinner"></span> : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
