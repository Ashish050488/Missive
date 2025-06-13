import React from 'react';
import useConversation from '../../zustand/useConversation';

const GroupListItem = ({ group }) => {
    const { selectedConversation, setSelectedConversations } = useConversation();
    const isSelected = selectedConversation?._id === group._id && selectedConversation?.isDM === false; // Check for group selection

    const defaultGroupIcon = "https://img.icons8.com/ios-filled/50/000000/conference-call.png"; // Example default icon

    return (
        <div
            className={`flex items-center gap-2 p-2 py-1 cursor-pointer hover:bg-sky-500 rounded ${
                isSelected ? "bg-sky-500" : ""
            }`}
            onClick={() => setSelectedConversations({ ...group, isDM: false })} // Mark as group type explicitly
        >
            <div className="avatar">
                <div className="w-10 rounded-full">
                    <img src={group.groupIcon || defaultGroupIcon} alt="group icon" />
                </div>
            </div>
            <div className="flex flex-col flex-1">
                <div className="flex justify-between gap-3">
                    <p className="font-bold text-gray-200">{group.name}</p>
                    {/* Additional info like unread count can go here */}
                </div>
            </div>
        </div>
    );
};

export default GroupListItem;
