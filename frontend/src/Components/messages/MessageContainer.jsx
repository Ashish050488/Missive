import React, { useEffect, useState } from "react";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import { TiMessages } from "react-icons/ti";
import { IoIosInformationCircleOutline } from "react-icons/io"; // Example icon
import useConversation from "../../zustand/useConversation";
import { useAuthContext } from "../../context/AuthContext";
import GroupDetailsModal from "../modals/GroupDetailsModal"; // Import the modal

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversations } = useConversation();
  const [isGroupDetailsModalOpen, setIsGroupDetailsModalOpen] = useState(false);

  useEffect(() => {
    // Cleanup on unmount
    // Also close modal if selected conversation changes
    setIsGroupDetailsModalOpen(false);
    return () => setSelectedConversations(null);
  }, [setSelectedConversations]);

  return (
    <div className="w-full md:w-2/3 lg:w-3/4 h-screen flex flex-col bg-black/50 backdrop-blur-sm">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          {/* Header: conversation name */}
          <div className="bg-black/40 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
            <span className="text-lg font-bold">
              {selectedConversation.isDM === false
                ? selectedConversation.name // For group name
                : selectedConversation.fullName // For DM user full name
              }
            </span>
            {selectedConversation.isDM === false && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setIsGroupDetailsModalOpen(true)}
                title="Group Details"
              >
                <IoIosInformationCircleOutline size={24} />
              </button>
            )}
          </div>

          {/* Middle: messages */}
          <div className="flex-1 overflow-auto px-4 py-2">
            <Messages />
          </div>

          {/* Bottom: message input */}
          <div className="px-4 py-2 border-t border-gray-700">
            <MessageInput />
          </div>

          {selectedConversation.isDM === false && isGroupDetailsModalOpen && (
            <GroupDetailsModal
              group={selectedConversation}
              isOpen={isGroupDetailsModalOpen}
              onClose={() => setIsGroupDetailsModalOpen(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MessageContainer;

const NoChatSelected = () => {
  const { authUser } = useAuthContext();
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
      <p className="text-xl font-semibold">Welcome 👋 {authUser.fullName}</p>
      <p className="text-gray-400">Select a chat to start messaging</p>
      <TiMessages className="text-6xl text-gray-500 mt-2" />
    </div>
  );
};
