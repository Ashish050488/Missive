import React from 'react';
import LazyImage from '../common/LazyImage'; // Assuming LazyImage is in common folder
import { extractTime } from '../../utils/extractTime'; // For formatting date

const ProfileDisplay = ({ profile }) => {
    if (!profile) {
        return <div className="text-center text-gray-400">No profile data to display.</div>;
    }

    const formattedJoinedDate = profile.createdAt ? extractTime(profile.createdAt, true) : 'N/A';

    return (
        <div className="bg-gray-800 shadow-xl rounded-lg p-6 w-full max-w-lg mx-auto my-8">
            <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-sky-500">
                    <LazyImage
                        src={profile.profilePic || '/default-avatar.png'}
                        alt={`${profile.fullName || profile.username}'s avatar`}
                        className="w-full h-full object-cover"
                        placeholderSrc="/default-avatar.png"
                    />
                </div>
                <h1 className="text-3xl font-bold text-white">{profile.fullName || 'N/A'}</h1>
                <p className="text-sky-400 mb-1">@{profile.username || 'username'}</p>

                {profile.bio && (
                    <p className="text-gray-300 text-center my-4 p-3 bg-gray-700 rounded-md">
                        {profile.bio}
                    </p>
                )}

                <div className="text-sm text-gray-500 mt-4">
                    Joined: {formattedJoinedDate}
                </div>
            </div>

            {/* Additional sections can be added here, e.g., mutual groups, friends, activity feed etc. */}
        </div>
    );
};

export default ProfileDisplay;
