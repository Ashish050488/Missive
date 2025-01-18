import React from 'react'
import GenderCheck from './GenderCheck'

const Signup = () => {
  return (
    <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
    <div className='h-full w-full p-6 bg-gray-800 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-10 border border-gray-100'>
      <h1 className='text-3xl font-semibold text-center text-gray-300'>SignUp To 
        <span className='text-yellow-500' > Missive</span>
      </h1>

      <form>

        {/* div 1O */}
        <div>
          <label className='label p-2'>
            <span className='text-base label-text'>Full Name</span>
          </label>
          <input type="text" placeholder='Jhon Doe' className='w-full input input-bordered h-10' />
        </div>
        {/* div 1C */}

        {/* div 2O */}
        <div>
          <label className='label p-2'>
            <span className='text-base label-text'>userName</span>
          </label>
          <input type="text" placeholder='jhondoe' className='w-full input input-bordered h-10' />
        </div>
        {/* div 2C */}

        {/*  div3O */}
        <div>
          <label className='label p-2'>
            <span className='text-base label-text'>Password</span>
          </label>
          <input type="password" placeholder='Enter Password' className='w-full input input-bordered h-10' />
        </div>
        {/*  div3C */}

        {/*  div4O */}
        <div>
          <label className='label p-2'>
            <span className='text-base label-text'>Confirm Password</span>
          </label>
          <input type="password" placeholder='Confirm Password' className='w-full input input-bordered h-10' />
        </div>
        {/*  div4C */}



        {/* Gender checkbox goes here */}
        <GenderCheck/>

      <a href="#" className='text-sm hover:underline hover:text-blue-600 mt-2 inline-block'>
        Already have an account?
      </a>

      <div>
        <button className='btn btn-block btn-sm mt-2'>Sign Up</button>
      </div>
      </form>

    </div>

  </div>
  )
}

export default Signup
