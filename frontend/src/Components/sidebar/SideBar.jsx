import React from "react";
import SearchInput from "./SearchInput";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";

const SideBar = () => {
  return (
    <div className="w-full md:w-1/3 lg:w-1/4 h-screen flex flex-col bg-black/50 backdrop-blur-sm">
      {/* Top: Search */}
      <div className="p-4 border-b border-gray-700">
        <SearchInput />
      </div>

      {/* Middle: Conversations */}
      <div className="flex-1 overflow-auto">
        <Conversations />
      </div>

      {/* Bottom: Logout */}
      <div className="p-4 border-t border-gray-700 flex items-center justify-end">
        <LogoutButton />
      </div>
    </div>
  );
};

export default SideBar;
