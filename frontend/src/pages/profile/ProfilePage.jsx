import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { useFetchUserProfile } from '../../hooks/useUserProfile';
import ProfileDisplay from '../../Components/profile/ProfileDisplay'; // Adjust path
import EditProfileModal from '../../Components/profile/EditProfileModal'; // Adjust path
import MessageSkeleton from '../../skleton/MessageSkeleton'; // For loading state

const ProfilePage = () => {
    const { username } = useParams();
    const { authUser } = useAuthContext();
    const { profile, loading, error, fetchProfile } = useFetchUserProfile();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        if (username) {
            fetchProfile(username);
        }
    }, [username, fetchProfile]);

    const handleOpenEditModal = () => setIsEditModalOpen(true);
    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        if (username === authUser?.username) {
             fetchProfile(username);
        }
    };

    const profileForEditing = (authUser && authUser.username === username) ? authUser : null;


    if (loading) {
        return (
            <div className="container mx-auto p-4 pt-20 flex justify-center">
                <div className="w-full max-w-lg">
                    <MessageSkeleton />
                    <MessageSkeleton />
                    <MessageSkeleton />
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500 py-10">Error: {error}</div>;
    }

    if (!profile) {
        return <div className="text-center text-gray-400 py-10">User profile not found.</div>;
    }

    return (
        <div className="container mx-auto p-4 pt-10 md:pt-20">
            <ProfileDisplay profile={profile} />

            {authUser && authUser.username === profile.username && (
                <div className="text-center mt-6">
                    <button
                        onClick={handleOpenEditModal}
                        className="btn btn-primary"
                    >
                        Edit Profile
                    </button>
                </div>
            )}

            {profileForEditing && (
                <EditProfileModal
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    currentUserProfile={profileForEditing}
                />
            )}
        </div>
    );
};

export default ProfilePage;
