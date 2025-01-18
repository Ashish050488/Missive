import React from 'react'
import SideBar from '../../Components/sidebar/SideBar'

const Home = () => {
  return (
    <div className='flex p-3  sm:h-[450px] md-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 '>
      <SideBar/>
      {/* <MessageContainer/> */}
    </div>
  )
}

export default Home
