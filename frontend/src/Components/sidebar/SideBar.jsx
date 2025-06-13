import React, { useState } from "react";
import SearchInput from "./SearchInput";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import GroupList from "./GroupList"; // Import GroupList
import CreateGroupModal from "../modals/CreateGroupModal"; // Import CreateGroupModal

const SideBar = () => {
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

  return (
    <div className="w-full md:w-1/3 lg:w-1/4 h-screen flex flex-col bg-black/50 backdrop-blur-sm">
      {/* Top: Search */}
      <div className="p-4 border-b border-gray-700">
        <SearchInput />
      </div>

      {/* Middle: Conversations (DMs) and Groups */}
      {/* Adjust max-height carefully if both lists are long */}
      <div className="flex-1 overflow-auto">
        <Conversations />
        <div className="divider px-3 my-0 py-0"></div> {/* Visual separator */}
        <GroupList openCreateGroupModal={() => setShowCreateGroupModal(true)} />
      </div>

      {/* Bottom: Logout */}
      <div className="p-4 border-t border-gray-700 flex items-center justify-end">
        <LogoutButton />
      </div>

      {/* Modal for Creating Group */}
      {showCreateGroupModal && (
        <CreateGroupModal
          isOpen={showCreateGroupModal}
          onClose={() => setShowCreateGroupModal(false)}
        />
      )}
    </div>
  );
};

export default SideBar;
