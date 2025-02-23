import React from "react";
import SideBar from "../../Components/sidebar/SideBar";
import MessageContainer from "../../Components/messages/MessageContainer";

const Home = () => {
  return (
    <div className="flex h-screen w-screen">
      <SideBar />
      <MessageContainer />
    </div>
  );
};

export default Home;
